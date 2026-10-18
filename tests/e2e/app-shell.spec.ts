import { expect, test } from '@playwright/test';

test.describe('Requirement: Página não encontrada', () => {
  test('Scenario: Rota inexistente', async ({ page }) => {
    await page.goto('/rota-inexistente');
    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
    await page.getByRole('link', { name: 'Voltar ao início' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
