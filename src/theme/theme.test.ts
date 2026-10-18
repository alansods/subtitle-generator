import { beforeEach, describe, expect, it } from 'vitest';

import { mockMatchMedia } from '@/test/matchMedia';

import { getThemeState, initTheme, THEME_STORAGE_KEY, toggleTheme } from './theme';

const html = document.documentElement;

beforeEach(() => {
  html.classList.remove('dark');
});

describe('Requirement: Modos de tema', () => {
  it('Scenario: Sistema escuro sem escolha salva', () => {
    mockMatchMedia(true);
    initTheme();
    expect(getThemeState()).toEqual({ mode: 'system', resolved: 'dark' });
    expect(html.classList.contains('dark')).toBe(true);
  });

  it('Scenario: Escolha salva vence o sistema', () => {
    mockMatchMedia(true);
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
    initTheme();
    expect(getThemeState().resolved).toBe('light');
    expect(html.classList.contains('dark')).toBe(false);
  });

  it('Scenario: Valor salvo inválido', () => {
    mockMatchMedia(false);
    window.localStorage.setItem(THEME_STORAGE_KEY, 'roxo');
    initTheme();
    expect(getThemeState().mode).toBe('system');
  });
});

describe('Requirement: Alternância e persistência', () => {
  it('Scenario: Alternar a partir do sistema escuro', () => {
    mockMatchMedia(true);
    initTheme();
    toggleTheme();
    expect(getThemeState().resolved).toBe('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });
});

describe('Requirement: Acompanhar o sistema', () => {
  it('Scenario: Sistema muda para escuro', () => {
    const media = mockMatchMedia(false);
    initTheme();
    expect(html.classList.contains('dark')).toBe(false);
    media.setDark(true);
    expect(html.classList.contains('dark')).toBe(true);
  });
});
