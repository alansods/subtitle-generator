import type { InferenceDevice } from '@/lib/media/capabilities';

// Origem dos modelos (Hugging Face). Trocar aqui permite espelhar os arquivos em outro
// host (ex.: Cloudflare R2) sem mexer no resto do código.
export const MODEL_HOST = 'https://huggingface.co/';

// Variantes "_timestamped": exportadas com atenção cruzada, necessária para tempos por palavra.
export const MODELS = {
  base: 'onnx-community/whisper-base_timestamped',
  small: 'onnx-community/whisper-small_timestamped',
  large: 'onnx-community/whisper-large-v3-turbo_timestamped',
} as const;

export type ModelKey = keyof typeof MODELS;

// O usuário nunca escolhe: com WebGPU, o modelo equilibrado; sem, o menor.
export function chooseModel(device: InferenceDevice): ModelKey {
  return device === 'webgpu' ? 'small' : 'base';
}

export function dtypeFor(device: InferenceDevice, model: ModelKey) {
  if (device === 'webgpu') {
    return {
      encoder_model: model === 'large' ? 'fp16' : 'fp32',
      decoder_model_merged: 'q4',
    } as const;
  }
  return { encoder_model: 'q8', decoder_model_merged: 'q8' } as const;
}
