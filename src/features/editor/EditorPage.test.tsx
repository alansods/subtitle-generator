import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { useSession } from '@/lib/session/store';
import type { Cue } from '@/lib/subtitles/types';
import { renderRoute } from '@/test/renderRoute';
import { seedSession } from '@/test/session';

const FIVE_CUES: Cue[] = [
  { id: 'c1', start: 0.4, end: 4.2, text: 'Olá! Neste vídeo vou mostrar' },
  { id: 'c2', start: 4.4, end: 7, text: 'como gerar legendas no navegador.' },
  { id: 'c3', start: 7.2, end: 10, text: 'Primeiro, o upload.' },
  { id: 'c4', start: 10.2, end: 13, text: 'Depois, a revisão.' },
  { id: 'c5', start: 13.2, end: 16, text: 'E pronto.' },
];

async function openEditor(cues: Cue[] = FIVE_CUES) {
  seedSession();
  useSession.getState().setCues(cues);
  const result = renderRoute('/edit');
  await screen.findByRole('heading', { name: 'Revisar legenda' });
  const video = result.container.querySelector('video');
  if (!video) throw new Error('sem <video>');
  const setTime = (time: number) => {
    act(() => {
      video.currentTime = time;
    });
  };
  return { ...result, video, setTime };
}

const controls = () => within(screen.getByRole('group', { name: 'Controles do vídeo' }));
const overlayButton = () => screen.queryByRole('button', { name: /^Editar legenda:/ });
function present<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) throw new Error(`${what} não encontrado`);
  return value;
}
const cueText = (id: string) => useSession.getState().cues.find((cue) => cue.id === id)?.text;

describe('Requirement: Player com controles', () => {
  it('Scenario: Reproduzir e pausar', async () => {
    const { video } = await openEditor();
    await userEvent.click(controls().getByRole('button', { name: 'Reproduzir' }));
    expect(video.paused).toBe(false);
    expect(controls().getByRole('button', { name: 'Pausar' })).toBeInTheDocument();
  });

  it('Scenario: Mudar a velocidade', async () => {
    const { video } = await openEditor();
    await userEvent.selectOptions(controls().getByLabelText('Velocidade'), '1.5');
    expect(video.playbackRate).toBe(1.5);
  });
});

describe('Requirement: Legenda sobre o vídeo em tempo real', () => {
  it('Scenario: Cue ativa', async () => {
    const { setTime } = await openEditor();
    setTime(5);
    expect(overlayButton()).toHaveTextContent('como gerar legendas no navegador.');
  });

  it('Scenario: Entre cues', async () => {
    const { setTime } = await openEditor();
    setTime(4.3);
    expect(overlayButton()).not.toBeInTheDocument();
  });
});

describe('Requirement: Editar na própria legenda', () => {
  async function startEditing() {
    const editor = await openEditor();
    editor.setTime(5);
    await userEvent.click(present(overlayButton(), 'legenda sobre o vídeo'));
    const field = screen.getByRole('textbox', { name: 'Editar legenda' });
    return { ...editor, field };
  }

  it('Scenario: Corrigir e salvar com Enter', async () => {
    const { field, video } = await startEditing();
    expect(video.paused).toBe(true);
    await userEvent.clear(field);
    await userEvent.type(field, 'Novo texto{Enter}');
    expect(cueText('c2')).toBe('Novo texto');
    expect(screen.queryByRole('textbox', { name: 'Editar legenda' })).not.toBeInTheDocument();
  });

  it('Scenario: Quebra de linha', async () => {
    const { field } = await startEditing();
    await userEvent.type(field, '{Shift>}{Enter}{/Shift}fim');
    expect(field).toBeInTheDocument();
    expect((field as HTMLTextAreaElement).value).toContain('\nfim');
  });

  it('Scenario: Cancelar com Esc', async () => {
    const { field } = await startEditing();
    await userEvent.type(field, ' alterado{Escape}');
    expect(cueText('c2')).toBe('como gerar legendas no navegador.');
  });

  it('Scenario: Salvar ao sair do campo', async () => {
    const { field } = await startEditing();
    await userEvent.clear(field);
    await userEvent.type(field, 'Salvo no blur');
    await userEvent.click(screen.getByRole('heading', { name: 'Revisar legenda' }));
    expect(cueText('c2')).toBe('Salvo no blur');
  });
});

describe('Requirement: Adicionar legenda no ponto atual', () => {
  it('Scenario: Adicionar entre cues', async () => {
    const { setTime } = await openEditor([
      { id: 'a', start: 1, end: 7, text: 'Antes' },
      { id: 'b', start: 9, end: 10, text: 'Depois' },
    ]);
    setTime(8);
    await userEvent.click(screen.getByRole('button', { name: '+ Adicionar legenda aqui' }));
    expect(screen.getByRole('textbox', { name: 'Editar legenda' })).toHaveFocus();
    expect(useSession.getState().cues.map(({ start, end }) => [start, end])).toEqual([
      [1, 7],
      [8, 8.92],
      [9, 10],
    ]);
  });
});

describe('Requirement: Lista de legendas', () => {
  it('Scenario: Ir para uma cue', async () => {
    const { video } = await openEditor();
    await userEvent.click(screen.getByRole('button', { name: 'Ir para a legenda 2' }));
    expect(video.currentTime).toBeCloseTo(4.4, 2);
    const list = screen.getByTestId('cue-list');
    const items = within(list).getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('aria-current', 'true');
    expect(items[1]).toHaveTextContent('Tocando agora');
    expect(within(list).getAllByText('Tocando agora')).toHaveLength(1);
  });
});

describe('Requirement: Seguir vídeo', () => {
  function spyScroll() {
    const list = screen.getByTestId('cue-list');
    const row = list.querySelector('[data-cue-id="c5"]');
    if (!row) throw new Error('sem linha c5');
    Object.defineProperty(row, 'offsetTop', { configurable: true, value: 400 });
    const setter = vi.fn();
    Object.defineProperty(list, 'scrollTop', { configurable: true, get: () => 0, set: setter });
    return setter;
  }

  it('Scenario: Lista acompanha o vídeo', async () => {
    const { setTime } = await openEditor();
    const setter = spyScroll();
    setTime(14);
    await waitFor(() => {
      expect(setter).toHaveBeenCalledWith(392);
    });
  });

  it('Scenario: Seguir desligado', async () => {
    const { setTime } = await openEditor();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Seguir vídeo' }));
    const setter = spyScroll();
    setTime(14);
    expect(setter).not.toHaveBeenCalled();
  });
});

describe('Requirement: Editar texto e tempos na lista', () => {
  it('Scenario: Editar o texto na lista', async () => {
    const { setTime } = await openEditor();
    const field = screen.getByRole('textbox', { name: 'Texto da legenda 1' });
    await userEvent.clear(field);
    await userEvent.type(field, 'Corrigido na lista');
    expect(cueText('c1')).toBe('Corrigido na lista');
    setTime(1);
    expect(overlayButton()).toHaveTextContent('Corrigido na lista');
  });

  it('Scenario: Ajustar o início (interface)', async () => {
    await openEditor();
    await userEvent.click(screen.getByRole('button', { name: 'Início da legenda 2 0,1 s depois' }));
    expect(useSession.getState().cues.find((cue) => cue.id === 'c2')?.start).toBe(4.5);
  });
});

describe('Requirement: Ações por legenda', () => {
  it('juntar, inserir e excluir pela interface', async () => {
    await openEditor();
    const rows = () => within(screen.getByTestId('cue-list')).getAllByRole('listitem');
    const row = (index: number) => within(present(rows().at(index), `linha ${String(index)}`));
    await userEvent.click(row(0).getByRole('button', { name: 'Juntar com a próxima' }));
    expect(useSession.getState().cues).toHaveLength(4);
    await userEvent.click(row(0).getByRole('button', { name: 'Inserir depois' }));
    expect(useSession.getState().cues).toHaveLength(5);
    expect(useSession.getState().cues[1]?.text).toBe('');
    await userEvent.click(row(1).getByRole('button', { name: 'Excluir' }));
    expect(useSession.getState().cues).toHaveLength(4);
    expect(row(-1).getByRole('button', { name: 'Juntar com a próxima' })).toBeDisabled();
  });
});

describe('Requirement: Idioma da interface não muda a legenda', () => {
  it('Scenario: Trocar para inglês no editor', async () => {
    await openEditor();
    await userEvent.click(screen.getByRole('button', { name: 'EN' }));
    expect(screen.getByRole('group', { name: 'Video controls' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Text of subtitle 1' })).toHaveValue(
      'Olá! Neste vídeo vou mostrar',
    );
    expect(useSession.getState().cues.map((cue) => cue.text)).toEqual(
      FIVE_CUES.map((cue) => cue.text),
    );
  });
});
