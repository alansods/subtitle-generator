import { expect, test } from '@playwright/test';

test.describe('Requirement: Página não encontrada', () => {
  test('Scenario: Rota inexistente', async ({ page }) => {
    await page.goto('/rota-inexistente');
    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
    await page.getByRole('link', { name: 'Voltar ao início' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('Requirement: Cursor de elemento clicável', () => {
  test('Scenario: Botão habilitado', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /Ativar tema/ });
    await toggle.hover();
    await expect(toggle).toHaveCSS('cursor', 'pointer');
  });

  test('Scenario: Botão desabilitado', async ({ page }) => {
    await page.goto('/');
    // A regra é global: um botão desabilitado qualquer da página não ganha a mão.
    await page.evaluate(() => {
      const button = document.createElement('button');
      button.disabled = true;
      button.textContent = 'Desabilitado';
      document.body.append(button);
    });
    await expect(page.getByRole('button', { name: 'Desabilitado' })).not.toHaveCSS(
      'cursor',
      'pointer',
    );
  });
});
