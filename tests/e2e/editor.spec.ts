import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

const sample = fileURLToPath(new URL('./fixtures/sample.webm', import.meta.url));

test.describe('Requirement: Editar na própria legenda', () => {
  test('Scenario: Corrigir e salvar com Enter', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('video-input').setInputFiles(sample);
    await page.getByRole('button', { name: 'Gerar legenda' }).click();
    await expect(page).toHaveURL(/\/edit$/, { timeout: 30_000 });

    const overlay = page.getByRole('button', { name: /^Editar legenda:/ });
    await expect(overlay).toBeVisible();
    await overlay.click();
    const field = page.getByRole('textbox', { name: 'Editar legenda' });
    await field.fill('Legenda corrigida no vídeo');
    await field.press('Enter');

    await expect(page.getByRole('textbox', { name: 'Texto da legenda 1' })).toHaveValue(
      'Legenda corrigida no vídeo',
    );
    await expect(page.getByRole('button', { name: /^Editar legenda:/ })).toHaveText(
      'Legenda corrigida no vídeo',
    );
  });
});
