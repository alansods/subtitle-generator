import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Core do ffmpeg.wasm vindo de CDN com versão fixa: o .wasm (~31 MB) passa do limite de
// 25 MiB por arquivo do Cloudflare Pages. Fica no cache do navegador depois do 1º uso.
export const FFMPEG_CORE_VERSION = '0.12.10';
export const FFMPEG_CORE_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/esm`;

let loading: Promise<FFmpeg> | null = null;

export function loadFfmpeg(): Promise<FFmpeg> {
  loading ??= (async () => {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    return ffmpeg;
  })().catch((error: unknown) => {
    loading = null;
    throw error;
  });
  return loading;
}

// Extrai o áudio em 16 kHz mono, float32 little-endian (o formato que o Whisper usa).
export async function extractAudioWithFfmpeg(file: File): Promise<Float32Array> {
  const ffmpeg = await loadFfmpeg();
  const input = `input-${String(Date.now())}`;
  const output = `${input}.f32`;
  await ffmpeg.writeFile(input, await fetchFile(file));
  try {
    const code = await ffmpeg.exec([
      '-i',
      input,
      '-vn',
      '-ac',
      '1',
      '-ar',
      '16000',
      '-f',
      'f32le',
      output,
    ]);
    if (code !== 0) throw new Error(`ffmpeg terminou com código ${String(code)}`);
    const data = await ffmpeg.readFile(output);
    if (typeof data === 'string') throw new Error('saída inesperada do ffmpeg');
    return new Float32Array(data.buffer, data.byteOffset, data.byteLength / 4);
  } finally {
    await ffmpeg.deleteFile(input).catch(() => undefined);
    await ffmpeg.deleteFile(output).catch(() => undefined);
  }
}
