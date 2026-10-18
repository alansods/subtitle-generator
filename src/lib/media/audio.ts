export const SAMPLE_RATE = 16_000;

export function mixToMono(channels: Float32Array[]): Float32Array {
  const [first] = channels;
  if (!first) return new Float32Array(0);
  if (channels.length === 1) return first;
  const mono = new Float32Array(first.length);
  for (const channel of channels) {
    for (let i = 0; i < mono.length; i++) mono[i] = (mono[i] ?? 0) + (channel[i] ?? 0);
  }
  for (let i = 0; i < mono.length; i++) mono[i] = (mono[i] ?? 0) / channels.length;
  return mono;
}

// Decodifica o áudio do vídeo em 16 kHz mono com o próprio navegador. Roda no thread
// principal porque AudioContext não existe em workers.
export async function decodeAudio(file: Blob): Promise<Float32Array> {
  const context = new AudioContext({ sampleRate: SAMPLE_RATE });
  try {
    const buffer = await context.decodeAudioData(await file.arrayBuffer());
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, i) =>
      buffer.getChannelData(i),
    );
    return mixToMono(channels);
  } finally {
    void context.close();
  }
}

// Navegador primeiro; se ele não decodificar o áudio desse contêiner/codec, ffmpeg.wasm.
export async function extractAudio(file: File): Promise<Float32Array> {
  try {
    return await decodeAudio(file);
  } catch {
    const { extractAudioWithFfmpeg } = await import('./ffmpeg');
    return extractAudioWithFfmpeg(file);
  }
}
