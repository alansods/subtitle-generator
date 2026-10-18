import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

const sample = fileURLToPath(new URL('./fixtures/sample.webm', import.meta.url));

// Transcritor falso (VITE_TRANSCRIBER=fake): o áudio é decodificado de verdade pelo
// navegador; só o reconhecimento de fala é substituído por um texto fixo.
test.describe('Requirement: Conclusão', () => {
  test('Scenario: Legenda gerada', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('video-input').setInputFiles(sample);
    await expect(page).toHaveURL(/\/transcribe$/);
    await expect(page.getByRole('radio', { name: 'Português' })).toBeChecked();
    await page.getByRole('button', { name: 'Gerar legenda' }).click();
    await expect(page.getByRole('progressbar')).toBeVisible();
    await expect(page).toHaveURL(/\/edit$/, { timeout: 30_000 });
  });
});

test.describe('Requirement: Cancelar', () => {
  test('Scenario: Cancelar no meio', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('video-input').setInputFiles(sample);
    await page.getByRole('button', { name: 'Gerar legenda' }).click();
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page.getByRole('button', { name: 'Gerar legenda' })).toBeVisible();
    await expect(page).toHaveURL(/\/transcribe$/);
  });
});
