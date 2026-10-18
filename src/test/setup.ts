import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

import { i18n } from '@/i18n';

// O jsdom não implementa scrollTo, e o router o chama ao navegar.
vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

// O jsdom não implementa object URLs.
URL.createObjectURL = vi.fn(() => 'blob:test');
URL.revokeObjectURL = vi.fn();

// Os testes partem sempre do português, independente do idioma do jsdom (en-US).
beforeEach(async () => {
  window.localStorage.clear();
  await i18n.changeLanguage('pt-BR');
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
