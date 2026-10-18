import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { detectInitialLocale, persistLocale, readStoredLocale, type Locale } from './locale';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

export const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
} as const;

const initialLocale = detectInitialLocale(readStoredLocale(), navigator.language);

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: 'pt-BR',
  supportedLngs: ['pt-BR', 'en'],
  interpolation: { escapeValue: false },
  initAsync: false,
});
document.documentElement.lang = initialLocale;

// Troca o idioma da interface e lembra a escolha.
export function setLocale(locale: Locale): void {
  void i18n.changeLanguage(locale);
  persistLocale(locale);
}

export { i18n };
