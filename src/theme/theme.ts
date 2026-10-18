import { z } from 'zod';

import { readPreference, writePreference } from '@/lib/preferences/storage';

// Esta regra é replicada no script inline do index.html (sem dependências, roda antes
// do app). Os testes executam aquele script para garantir que as duas cópias concordam.

export const THEME_STORAGE_KEY = 'gdl:theme';
export const themeModeSchema = z.enum(['light', 'dark', 'system']);
export type ThemeMode = z.infer<typeof themeModeSchema>;
export type ResolvedTheme = 'light' | 'dark';

const DARK_QUERY = '(prefers-color-scheme: dark)';

export function resolveTheme(mode: ThemeMode, prefersDark: boolean): ResolvedTheme {
  if (mode === 'system') return prefersDark ? 'dark' : 'light';
  return mode;
}

export interface ThemeState {
  mode: ThemeMode;
  resolved: ResolvedTheme;
}

const listeners = new Set<() => void>();
let state: ThemeState = { mode: 'system', resolved: 'light' };

function systemPrefersDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

function apply(mode: ThemeMode) {
  const resolved = resolveTheme(mode, systemPrefersDark());
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  state = { mode, resolved };
  listeners.forEach((listener) => {
    listener();
  });
}

export function initTheme(): void {
  apply(readPreference(THEME_STORAGE_KEY, themeModeSchema) ?? 'system');
  window.matchMedia(DARK_QUERY).addEventListener('change', () => {
    if (state.mode === 'system') apply('system');
  });
}

export function getThemeState(): ThemeState {
  return state;
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setThemeMode(mode: ThemeMode): void {
  writePreference(THEME_STORAGE_KEY, mode);
  apply(mode);
}

// O botão do cabeçalho alterna entre claro e escuro a partir do que está aplicado agora.
export function toggleTheme(): void {
  setThemeMode(state.resolved === 'dark' ? 'light' : 'dark');
}
