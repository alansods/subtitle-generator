import {
  env,
  pipeline,
  WhisperTextStreamer,
  type AutomaticSpeechRecognitionOutput,
  type AutomaticSpeechRecognitionPipeline,
  type WhisperTokenizer,
} from '@huggingface/transformers';
import * as Comlink from 'comlink';

import { dtypeFor, MODEL_HOST, MODELS } from '@/features/transcription/models';
import {
  countChunks,
  pipelineOptions,
  toWords,
  type PrepareOptions,
  type ProgressListener,
  type TranscribeOptions,
} from '@/features/transcription/protocol';

// Modelos vêm do host configurado e ficam no cache do navegador.
env.allowLocalModels = false;
env.remoteHost = MODEL_HOST;
env.useBrowserCache = true;

let loaded: { key: string; asr: Promise<AutomaticSpeechRecognitionPipeline> } | null = null;

interface DownloadEvent {
  status: string;
  file?: string;
  loaded?: number;
  total?: number;
}

function load({ model, device }: PrepareOptions, onProgress: ProgressListener) {
  const key = `${model}:${device}`;
  if (loaded?.key === key) return loaded.asr;
  const files = new Map<string, { loaded: number; total: number }>();
  const asr = pipeline('automatic-speech-recognition', MODELS[model], {
    device,
    dtype: dtypeFor(device, model),
    progress_callback: (event: DownloadEvent) => {
      if (event.status !== 'progress' || !event.file) return;
      files.set(event.file, { loaded: event.loaded ?? 0, total: event.total ?? 0 });
      let done = 0;
      let total = 0;
      for (const file of files.values()) {
        done += file.loaded;
        total += file.total;
      }
      if (total > 0) onProgress({ stage: 'prepare', ratio: Math.min(1, done / total) });
    },
  });
  loaded = { key, asr };
  return asr;
}

const api = {
  async prepare(options: PrepareOptions, onProgress: ProgressListener) {
    await load(options, onProgress);
    onProgress({ stage: 'prepare', ratio: 1 });
  },

  async transcribe(
    audio: Float32Array,
    options: PrepareOptions & TranscribeOptions,
    onProgress: ProgressListener,
  ) {
    const asr = await load(options, onProgress);
    const total = countChunks(audio.length);
    let done = 0;
    onProgress({ stage: 'transcribe', ratio: 0 });
    // Um `generate` por trecho de 30 s; cada um termina com on_finalize.
    const streamer = new WhisperTextStreamer(asr.tokenizer as WhisperTokenizer, {
      // Sem callback, o streamer tenta escrever no stdout, que não existe no worker.
      callback_function: () => undefined,
      on_finalize: () => {
        done += 1;
        onProgress({ stage: 'transcribe', ratio: Math.min(1, done / total) });
      },
    });
    const output = (await asr(audio, { ...pipelineOptions(options), streamer })) as
      AutomaticSpeechRecognitionOutput | AutomaticSpeechRecognitionOutput[];
    const result = Array.isArray(output) ? output[0] : output;
    return toWords(result?.chunks ?? []);
  },
};

export type TranscriptionWorkerApi = typeof api;

Comlink.expose(api);
