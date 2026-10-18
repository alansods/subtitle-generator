import { act, render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { setLocale } from './index';
import { LOCALE_STORAGE_KEY } from './locale';

function AppName() {
  const { t } = useTranslation();
  return <span>{t('app.name')}</span>;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Requirement: Troca e persistência do idioma', () => {
  it('Scenario: Trocar para inglês', () => {
    render(<AppName />);
    expect(screen.getByText('Gerador de Legenda')).toBeInTheDocument();

    act(() => {
      setLocale('en');
    });

    expect(screen.getByText('Subtitle Generator')).toBeInTheDocument();
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('Scenario: Armazenamento indisponível', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    render(<AppName />);

    act(() => {
      setLocale('en');
    });

    expect(screen.getByText('Subtitle Generator')).toBeInTheDocument();
  });
});
