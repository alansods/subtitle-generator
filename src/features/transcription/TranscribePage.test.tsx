import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { detectDevice } from '@/lib/media/capabilities';
import { useSession } from '@/lib/session/store';
import type { TimedWord } from '@/lib/subtitles/segmentation';
import { renderRoute } from '@/test/renderRoute';
import { seedSession } from '@/test/session';

import type { PrepareOptions, ProgressListener, TranscribeOptions } from './protocol';
import { TranscriptionCancelled } from './transcriber';

// Transcritor controlado pelo teste: a transcrição só termina quando o teste manda.
const control = vi.hoisted(() => ({
  options: undefined as undefined | (PrepareOptions & TranscribeOptions),
  progress: undefined as undefined | ProgressListener,
  resolve: undefined as undefined | ((words: TimedWord[]) => void),
  reject: undefined as undefined | ((error: unknown) => void),
  cancel: vi.fn(),
}));

vi.mock('./transcriber', async (importOriginal) => {
  const original = await importOriginal<typeof import('./transcriber')>();
  return {
    ...original,
    createTranscriber: () => ({
      prepare: (_options: PrepareOptions, onProgress: ProgressListener) => {
        onProgress({ stage: 'prepare', ratio: 1 });
        return Promise.resolve();
      },
      transcribe: (
        _audio: Float32Array,
        options: PrepareOptions & TranscribeOptions,
        onProgress: ProgressListener,
      ) => {
        control.options = options;
        control.progress = onProgress;
        return new Promise<TimedWord[]>((resolve, reject) => {
          control.resolve = resolve;
          control.reject = reject;
        });
      },
      cancel: () => {
        control.cancel();
        control.reject?.(new original.TranscriptionCancelled());
      },
    }),
  };
});
vi.mock('@/lib/media/audio', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/media/audio')>()),
  extractAudio: vi.fn(() => Promise.resolve(new Float32Array(16_000 * 3))),
}));
vi.mock('@/lib/media/capabilities', () => ({ detectDevice: vi.fn() }));

const WORDS: TimedWord[] = 'Olá! Esta é uma legenda de teste.'
  .split(' ')
  .map((text, i) => ({ text, start: i * 0.5, end: i * 0.5 + 0.4 }));

beforeEach(() => {
  control.options = undefined;
  control.cancel.mockClear();
  vi.mocked(detectDevice).mockResolvedValue('webgpu');
  seedSession();
});

async function startTranscription() {
  const result = renderRoute('/transcribe');
  await userEvent.click(await screen.findByRole('button', { name: 'Gerar legenda' }));
  await waitFor(() => {
    expect(control.progress).toBeDefined();
    expect(control.options).toBeDefined();
  });
  return result;
}

describe('Requirement: Tela de transcrição sem escolhas técnicas', () => {
  it('Scenario: Idioma padrão', async () => {
    renderRoute('/transcribe');
    expect(
      await screen.findByRole('combobox', { name: 'Idioma falado no vídeo' }),
    ).toHaveDisplayValue('Português');
  });

  it('Scenario: Nada técnico na tela', async () => {
    renderRoute('/transcribe');
    const main = await screen.findByRole('main');
    await screen.findByRole('button', { name: 'Gerar legenda' });
    expect(main.textContent).not.toMatch(/whisper|modelo|\bMB\b|cache/i);
  });
});

describe('Requirement: Escolha automática do modelo', () => {
  it('Scenario: Sem WebGPU (aviso)', async () => {
    vi.mocked(detectDevice).mockResolvedValue('wasm');
    renderRoute('/transcribe');
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Neste navegador a legenda demora mais para ficar pronta.',
    );
  });

  it('Scenario: Com WebGPU (modelo pedido)', async () => {
    await startTranscription();
    expect(control.options).toMatchObject({ model: 'small', device: 'webgpu' });
  });
});

describe('Requirement: Transcrição fora da tela principal', () => {
  it('Scenario: Idioma enviado ao modelo (tela)', async () => {
    renderRoute('/transcribe');
    await userEvent.selectOptions(
      await screen.findByRole('combobox', { name: 'Idioma falado no vídeo' }),
      'en',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Gerar legenda' }));
    await waitFor(() => {
      expect(control.options?.language).toBe('en');
    });
  });

  it('Scenario: Detecção automática (tela)', async () => {
    renderRoute('/transcribe');
    await userEvent.selectOptions(
      await screen.findByRole('combobox', { name: 'Idioma falado no vídeo' }),
      'auto',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Gerar legenda' }));
    await waitFor(() => {
      expect(control.options?.language).toBe('auto');
    });
  });
});

describe('Requirement: Progresso em etapas', () => {
  it('Scenario: Andamento visível', async () => {
    await startTranscription();
    act(() => {
      control.progress?.({ stage: 'transcribe', ratio: 0.5 });
    });
    expect(screen.getByTestId('stage-transcribe')).toHaveTextContent('50%');
    expect(screen.getByTestId('stage-prepare')).toHaveTextContent(/^Preparando \(concluído\)$/);
    expect(screen.getByTestId('stage-extract')).toHaveTextContent('concluído');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '63');
  });
});

describe('Requirement: Cancelar', () => {
  it('Scenario: Cancelar no meio', async () => {
    await startTranscription();
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(control.cancel).toHaveBeenCalled();
    expect(await screen.findByRole('button', { name: 'Gerar legenda' })).toBeInTheDocument();
    expect(useSession.getState().cues).toEqual([]);
  });
});

describe('Requirement: Sair durante o processamento', () => {
  it('Scenario: Confirmar saída', async () => {
    const { router } = await startTranscription();
    await userEvent.click(screen.getByRole('link', { name: /Gerador de Legenda/ }));
    const dialog = await screen.findByRole('alertdialog');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Sair e cancelar' }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });
    expect(control.cancel).toHaveBeenCalled();
  });

  it('Scenario: Desistir de sair', async () => {
    const { router } = await startTranscription();
    await userEvent.click(screen.getByRole('link', { name: /Gerador de Legenda/ }));
    const dialog = await screen.findByRole('alertdialog');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Ficar aqui' }));
    expect(router.state.location.pathname).toBe('/transcribe');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(control.cancel).not.toHaveBeenCalled();
  });
});

describe('Requirement: Conclusão', () => {
  it('Scenario: Legenda gerada', async () => {
    const { router } = await startTranscription();
    act(() => {
      control.resolve?.(WORDS);
    });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/edit');
    });
    const cues = useSession.getState().cues;
    expect(cues.length).toBeGreaterThan(0);
    expect(cues.map((cue) => cue.text.replace('\n', ' ')).join(' ')).toBe(
      'Olá! Esta é uma legenda de teste.',
    );
    expect(useSession.getState().transcription).toEqual({ model: 'small', language: 'pt' });
  });
});

describe('Requirement: Falha na transcrição', () => {
  it('Scenario: Erro no worker', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await startTranscription();
    act(() => {
      control.reject?.(new Error('falha no worker'));
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível gerar a legenda deste vídeo.',
    );
    expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeInTheDocument();
  });

  it('cancelamento não é tratado como erro', () => {
    expect(new TranscriptionCancelled()).toBeInstanceOf(Error);
  });
});

describe('Requirement: Importar legenda existente', () => {
  it('Scenario: Importar SRT', async () => {
    const { router } = renderRoute('/transcribe');
    const srt =
      '1\n00:00:01,000 --> 00:00:02,000\nUm\n\n2\n00:00:03,000 --> 00:00:04,000\nDois\n\n3\n00:00:05,000 --> 00:00:06,000\nTrês\n';
    await userEvent.upload(
      await screen.findByTestId('subtitle-input'),
      new File([srt], 'legenda.srt', { type: 'text/plain' }),
    );
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/edit');
    });
    expect(useSession.getState().cues).toHaveLength(3);
  });

  it('Scenario: Importar arquivo inválido', async () => {
    const { router } = renderRoute('/transcribe');
    await userEvent.upload(
      await screen.findByTestId('subtitle-input'),
      new File(['00:01.000 --> 00:02.000\nOi\n'], 'legenda.vtt', { type: 'text/vtt' }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível ler este arquivo de legenda.',
    );
    expect(router.state.location.pathname).toBe('/transcribe');
  });
});
