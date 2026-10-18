import * as Comlink from 'comlink';

import type { TimedWord } from '@/lib/subtitles/segmentation';
import type { TranscriptionWorkerApi } from '@/workers/transcription.worker';

import type { PrepareOptions, ProgressListener, TranscribeOptions } from './protocol';

export class TranscriptionCancelled extends Error {
  constructor() {
    super('Transcrição cancelada');
    this.name = 'TranscriptionCancelled';
  }
}

export interface Transcriber {
  prepare: (options: PrepareOptions, onProgress: ProgressListener) => Promise<void>;
  transcribe: (
    audio: Float32Array,
    options: PrepareOptions & TranscribeOptions,
    onProgress: ProgressListener,
  ) => Promise<TimedWord[]>;
  cancel: () => void;
}

// Transcritor real: Whisper num Web Worker. Cancelar encerra o worker na hora.
export function createWorkerTranscriber(): Transcriber {
  const worker = new Worker(new URL('../../workers/transcription.worker.ts', import.meta.url), {
    type: 'module',
  });
  const api = Comlink.wrap<TranscriptionWorkerApi>(worker);
  let rejectRunning: ((reason: unknown) => void) | null = null;

  function guarded<T>(work: Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      rejectRunning = reject;
      work.then(resolve, reject).finally(() => {
        rejectRunning = null;
      });
    });
  }

  return {
    prepare: (options, onProgress) => guarded(api.prepare(options, Comlink.proxy(onProgress))),
    transcribe: (audio, options, onProgress) =>
      guarded(
        api.transcribe(Comlink.transfer(audio, [audio.buffer]), options, Comlink.proxy(onProgress)),
      ),
    cancel: () => {
      worker.terminate();
      rejectRunning?.(new TranscriptionCancelled());
    },
  };
}

const FAKE_SCRIPT =
  'Olá! Esta é uma legenda de teste gerada automaticamente. Ela serve para verificar o fluxo completo do aplicativo.';

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

// Transcritor falso e determinístico (VITE_TRANSCRIBER=fake), usado nos testes e2e:
// espalha um texto fixo pela duração do áudio, com progresso simulado.
export function createFakeTranscriber(): Transcriber {
  let cancelled = false;
  const step = async (onProgress: ProgressListener, stage: 'prepare' | 'transcribe') => {
    for (const ratio of [0.25, 0.5, 0.75, 1]) {
      await wait(60);
      if (cancelled) throw new TranscriptionCancelled();
      onProgress({ stage, ratio });
    }
  };
  return {
    prepare: (_options, onProgress) => step(onProgress, 'prepare'),
    transcribe: async (audio, _options, onProgress) => {
      await step(onProgress, 'transcribe');
      const words = FAKE_SCRIPT.split(' ');
      const durationSec = Math.max(audio.length / 16_000, words.length * 0.3);
      const slot = durationSec / words.length;
      return words.map((text, i) => ({ text, start: i * slot, end: (i + 0.9) * slot }));
    },
    cancel: () => {
      cancelled = true;
    },
  };
}

export function createTranscriber(): Transcriber {
  return import.meta.env.VITE_TRANSCRIBER === 'fake'
    ? createFakeTranscriber()
    : createWorkerTranscriber();
}
