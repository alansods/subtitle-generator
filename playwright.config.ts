import { defineConfig, devices } from '@playwright/test';

// Portas próprias (5273/4273): o e2e não disputa a porta do `npm run dev` (5173).
const DEV_URL = 'http://localhost:5273';
const PREVIEW_URL = 'http://localhost:4273';
const REAL_URL = 'http://localhost:5174';

// Os testes rodam contra o dev server e contra um build próprio (dist-e2e), os dois com o
// transcritor e o exportador de vídeo falsos. Com RUN_REAL_MODEL=1 roda só o projeto
// "real-model" (Whisper de verdade; baixa o modelo, lento); com RUN_REAL_FFMPEG=1, só o
// "real-ffmpeg" (gravação da legenda com o ffmpeg.wasm de verdade, transcritor falso).
const realModel = process.env.RUN_REAL_MODEL === '1';
const realFfmpeg = process.env.RUN_REAL_FFMPEG === '1';
const real = realModel || realFfmpeg;
const REAL_SPECS = /real-(model|ffmpeg)\.spec\.ts/;
const fake = { VITE_TRANSCRIBER: 'fake', VITE_VIDEO_EXPORTER: 'fake' };

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  // Idioma fixo: sem isso o app abre em inglês (navegador en-US), como manda a regra de i18n.
  use: { trace: 'on-first-retry', locale: 'pt-BR' },
  projects: real
    ? [
        ...(realModel
          ? [
              {
                name: 'real-model',
                testMatch: /real-model\.spec\.ts/,
                timeout: 600_000,
                use: { ...devices['Desktop Chrome'], baseURL: REAL_URL },
              },
            ]
          : []),
        ...(realFfmpeg
          ? [
              {
                name: 'real-ffmpeg',
                testMatch: /real-ffmpeg\.spec\.ts/,
                timeout: 300_000,
                use: { ...devices['Desktop Chrome'], baseURL: REAL_URL },
              },
            ]
          : []),
      ]
    : [
        {
          name: 'dev',
          testIgnore: REAL_SPECS,
          use: { ...devices['Desktop Chrome'], baseURL: DEV_URL },
        },
        {
          name: 'preview',
          testIgnore: REAL_SPECS,
          use: { ...devices['Desktop Chrome'], baseURL: PREVIEW_URL },
        },
      ],
  webServer: real
    ? [
        {
          command: 'npm run dev -- --port 5174 --strictPort',
          url: REAL_URL,
          // Só o ffmpeg real: a legenda vem do transcritor falso (rápido e previsível).
          env: realModel ? {} : { VITE_TRANSCRIBER: 'fake' },
          reuseExistingServer: false,
          timeout: 120_000,
        },
      ]
    : [
        {
          command: 'npm run dev -- --port 5273 --strictPort',
          url: DEV_URL,
          env: fake,
          // Nunca reaproveitar: um servidor já aberto pode estar sem os falsos.
          reuseExistingServer: false,
          timeout: 120_000,
        },
        {
          command:
            'npx vite build --outDir dist-e2e --emptyOutDir && npx vite preview --outDir dist-e2e --port 4273 --strictPort',
          url: PREVIEW_URL,
          env: fake,
          // Nunca reaproveitar: um servidor já aberto pode estar sem os falsos.
          reuseExistingServer: false,
          timeout: 180_000,
        },
      ],
});
