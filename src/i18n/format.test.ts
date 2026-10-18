import { describe, expect, it } from 'vitest';

import { formatNumber } from './format';

describe('Requirement: Formatação conforme o idioma', () => {
  it('Scenario: Número em português', () => {
    expect(formatNumber(1234.5, 'pt-BR')).toBe('1.234,5');
  });

  it('Scenario: Número em inglês', () => {
    expect(formatNumber(1234.5, 'en')).toBe('1,234.5');
  });
});
