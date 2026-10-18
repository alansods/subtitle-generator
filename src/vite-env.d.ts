/// <reference types="vite/client" />

interface ImportMetaEnv {
  // "fake" troca o Whisper por um transcritor determinístico (testes e2e).
  readonly VITE_TRANSCRIBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
