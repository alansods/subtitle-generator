import { defineConfig, devices } from '@playwright/test';

const DEV_URL = 'http://localhost:5173';
const PREVIEW_URL = 'http://localhost:4173';
const REAL_URL = 'http://localhost:5174';

// Os testes rodam contra o dev server e contra um build próprio (dist-e2e), os dois com o
// transcritor falso (VITE_TRANSCRIBER=fake). Com RUN_REAL_MODEL=1, roda só o projeto
// "real-model", que usa o Whisper de verdade (baixa o modelo; lento).
const realModel = process.env.RUN_REAL_MODEL === '1';
const fake = { VITE_TRANSCRIBER: 'fake' };

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  // Idioma fixo: sem isso o app abre em inglês (navegador en-US), como manda a regra de i18n.
  use: { trace: 'on-first-retry', locale: 'pt-BR' },
  projects: realModel
    ? [
        {
          name: 'real-model',
          testMatch: /real-model\.spec\.ts/,
          timeout: 600_000,
          use: { ...devices['Desktop Chrome'], baseURL: REAL_URL },
        },
      ]
    : [
        {
          name: 'dev',
          testIgnore: /real-model\.spec\.ts/,
          use: { ...devices['Desktop Chrome'], baseURL: DEV_URL },
        },
        {
          name: 'preview',
          testIgnore: /real-model\.spec\.ts/,
          use: { ...devices['Desktop Chrome'], baseURL: PREVIEW_URL },
        },
      ],
  webServer: realModel
    ? [
        {
          command: 'npm run dev -- --port 5174 --strictPort',
          url: REAL_URL,
          reuseExistingServer: false,
          timeout: 120_000,
        },
      ]
    : [
        {
          command: 'npm run dev -- --port 5173 --strictPort',
          url: DEV_URL,
          env: fake,
          // Nunca reaproveitar: um servidor já aberto pode estar sem VITE_TRANSCRIBER=fake.
          reuseExistingServer: false,
          timeout: 120_000,
        },
        {
          command:
            'npx vite build --outDir dist-e2e --emptyOutDir && npx vite preview --outDir dist-e2e --port 4173 --strictPort',
          url: PREVIEW_URL,
          env: fake,
          // Nunca reaproveitar: um servidor já aberto pode estar sem VITE_TRANSCRIBER=fake.
          reuseExistingServer: false,
          timeout: 180_000,
        },
      ],
});
