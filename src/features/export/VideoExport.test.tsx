import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BurnInInput, ExportProgress, VideoExporter } from '@/lib/media/videoExport';
import { useSession } from '@/lib/session/store';
import { renderRoute } from '@/test/renderRoute';
import { seedSession } from '@/test/session';

import { remainingSeconds } from './useVideoExport';

// Exportador controlado pelo teste: progresso, fim e falha disparados à mão.
interface Run {
  input: BurnInInput;
  progress: (event: ExportProgress) => void;
  finish: (blob: Blob) => void;
  fail: (error: Error) => void;
  cancelled: boolean;
}
let runs: Run[] = [];

vi.mock('@/lib/media/videoExport', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/media/videoExport')>();
  return {
    ...actual,
    createVideoExporter: (): VideoExporter => {
      let current: Run | undefined;
      return {
        run: (input, onProgress) =>
          new Promise<Blob>((resolve, reject) => {
            current = {
              input,
              progress: onProgress,
              finish: resolve,
              fail: reject,
              cancelled: false,
            };
            runs.push(current);
          }),
        cancel: () => {
          if (current) current.cancelled = true;
          current?.fail(new actual.VideoExportCancelled());
        },
      };
    },
  };
});

const lastRun = () => {
  const run = runs.at(-1);
  if (!run) throw new Error('nenhuma geração iniciada');
  return run;
};

let clicked: string[] = [];
let blobs: Blob[] = [];

beforeEach(() => {
  runs = [];
  clicked = [];
  blobs = [];
  vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
    blobs.push(blob as Blob);
    return 'blob:test';
  });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    clicked.push(this.download);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function openVideoExport() {
  seedSession({ cues: true });
  const result = renderRoute('/export');
  await screen.findByRole('heading', { name: 'Baixar' });
  await userEvent.click(screen.getByRole('radio', { name: /Vídeo com legenda/ }));
  return result;
}

const generate = () => userEvent.click(screen.getByRole('button', { name: 'Gerar vídeo' }));

describe('Requirement: Opção de vídeo com legenda', () => {
  it('Scenario: Escolher vídeo com legenda', async () => {
    await openVideoExport();
    expect(screen.getByRole('region', { name: 'Estilo da legenda' })).toBeInTheDocument();
    expect(screen.getByRole('figure', { name: 'Prévia da legenda no vídeo' })).toBeInTheDocument();
    expect(screen.getByTestId('video-file-name')).toHaveTextContent('reuniao-legendado.mp4');
    expect(screen.getByRole('button', { name: 'Gerar vídeo' })).toBeEnabled();
    // A opção de só legenda continua disponível.
    expect(screen.getByRole('radio', { name: /Somente legenda/ })).toBeInTheDocument();
  });
});

describe('Requirement: Prévia no estilo escolhido', () => {
  it('Scenario: Prévia acompanha o estilo', async () => {
    await openVideoExport();
    const cue = screen.getByTestId('preview-cue');
    expect(cue).toHaveTextContent('Olá! Neste vídeo vou mostrar');
    expect(cue).toHaveStyle({ background: '#000', color: '#fff' });
    await userEvent.click(screen.getByRole('radio', { name: 'Branco' }));
    expect(screen.getByTestId('preview-cue')).toHaveStyle({ background: '#fff', color: '#000' });
  });
});

describe('Requirement: Erros bloqueiam a geração', () => {
  it('Scenario: Legenda com erro', async () => {
    await openVideoExport();
    act(() => {
      useSession.getState().updateCue('c2', { text: '' });
    });
    expect(screen.getByRole('button', { name: 'Gerar vídeo' })).toBeDisabled();
  });
});

describe('Requirement: Progresso e cancelamento', () => {
  it('Scenario: Andamento', async () => {
    await openVideoExport();
    await generate();
    expect(screen.getByRole('heading', { name: 'Preparando' })).toBeInTheDocument();
    expect(lastRun().input).toMatchObject({
      width: 1280,
      height: 720,
      style: { background: 'black' },
    });
    act(() => {
      lastRun().progress({ stage: 'encode', ratio: 0.4 });
    });
    expect(screen.getByRole('heading', { name: 'Gerando vídeo' })).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Gerando vídeo' })).toHaveAttribute(
      'aria-valuenow',
      '40',
    );
  });

  it('estima o tempo restante pela taxa desde o início', () => {
    expect(remainingSeconds(0.4, 20_000)).toBe(30);
    expect(remainingSeconds(0.01, 1_000)).toBeNull();
  });

  it('Scenario: Cancelar a geração', async () => {
    await openVideoExport();
    await generate();
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(lastRun().cancelled).toBe(true);
    expect(screen.getByRole('button', { name: 'Gerar vídeo' })).toBeEnabled();
    expect(clicked).toEqual([]);
  });

  it('Scenario: Sair durante a geração', async () => {
    const { router } = await openVideoExport();
    await generate();
    await userEvent.click(screen.getByRole('link', { name: 'Voltar' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Cancelar a geração do vídeo?' });
    expect(router.state.location.pathname).toBe('/export');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Sair e cancelar' }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/edit');
    });
    expect(lastRun().cancelled).toBe(true);
  });
});

describe('Requirement: Conclusão do vídeo', () => {
  it('Scenario: Vídeo pronto', async () => {
    const { router } = await openVideoExport();
    await generate();
    const mp4 = new Blob(['mp4'], { type: 'video/mp4' });
    await act(async () => {
      lastRun().finish(mp4);
      await Promise.resolve();
    });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/done');
    });
    expect(clicked).toEqual(['reuniao-legendado.mp4']);
    expect(blobs.at(-1)).toBe(mp4);
    expect(useSession.getState().downloaded).toEqual({
      kind: 'video',
      fileName: 'reuniao-legendado.mp4',
      blob: mp4,
    });
    expect(
      await screen.findByRole('heading', { name: 'Pronto! Seu vídeo foi baixado.' }),
    ).toBeInTheDocument();
  });
});

describe('Requirement: Falha na geração', () => {
  it('Scenario: Erro do ffmpeg', async () => {
    await openVideoExport();
    await generate();
    await act(async () => {
      lastRun().fail(new Error('ffmpeg terminou com código 1'));
      await Promise.resolve();
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível gerar o vídeo. Tente de novo.',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    expect(runs).toHaveLength(2);
  });
});
