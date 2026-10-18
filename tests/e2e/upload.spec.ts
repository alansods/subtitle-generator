import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

const sample = fileURLToPath(new URL('./fixtures/sample.webm', import.meta.url));

test.describe('Requirement: Vídeo aceito inicia a sessão', () => {
  test('Scenario: Dados do vídeo na sessão', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('video-input').setInputFiles(sample);
    await expect(page).toHaveURL(/\/transcribe$/);
    await expect(page.getByRole('heading', { name: 'Gerar legenda' })).toBeVisible();
  });
});

test.describe('Requirement: Formatos aceitos', () => {
  test('Scenario: Formato não suportado', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('video-input').setInputFiles({
      name: 'apresentacao.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4'),
    });
    await expect(page.getByRole('alert')).toContainText('Use MP4, WebM ou MOV');
    await expect(page).toHaveURL(/\/$/);
  });
});
