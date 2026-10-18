import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { useSession } from '@/lib/session/store';
import type { Cue } from '@/lib/subtitles/types';
import { renderRoute } from '@/test/renderRoute';
import { seedSession } from '@/test/session';

async function openEditor(cues: Cue[]) {
  seedSession();
  useSession.getState().setCues(cues);
  renderRoute('/edit');
  await screen.findByRole('heading', { name: 'Editar legenda' });
  return within(screen.getByTestId('cue-list'));
}

const GOOD = (id: string, start: number) => ({
  id,
  start,
  end: start + 2.5,
  text: 'Tudo certo aqui',
});

describe('Requirement: Problemas visíveis na lista', () => {
  it('Scenario: Selos na cue', async () => {
    const list = await openEditor([
      { id: 'a', start: 0, end: 3.3, text: 'Clique na legenda para corrigir qualquer palavra.' },
      GOOD('b', 4),
    ]);
    const row = (id: string) => {
      const element = list.getAllByRole('listitem').find((li) => li.dataset.cueId === id);
      if (!element) throw new Error(`linha ${id} não encontrada`);
      return within(element);
    };
    expect(row('a').getByText('Linha com mais de 42 caracteres')).toBeInTheDocument();
    expect(row('b').queryByText(/caracteres/)).not.toBeInTheDocument();
  });
});

describe('Requirement: Resumo e filtro', () => {
  it('Scenario: Filtrar pelas cues com problema', async () => {
    const list = await openEditor([
      GOOD('a', 0),
      { id: 'b', start: 3, end: 3.9, text: 'Um\ndois\ntrês' },
      GOOD('c', 4),
      {
        id: 'd',
        start: 7,
        end: 11,
        text: 'Uma linha que passa bastante dos quarenta e dois caracteres',
      },
      GOOD('e', 11.2),
    ]);
    const rows = () => list.getAllByRole('listitem').filter((li) => li.dataset.cueId);
    expect(rows()).toHaveLength(5);
    await userEvent.click(screen.getByRole('button', { name: '2 avisos' }));
    expect(rows().map((li) => li.dataset.cueId)).toEqual(['b', 'd']);
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar todas' }));
    expect(rows()).toHaveLength(5);
  });

  it('Scenario: Sem problemas', async () => {
    await openEditor([GOOD('a', 0), GOOD('b', 3)]);
    expect(screen.queryByRole('button', { name: /aviso|erro/ })).not.toBeInTheDocument();
  });

  it('mostra erros e avisos juntos no resumo', async () => {
    await openEditor([
      { id: 'a', start: 0, end: 3, text: '' },
      {
        id: 'b',
        start: 3.1,
        end: 5,
        text: 'Uma linha que passa bastante dos quarenta e dois caracteres',
      },
    ]);
    expect(screen.getByRole('button', { name: '1 erro · 1 aviso' })).toBeInTheDocument();
  });
});
