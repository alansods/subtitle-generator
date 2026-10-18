// Fonte única dos headers de isolamento cross-origin. `credentialless` mantém
// `crossOriginIsolated` (necessário para o ffmpeg multi-thread) sem bloquear o
// download dos modelos do Hugging Face. `public/_headers` deve declarar os mesmos
// pares; tests/tooling/headers.test.ts garante a paridade.
export const crossOriginHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',
} as const;
