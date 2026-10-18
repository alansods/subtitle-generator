import { expect, test } from '@playwright/test';

import { crossOriginHeaders } from '../../config/cross-origin-headers.ts';

test.describe('Requirement: Isolamento cross-origin em todos os ambientes', () => {
  test('Scenario: Servidor de desenvolvimento isolado', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'dev', 'Cenário do servidor de desenvolvimento');

    const response = await page.goto('/');
    const headers = response?.headers() ?? {};

    for (const [name, value] of Object.entries(crossOriginHeaders)) {
      expect(headers[name.toLowerCase()]).toBe(value);
    }
    expect(await page.evaluate(() => window.crossOriginIsolated)).toBe(true);
  });

  test('Scenario: Build de produção isolado', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'preview', 'Cenário do build de produção');

    await page.goto('/');

    expect(await page.evaluate(() => window.crossOriginIsolated)).toBe(true);
  });
});
