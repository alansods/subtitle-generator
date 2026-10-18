import { withThemeByClassName } from '@storybook/addon-themes';
import type { Decorator, Preview, ReactRenderer } from '@storybook/react-vite';
import { useEffect } from 'react';

import { i18n } from '../src/i18n';
import type { Locale } from '../src/i18n/locale';

import '../src/styles/globals.css';

// Troca o idioma do i18n conforme o seletor "Idioma" da barra de ferramentas.
const withLocale: Decorator = (Story, context) => {
  const locale = (context.globals.locale ?? 'pt-BR') as Locale;
  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale]);
  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Idioma da interface',
      toolbar: {
        title: 'Idioma',
        icon: 'globe',
        items: [
          { value: 'pt-BR', title: 'Português' },
          { value: 'en', title: 'English' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { locale: 'pt-BR' },
  decorators: [
    withLocale,
    // Aplica a classe do tema no <html>, igual ao app (dark mode por classe `dark`).
    withThemeByClassName<ReactRenderer>({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
