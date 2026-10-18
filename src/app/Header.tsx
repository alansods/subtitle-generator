import { Link } from '@tanstack/react-router';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { setLocale } from '@/i18n';
import type { Locale } from '@/i18n/locale';
import { cn } from '@/lib/utils';
import { useTheme } from '@/theme/useTheme';

const LOCALE_OPTIONS: { locale: Locale; label: string }[] = [
  { locale: 'pt-BR', label: 'PT' },
  { locale: 'en', label: 'EN' },
];

export function Header() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDark = theme.resolved === 'dark';
  const themeLabel = isDark ? t('header.themeToLight') : t('header.themeToDark');

  return (
    <header className="bg-background">
      <div className="mx-auto flex max-w-340 flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-full text-[19px] font-extrabold text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-[#5b3df5]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M6 11h8M6 15h12" />
            </svg>
          </span>
          {t('app.name')}
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <div
            role="group"
            aria-label={t('header.language')}
            className="flex gap-0.5 rounded-full bg-card p-1"
          >
            {LOCALE_OPTIONS.map(({ locale, label }) => {
              const active = i18n.resolvedLanguage === locale;
              return (
                <button
                  key={locale}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setLocale(locale);
                  }}
                  className={cn(
                    'min-h-9 min-w-11 rounded-full px-3.5 text-[13px] font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    active
                      ? 'bg-ink text-ink-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            aria-label={themeLabel}
            title={themeLabel}
            onClick={theme.toggle}
            className="grid size-11 place-items-center rounded-full bg-card text-foreground hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {isDark ? (
              <Sun aria-hidden="true" className="size-[18px]" />
            ) : (
              <Moon aria-hidden="true" className="size-[18px]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
