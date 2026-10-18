import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

import { downloadText } from '@/lib/download';
import { useSession } from '@/lib/session/store';
import { renderRoute } from '@/test/renderRoute';
import { seedSession } from '@/test/session';

let clicked: { name: string; href: string }[] = [];
let createUrl: MockInstance<typeof URL.createObjectURL>;

beforeEach(() => {
  clicked = [];
  createUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    clicked.push({ name: this.download, href: this.href });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const lastBlob = () => createUrl.mock.calls.at(-1)?.[0] as Blob;

async function openExport() {
  const result = renderRoute('/export');
  await screen.findByRole('heading', { name: 'Exportar' });
  return result;
}

describe('downloadText', () => {
  it('entrega um arquivo UTF-8 com o nome pedido', async () => {
    downloadText('a.srt', 'Olá', 'application/x-subrip');
    expect(clicked).toEqual([{ name: 'a.srt', href: expect.stringContaining('blob:') as string }]);
    expect(lastBlob().type).toBe('application/x-subrip;charset=utf-8');
    expect(await lastBlob().text()).toBe('Olá');
  });
});

describe('Requirement: Tela de download da legenda', () => {
  it('Scenario: Nome do arquivo', async () => {
    seedSession({ cues: true });
    await openExport();
    expect(screen.getByTestId('file-name')).toHaveTextContent('reuniao.srt');
    await userEvent.click(screen.getByRole('radio', { name: 'VTT' }));
    expect(screen.getByTestId('file-name')).toHaveTextContent('reuniao.vtt');
  });
});

describe('Requirement: Baixar a legenda', () => {
  it('Scenario: Baixar SRT', async () => {
    seedSession({ cues: true });
    const { router } = await openExport();
    await userEvent.click(screen.getByRole('button', { name: 'Baixar legenda' }));
    expect(clicked.map((c) => c.name)).toEqual(['reuniao.srt']);
    expect(await lastBlob().text()).toBe(
      '1\n00:00:00,400 --> 00:00:04,200\nOlá! Neste vídeo vou mostrar\n\n2\n00:00:04,400 --> 00:00:07,000\ncomo gerar legendas no navegador.\n',
    );
    expect(useSession.getState().downloaded).toEqual({ kind: 'subtitle', fileName: 'reuniao.srt' });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/done');
    });
  });

  it('Scenario: Início depois de baixar', async () => {
    seedSession({ cues: true });
    const { router } = await openExport();
    await userEvent.click(screen.getByRole('button', { name: 'Baixar legenda' }));
    await userEvent.click(screen.getByRole('link', { name: /Gerador de Legenda/ }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});

describe('Requirement: Erros bloqueiam o download', () => {
  it('Scenario: Legenda com erro', async () => {
    seedSession({ cues: true });
    useSession.getState().updateCue('c2', { text: '   ' });
    await openExport();
    expect(screen.getByRole('button', { name: 'Baixar legenda' })).toBeDisabled();
    expect(screen.getByRole('alert')).toHaveTextContent('1 legenda tem erro.');
    expect(screen.getByRole('link', { name: 'Corrigir no editor' })).toBeInTheDocument();
  });

  it('Scenario: Só avisos', async () => {
    seedSession({ cues: true });
    useSession.getState().updateCue('c2', { text: 'um\ndois\ntrês' }); // aviso: mais de 2 linhas
    await openExport();
    expect(screen.getByRole('button', { name: 'Baixar legenda' })).toBeEnabled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('Requirement: Voltar ao editor', () => {
  it('Scenario: Voltar', async () => {
    seedSession({ cues: true });
    const { router } = await openExport();
    await userEvent.click(screen.getByRole('link', { name: 'Voltar ao editor' }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/edit');
    });
  });
});
