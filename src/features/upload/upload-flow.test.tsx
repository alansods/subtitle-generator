import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { i18n } from '@/i18n';
import { useSession } from '@/lib/session/store';
import { renderRoute } from '@/test/renderRoute';

import { probeVideo, UnplayableVideoError } from './probe';

vi.mock('./probe', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./probe')>()),
  probeVideo: vi.fn(),
}));

const MB = 1024 * 1024;

function videoFile(name: string, sizeBytes = 2 * MB, type = 'video/webm') {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

async function chooseFile(file: File) {
  const input = await screen.findByTestId('video-input');
  await userEvent.upload(input, file, { applyAccept: false });
}

beforeEach(() => {
  vi.mocked(probeVideo).mockResolvedValue({ durationSec: 3, width: 320, height: 180 });
});

describe('Requirement: Página inicial explica o uso', () => {
  it('Scenario: Passo a passo visível', async () => {
    renderRoute('/');
    const how = await screen.findByRole('region', { name: 'Como fazer sua legenda' });
    const titles = within(how)
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);
    expect(titles).toEqual([
      'Escolha o vídeo',
      'Gere a legenda',
      'Revise assistindo',
      'Baixe e pronto',
    ]);
  });

  it('Scenario: Só opções que existem', async () => {
    renderRoute('/');
    const how = await screen.findByRole('region', { name: 'Como fazer sua legenda' });
    expect(how).not.toHaveTextContent(/Desfazer e refazer/);
    expect(how).not.toHaveTextContent(/liga e desliga/);
  });

  it('Scenario: Exemplos no idioma da interface', async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
    renderRoute('/');
    const how = await screen.findByRole('region', { name: 'How to make your subtitles' });
    for (const name of [
      'team-meeting.mp4',
      'team-meeting.srt',
      'team-meeting.vtt',
      'team-meeting-subtitled.mp4',
    ]) {
      expect(within(how).getByText(name)).toBeInTheDocument();
    }
    expect(how).not.toHaveTextContent(/reuniao/);
  });
});

describe('Requirement: Seleção do arquivo', () => {
  it('Scenario: Selecionar pelo botão', async () => {
    const { router } = renderRoute('/');
    await chooseFile(videoFile('reuniao-equipe.webm'));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/transcribe');
    });
  });

  it('Scenario: Arrastar e soltar', async () => {
    const { router } = renderRoute('/');
    const dropzone = await screen.findByTestId('dropzone');
    fireEvent.drop(dropzone, { dataTransfer: { files: [videoFile('reuniao-equipe.webm')] } });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/transcribe');
    });
  });
});

describe('Requirement: Formatos aceitos', () => {
  it('Scenario: Formato não suportado', async () => {
    renderRoute('/');
    await chooseFile(videoFile('apresentacao.pdf', MB, 'application/pdf'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Use MP4, WebM ou MOV');
    expect(useSession.getState().video).toBeNull();
  });
});

describe('Requirement: Limite de tamanho', () => {
  it('Scenario: Acima do limite', async () => {
    renderRoute('/');
    await chooseFile(videoFile('grande.mp4', 742 * MB, 'video/mp4'));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'O arquivo tem 742 MB. O limite é 500 MB.',
    );
  });

  it('Scenario: Arquivo grande', async () => {
    const { router } = renderRoute('/');
    await chooseFile(videoFile('medio.mp4', 312 * MB, 'video/mp4'));
    const warning = await screen.findByRole('status');
    expect(warning).toHaveTextContent('Arquivo grande (312 MB)');
    await userEvent.click(within(warning).getByRole('button', { name: 'Continuar mesmo assim' }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/transcribe');
    });
  });
});

describe('Requirement: Vídeo reproduzível', () => {
  it('Scenario: Codec não suportado', async () => {
    vi.mocked(probeVideo).mockRejectedValue(new UnplayableVideoError());
    renderRoute('/');
    await chooseFile(videoFile('hevc.mov', 5 * MB, 'video/quicktime'));
    expect(await screen.findByRole('alert')).toHaveTextContent('Converta para MP4 (H.264)');
    expect(useSession.getState().video).toBeNull();
  });
});

describe('Requirement: Vídeo aceito inicia a sessão', () => {
  it('Scenario: Dados do vídeo na sessão', async () => {
    renderRoute('/');
    await chooseFile(videoFile('reuniao-equipe.webm'));
    await waitFor(() => {
      expect(useSession.getState().video).not.toBeNull();
    });
    expect(useSession.getState().video).toMatchObject({
      name: 'reuniao-equipe',
      fileName: 'reuniao-equipe.webm',
      mimeType: 'video/webm',
      durationSec: 3,
      width: 320,
      height: 180,
    });
  });
});
