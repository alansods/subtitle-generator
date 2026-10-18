import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react-vite';

import '../src/styles/globals.css';

const preview: Preview = {
  decorators: [
    // Aplica a classe do tema no <html>, igual ao app (dark mode por classe `dark`).
    withThemeByClassName<ReactRenderer>({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
