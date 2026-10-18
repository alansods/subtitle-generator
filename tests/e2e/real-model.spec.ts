import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

const speech = fileURLToPath(new URL('./fixtures/sample-speech.webm', import.meta.url));

// Opcional (RUN_REAL_MODEL=1): Whisper real, baixado do Hugging Face, com o fixture de fala
// em português gerado pelo `say` do macOS. Não roda no CI.
test('Whisper real transcreve o fixture de fala em português', async ({ page }) => {
  page.on('console', (message) => {
    if (message.type() === 'error') console.log('[console]', message.text());
  });
  await page.goto('/');
  await page.getByTestId('video-input').setInputFiles(speech);
  await page.getByRole('button', { name: 'Gerar legenda' }).click();
  await expect(page).toHaveURL(/\/edit$/, { timeout: 540_000 });
  // No dev server, este caminho é o mesmo módulo que o app usa (mesma instância da sessão).
  const cues = await page.evaluate<string[]>(
    "import('/src/lib/session/store.ts').then((m) => m.useSession.getState().cues.map((c) => c.text.replace(/\\n/g, ' ')))",
  );
  console.log('Legenda gerada:', JSON.stringify(cues, null, 2));
  expect(cues.join(' ').toLowerCase()).toContain('legenda');
});
