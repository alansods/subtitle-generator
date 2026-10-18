import { describe, expect, it } from 'vitest';

import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('Requirement: Textos vindos dos arquivos de tradução', () => {
  it('Scenario: Paridade de chaves', () => {
    expect(flattenKeys(en).sort()).toEqual(flattenKeys(ptBR).sort());
  });
});
