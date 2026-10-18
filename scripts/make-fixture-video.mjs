// Gera tests/e2e/fixtures/sample.webm (3 s, 320x180, VP8 + Opus com um tom de 440 Hz)
// gravando um canvas animado no Chromium do Playwright. Não há ffmpeg nas máquinas
// de desenvolvimento, então o fixture é produzido pelo próprio navegador.
import { writeFileSync } from 'node:fs';

import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<canvas width="320" height="180"></canvas>');
const base64 = await page.evaluate(async () => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const audio = new AudioContext();
  const osc = audio.createOscillator();
  const dest = audio.createMediaStreamDestination();
  osc.frequency.value = 440;
  osc.connect(dest);
  osc.start();
  const stream = new MediaStream([
    ...canvas.captureStream(30).getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  let frame = 0;
  const timer = setInterval(() => {
    ctx.fillStyle = '#1c2127';
    ctx.fillRect(0, 0, 320, 180);
    ctx.fillStyle = '#5b3df5';
    ctx.fillRect((frame * 4) % 320, 70, 40, 40);
    frame += 1;
  }, 33);
  recorder.start();
  await new Promise((r) => setTimeout(r, 3000));
  recorder.stop();
  await new Promise((r) => (recorder.onstop = r));
  clearInterval(timer);
  osc.stop();
  const blob = new Blob(chunks, { type: 'video/webm' });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
});
await browser.close();
writeFileSync(
  new URL('../tests/e2e/fixtures/sample.webm', import.meta.url),
  Buffer.from(base64, 'base64'),
);
console.log('sample.webm gerado');
