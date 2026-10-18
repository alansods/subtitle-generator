import type { InferenceDevice } from '@/lib/media/capabilities';
import { SAMPLE_RATE } from '@/lib/media/audio';
import type { TimedWord } from '@/lib/subtitles/segmentation';

import type { ModelKey } from './models';

// Contrato entre a tela e o worker de transcrição.

export type SpokenLanguage = 'pt' | 'en' | 'auto';

export interface PrepareOptions {
  model: ModelKey;
  device: InferenceDevice;
}

export interface TranscribeOptions {
  language: SpokenLanguage;
}

export type ProgressEvent =
  { stage: 'prepare'; ratio: number } | { stage: 'transcribe'; ratio: number };

export type ProgressListener = (event: ProgressEvent) => void;

export const CHUNK_LENGTH_S = 30;
export const STRIDE_LENGTH_S = 5;

// Opções passadas ao pipeline de reconhecimento de fala.
export function pipelineOptions({ language }: TranscribeOptions) {
  return {
    return_timestamps: 'word' as const,
    chunk_length_s: CHUNK_LENGTH_S,
    stride_length_s: STRIDE_LENGTH_S,
    task: 'transcribe' as const,
    ...(language === 'auto' ? {} : { language }),
  };
}

// Mesma regra de janelas do pipeline: janela de 30 s, avançando 30 - 2×5 = 20 s.
export function countChunks(samples: number, sampleRate = SAMPLE_RATE): number {
  const window = CHUNK_LENGTH_S * sampleRate;
  const jump = window - 2 * STRIDE_LENGTH_S * sampleRate;
  let chunks = 1;
  for (let offset = 0; offset + window < samples; offset += jump) chunks += 1;
  return chunks;
}

export interface AsrChunk {
  text: string;
  timestamp: [number, number | null];
}

// Palavras do Whisper → TimedWord; fim ausente vira o início da próxima palavra.
export function toWords(chunks: AsrChunk[]): TimedWord[] {
  return chunks
    .map((chunk, index) => {
      const [start, end] = chunk.timestamp;
      const next = chunks[index + 1]?.timestamp[0];
      return { text: chunk.text.trim(), start, end: end ?? next ?? start + 0.3 };
    })
    .filter((word) => word.text !== '');
}
