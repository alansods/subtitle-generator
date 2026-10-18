import { useTranslation } from 'react-i18next';

import type { Locale } from './locale';

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatDate(
  value: Date | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(locale, options).format(value);
}

export function useFormatters() {
  const { i18n } = useTranslation();
  const locale = (i18n.resolvedLanguage ?? 'pt-BR') as Locale;
  return {
    locale,
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, locale, options),
    date: (value: Date | number, options?: Intl.DateTimeFormatOptions) =>
      formatDate(value, locale, options),
  };
}
