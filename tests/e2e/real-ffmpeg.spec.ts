import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

const speech = fileURLToPath(new URL('./fixtures/sample-speech.webm', import.meta.url));

// Opcional (RUN_REAL_FFMPEG=1): grava a legenda com o ffmpeg.wasm de verdade (core baixado
// do CDN) e confere que o MP4 tem a legenda desenhada no quadro. Não roda no CI.
test('ffmpeg real grava a legenda no vídeo', async ({ page }) => {
  page.on('console', (message) => {
    if (message.type() === 'error') console.log('[console]', message.text());
  });
  await page.goto('/');
  await page.getByTestId('video-input').setInputFiles(speech);
  await page.getByRole('button', { name: 'Gerar legenda' }).click();
  await expect(page).toHaveURL(/\/edit$/, { timeout: 30_000 });
  await page.getByRole('link', { name: 'Avançar', exact: true }).click();
  await page.getByText('Vídeo com legenda', { exact: true }).click();

  const started = Date.now();
  const downloadPromise = page.waitForEvent('download', { timeout: 240_000 });
  await page.getByRole('button', { name: 'Gerar vídeo' }).click();
  const download = await downloadPromise;
  console.log(`Vídeo gerado em ${String((Date.now() - started) / 1000)} s`);
  expect(download.suggestedFilename()).toBe('sample-speech-legendado.mp4');
  const bytes = readFileSync(await download.path());
  expect(bytes.subarray(4, 8).toString('latin1')).toBe('ftyp');
  await expect(page).toHaveURL(/\/done$/);

  // Quadro no meio da primeira legenda: a faixa de baixo precisa ter texto branco.
  const frame = await page.evaluate<{ isolated: boolean; width: number; bright: number }>(`
    (async () => {
      const { useSession } = await import('/src/lib/session/store.ts');
      const { downloaded, cues } = useSession.getState();
      const v = document.createElement('video');
      v.muted = true;
      v.src = URL.createObjectURL(downloaded.blob);
      await new Promise((r) => (v.onloadeddata = r));
      v.currentTime = (cues[0].start + cues[0].end) / 2;
      await new Promise((r) => (v.onseeked = r));
      const c = document.createElement('canvas');
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const g = c.getContext('2d');
      g.drawImage(v, 0, 0);
      const px = g.getImageData(0, Math.round(c.height * 0.6), c.width, Math.round(c.height * 0.4)).data;
      let bright = 0;
      for (let i = 0; i < px.length; i += 4) if (px[i] > 200 && px[i + 1] > 200 && px[i + 2] > 200) bright++;
      return { isolated: crossOriginIsolated, width: v.videoWidth, bright };
    })()
  `);
  console.log('Quadro:', JSON.stringify(frame));
  expect(frame.isolated).toBe(true);
  expect(frame.width).toBe(320);
  expect(frame.bright).toBeGreaterThan(50);
});
