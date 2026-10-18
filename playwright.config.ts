import { defineConfig, devices } from '@playwright/test';

const DEV_URL = 'http://localhost:5173';
const PREVIEW_URL = 'http://localhost:4173';

// Os mesmos testes rodam contra o dev server e contra o build servido pelo preview.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  // Idioma fixo: sem isso o app abre em inglês (navegador en-US), como manda a regra de i18n.
  use: { trace: 'on-first-retry', locale: 'pt-BR' },
  projects: [
    { name: 'dev', use: { ...devices['Desktop Chrome'], baseURL: DEV_URL } },
    { name: 'preview', use: { ...devices['Desktop Chrome'], baseURL: PREVIEW_URL } },
  ],
  webServer: [
    {
      command: 'npm run dev -- --port 5173 --strictPort',
      url: DEV_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run build && npm run preview -- --port 4173 --strictPort',
      url: PREVIEW_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
});
