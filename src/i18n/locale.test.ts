import { describe, expect, it } from 'vitest';

import { detectInitialLocale, SUPPORTED_LOCALES } from './locale';

describe('Requirement: Idiomas suportados', () => {
  it('Scenario: Idiomas disponíveis', () => {
    expect([...SUPPORTED_LOCALES]).toEqual(['pt-BR', 'en']);
  });
});

describe('Requirement: Idioma inicial', () => {
  it('Scenario: Idioma salvo tem prioridade', () => {
    expect(detectInitialLocale('en', 'pt-BR')).toBe('en');
  });

  it('Scenario: Navegador em português de Portugal', () => {
    expect(detectInitialLocale(undefined, 'pt-PT')).toBe('pt-BR');
  });

  it('Scenario: Navegador em outro idioma', () => {
    expect(detectInitialLocale(undefined, 'fr-FR')).toBe('en');
  });

  it('Scenario: Valor salvo inválido', () => {
    expect(detectInitialLocale('es', 'en-US')).toBe('en');
  });
});
