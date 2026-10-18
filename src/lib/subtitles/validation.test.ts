import { describe, expect, it } from 'vitest';

import type { Cue } from './types';
import { summarizeIssues, validateCue, validateCues } from './validation';

const cue = (start: number, end: number, text: string, id = 'x'): Cue => ({ id, start, end, text });
const codes = (c: Cue, next?: Cue) => validateCue(c, next).map((issue) => issue.code);

describe('Requirement: Erros de legenda', () => {
  it('Scenario: Início depois do fim', () => {
    expect(validateCue(cue(5, 4, 'texto'))).toContainEqual({ code: 'order', level: 'error' });
  });

  it('Scenario: Sobreposição', () => {
    expect(codes(cue(4.4, 7.2, 'texto'), cue(7, 9, 'outra'))).toContain('overlap');
  });

  it('Scenario: Texto vazio', () => {
    expect(validateCue(cue(1, 3, '   '))).toContainEqual({ code: 'empty', level: 'error' });
  });
});

describe('Requirement: Avisos de legenda', () => {
  it('Scenario: Linha longa', () => {
    const text = 'Clique na legenda para corrigir qualquer palavra.';
    expect(text).toHaveLength(49);
    expect(validateCue(cue(0, 3.3, text))).toContainEqual({ code: 'lineLength', level: 'warning' });
  });

  it('Scenario: Três linhas', () => {
    expect(codes(cue(0, 6, 'um\ndois\ntrês'))).toContain('lines');
  });

  it('Scenario: Muito curta e muito longa', () => {
    expect(validateCue(cue(0, 0.5, 'Oi.'))).toEqual([]);
    expect(validateCue(cue(0, 8, 'Uma fala longa e lenta'))).toEqual([]);
  });

  it('Scenario: Leitura rápida', () => {
    expect(validateCue(cue(18.66, 19.88, 'características principais.'))).toEqual([]);
  });

  it('Scenario: Cue boa', () => {
    expect(validateCue(cue(0, 3, 'Uma linha de trinta caracteres'), cue(3.1, 5, 'x'))).toEqual([]);
  });
});

describe('resumo', () => {
  it('conta erros, avisos e cues com problema', () => {
    const issues = validateCues([
      cue(0, 0.9, 'um\ndois\ntrês', 'a'),
      cue(1, 3, '', 'b'),
      cue(3.1, 5, 'Tudo certo aqui', 'c'),
    ]);
    expect(summarizeIssues(issues)).toEqual({
      errors: 1,
      warnings: 1,
      cuesWithErrors: 1,
      cuesWithIssues: 2,
    });
  });
});
