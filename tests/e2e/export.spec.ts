import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

const sample = fileURLToPath(new URL('./fixtures/sample.webm', import.meta.url));

// Fluxo completo com o transcritor falso: upload → gerar → editar → exportar → pronto → nova.
test.describe('Requirement: Baixar a legenda', () => {
  test('Scenario: Baixar SRT', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('video-input').setInputFiles(sample);
    await page.getByRole('button', { name: 'Gerar legenda' }).click();
    await expect(page).toHaveURL(/\/edit$/, { timeout: 30_000 });
    await page.getByRole('link', { name: 'Exportar', exact: true }).click();
    await expect(page).toHaveURL(/\/export$/);

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Baixar legenda' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('sample.srt');
    const content = readFileSync(await download.path(), 'utf8');
    expect(content).toMatch(/^1\n00:00:00,000 --> \d\d:\d\d:\d\d,\d{3}\nOlá!/);

    await expect(page).toHaveURL(/\/done$/);
    await expect(
      page.getByRole('heading', { name: 'Pronto! Sua legenda foi baixada.' }),
    ).toBeVisible();
    await page.getByRole('link', { name: /Fazer nova legenda/ }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole('heading', { name: /Legenda pronta para o seu vídeo/ }),
    ).toBeVisible();
  });
});
