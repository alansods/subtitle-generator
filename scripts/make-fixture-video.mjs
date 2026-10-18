// Gera vídeos de teste em tests/e2e/fixtures/ gravando um canvas animado no Chromium do
// Playwright (não há ffmpeg nas máquinas de desenvolvimento):
//   node scripts/make-fixture-video.mjs
//     → sample.webm: 3 s, tom de 440 Hz
//   node scripts/make-fixture-video.mjs fala.wav sample-speech.webm
//     → vídeo com o áudio do WAV (ex.: gerado com `say -v Luciana -o fala.wav --data-format=LEI16@16000 "..."`)
import { readFileSync, writeFileSync } from 'node:fs';

import { chromium } from '@playwright/test';

const [speechPath, outName = speechPath ? 'sample-speech.webm' : 'sample.webm'] =
  process.argv.slice(2);
const speechBase64 = speechPath ? readFileSync(speechPath).toString('base64') : null;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<canvas width="320" height="180"></canvas>');
const base64 = await page.evaluate(async (speech) => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const audio = new AudioContext();
  const dest = audio.createMediaStreamDestination();
  let durationMs = 3000;
  let source;
  if (speech) {
    const bytes = Uint8Array.from(atob(speech), (c) => c.charCodeAt(0));
    const buffer = await audio.decodeAudioData(bytes.buffer);
    source = audio.createBufferSource();
    source.buffer = buffer;
    durationMs = Math.ceil(buffer.duration * 1000) + 500;
  } else {
    source = audio.createOscillator();
    source.frequency.value = 440;
  }
  source.connect(dest);
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
  source.start();
  await new Promise((r) => setTimeout(r, durationMs));
  recorder.stop();
  await new Promise((r) => (recorder.onstop = r));
  clearInterval(timer);
  const blob = new Blob(chunks, { type: 'video/webm' });
  const out = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  out.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}, speechBase64);
await browser.close();
writeFileSync(
  new URL(`../tests/e2e/fixtures/${outName}`, import.meta.url),
  Buffer.from(base64, 'base64'),
);
console.log(`${outName} gerado`);
