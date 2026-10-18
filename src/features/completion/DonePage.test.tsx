import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

import { useSession } from '@/lib/session/store';
import { renderRoute } from '@/test/renderRoute';
import { seedSession } from '@/test/session';

let clicked: string[] = [];
let createUrl: MockInstance<typeof URL.createObjectURL>;

beforeEach(() => {
  clicked = [];
  createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    clicked.push(this.download);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function openDone(fileName = 'reuniao.srt') {
  seedSession({ cues: true });
  useSession.getState().markDownloaded({ kind: 'subtitle', fileName });
  const result = renderRoute('/done');
  await screen.findByRole('heading', { name: 'Pronto! Sua legenda foi baixada.' });
  return result;
}

describe('Requirement: Tela de finalização', () => {
  it('Scenario: Confirmação do download', async () => {
    await openDone();
    expect(screen.getByText('reuniao.srt')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voltar a editar este vídeo/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Fazer nova legenda/ })).toBeInTheDocument();
    expect(screen.getByText(/Nada foi guardado/)).toBeInTheDocument();
  });
});

describe('Requirement: Só depois de baixar', () => {
  it('Scenario: Sem download', async () => {
    seedSession({ cues: true });
    const { router } = renderRoute('/done');
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/export');
    });
  });
});

describe('Requirement: Baixar de novo', () => {
  it('Scenario: Segundo download', async () => {
    await openDone('reuniao.vtt');
    await userEvent.click(screen.getByRole('button', { name: 'Baixar de novo' }));
    expect(clicked).toEqual(['reuniao.vtt']);
    const blob = createUrl.mock.calls.at(-1)?.[0] as Blob;
    expect(await blob.text()).toMatch(/^WEBVTT\n\n00:00:00\.400 --> 00:00:04\.200\n/);
  });
});

describe('Requirement: Baixar de novo', () => {
  it('Scenario: Baixar o vídeo de novo', async () => {
    seedSession({ cues: true });
    const mp4 = new Blob(['mp4'], { type: 'video/mp4' });
    useSession
      .getState()
      .markDownloaded({ kind: 'video', fileName: 'reuniao-legendado.mp4', blob: mp4 });
    renderRoute('/done');
    await screen.findByRole('heading', { name: 'Pronto! Seu vídeo foi baixado.' });
    await userEvent.click(screen.getByRole('button', { name: 'Baixar de novo' }));
    expect(clicked).toEqual(['reuniao-legendado.mp4']);
    expect(createUrl.mock.calls.at(-1)?.[0]).toBe(mp4);
  });
});

describe('Requirement: Voltar a editar este vídeo', () => {
  it('Scenario: Voltar ao editor', async () => {
    const { router } = await openDone();
    const before = useSession.getState().cues;
    await userEvent.click(screen.getByRole('link', { name: /Voltar a editar este vídeo/ }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/edit');
    });
    expect(useSession.getState().cues).toEqual(before);
  });
});

describe('Requirement: Fazer nova legenda', () => {
  it('Scenario: Começar outra', async () => {
    const { router } = await openDone();
    await userEvent.click(screen.getByRole('link', { name: /Fazer nova legenda/ }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(useSession.getState().video).toBeNull();
    expect(useSession.getState().cues).toEqual([]);
  });
});
