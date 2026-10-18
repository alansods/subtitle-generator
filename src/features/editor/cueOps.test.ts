import { describe, expect, it } from 'vitest';

import type { Cue } from '@/lib/subtitles/types';

import {
  activeCueAt,
  addCueAt,
  deleteCue,
  formatClock,
  insertAfter,
  mergeWithNext,
  nudgeCue,
  splitCue,
} from './cueOps';

const CUES: Cue[] = [
  { id: 'c1', start: 0.4, end: 4.2, text: 'Olá! Neste vídeo vou mostrar' },
  { id: 'c2', start: 7, end: 9, text: 'como gerar legendas.' },
  { id: 'c3', start: 9.1, end: 11, text: 'Fim.' },
];

describe('Requirement: Editar texto e tempos na lista', () => {
  it('Scenario: Ajustar o início', () => {
    const cues = nudgeCue([{ id: 'a', start: 4.4, end: 7, text: 'x' }], 'a', 'start', 0.1, 40);
    expect(cues[0]?.start).toBe(4.5);
  });

  it('não sai de 0 nem passa da duração', () => {
    expect(
      nudgeCue([{ id: 'a', start: 0.05, end: 1, text: 'x' }], 'a', 'start', -0.1, 40)[0]?.start,
    ).toBe(0);
    expect(
      nudgeCue([{ id: 'a', start: 1, end: 39.95, text: 'x' }], 'a', 'end', 0.1, 40)[0]?.end,
    ).toBe(40);
  });
});

describe('Requirement: Ações por legenda', () => {
  it('Scenario: Dividir no cursor', () => {
    const cues = splitCue([{ id: 'a', start: 0, end: 4, text: 'abcd efgh' }], 'a', 4);
    expect(cues.map((c) => c.text)).toEqual(['abcd', 'efgh']);
    const [first, second] = cues;
    expect(first).toMatchObject({ start: 0, end: 1.738 });
    expect(second).toMatchObject({ start: 1.818, end: 4 });
  });

  it('Scenario: Juntar com a próxima', () => {
    const cues = mergeWithNext(
      [
        { id: 'a', start: 0, end: 2, text: 'Olá' },
        { id: 'b', start: 2.1, end: 4, text: 'mundo' },
      ],
      'a',
    );
    expect(cues).toEqual([{ id: 'a', start: 0, end: 4, text: 'Olá mundo' }]);
  });

  it('Scenario: Excluir', () => {
    expect(deleteCue(CUES, 'c2').map((c) => c.id)).toEqual(['c1', 'c3']);
  });

  it('Scenario: Inserir depois', () => {
    const { cues, id } = insertAfter(CUES, 'c1', 40);
    const inserted = cues.find((c) => c.id === id);
    expect(inserted).toMatchObject({ start: 4.28, end: 6.28, text: '' });
    expect(cues.map((c) => c.id)).toEqual(['c1', id, 'c2', 'c3']);
  });
});

describe('Requirement: Adicionar legenda no ponto atual', () => {
  it('Scenario: Adicionar entre cues (cálculo)', () => {
    const { cues, id } = addCueAt(
      [
        { id: 'a', start: 1, end: 7, text: 'x' },
        { id: 'b', start: 9, end: 10, text: 'y' },
      ],
      8,
      40,
    );
    expect(cues.find((c) => c.id === id)).toMatchObject({ start: 8, end: 8.92 });
  });
});

describe('utilitários', () => {
  it('acha a cue ativa e formata o tempo', () => {
    expect(activeCueAt(CUES, 5)).toBeUndefined();
    expect(activeCueAt(CUES, 7.5)?.id).toBe('c2');
    expect(formatClock(4.4)).toBe('00:04.400');
    expect(formatClock(3725.5)).toBe('1:02:05.500');
  });
});
