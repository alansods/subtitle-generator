import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Core do ffmpeg.wasm vindo de CDN com versão fixa: o .wasm (~32 MB) passa do limite de
// 25 MiB por arquivo do Cloudflare Pages. Fica no cache do navegador depois do 1º uso.
// Com a página isolada (COOP/COEP), usa o core multi-thread, bem mais rápido.
export const FFMPEG_CORE_VERSION = '0.12.10';
const CDN = 'https://cdn.jsdelivr.net/npm/@ffmpeg';

export function ffmpegCoreBase(multiThread: boolean): string {
  return `${CDN}/${multiThread ? 'core-mt' : 'core'}@${FFMPEG_CORE_VERSION}/dist/esm`;
}

let loading: Promise<FFmpeg> | null = null;

export function loadFfmpeg(multiThread: boolean = globalThis.crossOriginIsolated): Promise<FFmpeg> {
  loading ??= (async () => {
    const base = ffmpegCoreBase(multiThread);
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
      ...(multiThread
        ? { workerURL: await toBlobURL(`${base}/ffmpeg-core.worker.js`, 'text/javascript') }
        : {}),
    });
    return ffmpeg;
  })().catch((error: unknown) => {
    loading = null;
    throw error;
  });
  return loading;
}

// Encerra o ffmpeg carregado (cancelamento); o próximo uso carrega de novo (do cache).
export async function terminateFfmpeg(): Promise<void> {
  const current = loading;
  loading = null;
  if (!current) return;
  try {
    (await current).terminate();
  } catch {
    // Já tinha falhado ao carregar: nada a encerrar.
  }
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
