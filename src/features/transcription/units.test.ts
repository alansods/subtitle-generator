import { afterEach, describe, expect, it, vi } from 'vitest';

import { extractAudio, mixToMono } from '@/lib/media/audio';
import { detectDevice } from '@/lib/media/capabilities';

import { chooseModel, MODELS } from './models';
import { countChunks, pipelineOptions, toWords } from './protocol';

vi.mock('@/lib/media/ffmpeg', () => ({
  extractAudioWithFfmpeg: vi.fn(() => Promise.resolve(new Float32Array([0.5, 0.25]))),
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Requirement: Escolha automática do modelo', () => {
  it('Scenario: Com WebGPU', async () => {
    const device = await detectDevice({ gpu: { requestAdapter: () => Promise.resolve({}) } });
    expect(device).toBe('webgpu');
    expect(MODELS[chooseModel(device)]).toBe('onnx-community/whisper-small_timestamped');
  });

  it('Scenario: Sem WebGPU', async () => {
    expect(await detectDevice({})).toBe('wasm');
    expect(await detectDevice({ gpu: { requestAdapter: () => Promise.resolve(null) } })).toBe(
      'wasm',
    );
    expect(MODELS[chooseModel('wasm')]).toBe('onnx-community/whisper-base_timestamped');
  });
});

describe('Requirement: Extração do áudio', () => {
  it('Scenario: Mixagem para mono', () => {
    const mono = mixToMono([new Float32Array([1, 0, 0.5]), new Float32Array([0, 1, 0.5])]);
    expect([...mono]).toEqual([0.5, 0.5, 0.5]);
  });

  it('Scenario: Navegador não decodifica o áudio', async () => {
    vi.stubGlobal(
      'AudioContext',
      class {
        decodeAudioData() {
          return Promise.reject(new Error('codec não suportado'));
        }
        close() {
          return Promise.resolve();
        }
      },
    );
    const audio = await extractAudio(new File(['x'], 'clip.mov'));
    expect([...audio]).toEqual([0.5, 0.25]);
  });
});

describe('Requirement: Transcrição fora da tela principal', () => {
  it('Scenario: Idioma enviado ao modelo', () => {
    expect(pipelineOptions({ language: 'en' })).toEqual({
      return_timestamps: 'word',
      chunk_length_s: 30,
      stride_length_s: 5,
      task: 'transcribe',
      language: 'en',
    });
  });

  it('Scenario: Detecção automática', () => {
    expect(pipelineOptions({ language: 'auto' })).not.toHaveProperty('language');
  });
});

describe('protocolo', () => {
  it('conta os trechos de 30 s com passo de 20 s', () => {
    expect(countChunks(16_000 * 10)).toBe(1);
    expect(countChunks(16_000 * 30)).toBe(1);
    expect(countChunks(16_000 * 31)).toBe(2);
    expect(countChunks(16_000 * 70)).toBe(3);
  });

  it('converte palavras e completa fins ausentes', () => {
    expect(
      toWords([
        { text: ' Olá', timestamp: [0, 0.4] },
        { text: ' mundo', timestamp: [0.5, null] },
        { text: ' fim', timestamp: [1.2, null] },
      ]),
    ).toEqual([
      { text: 'Olá', start: 0, end: 0.4 },
      { text: 'mundo', start: 0.5, end: 1.2 },
      { text: 'fim', start: 1.2, end: 1.5 },
    ]);
  });
});
