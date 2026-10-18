import { z } from 'zod';

import { readPreference, writePreference } from '@/lib/preferences/storage';

export const SUPPORTED_LOCALES = ['pt-BR', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_STORAGE_KEY = 'gdl:locale';
export const localeSchema = z.enum(SUPPORTED_LOCALES);

export function isSupportedLocale(value: unknown): value is Locale {
  return localeSchema.safeParse(value).success;
}

// Idioma salvo válido vence; senão, qualquer variante de português vira pt-BR e o resto, en.
export function detectInitialLocale(
  stored: unknown,
  navigatorLanguage: string | undefined,
): Locale {
  if (isSupportedLocale(stored)) return stored;
  return navigatorLanguage?.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}

export function readStoredLocale(): Locale | undefined {
  return readPreference(LOCALE_STORAGE_KEY, localeSchema);
}

export function persistLocale(locale: Locale): void {
  writePreference(LOCALE_STORAGE_KEY, locale);
  document.documentElement.lang = locale;
}
