/// <reference types="vite/client" />

interface ImportMetaEnv {
  // "fake" troca o Whisper por um transcritor determinístico (testes e2e).
  readonly VITE_TRANSCRIBER?: string;
  // "fake" troca o ffmpeg.wasm por um exportador de vídeo determinístico (testes e2e).
  readonly VITE_VIDEO_EXPORTER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
