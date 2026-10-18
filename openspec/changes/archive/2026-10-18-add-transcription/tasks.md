# Tasks

## 1. Mídia e dispositivo

- [x] 1.1 Criar `src/lib/media/capabilities.ts` (`detectDevice`) e `src/features/transcription/models.ts` (`MODELS`, `chooseModel`, dtypes) com testes "Scenario: Com WebGPU" e "Scenario: Sem WebGPU" (escolha).
- [x] 1.2 Criar `src/lib/media/audio.ts` (`decodeAudio`, mixagem mono) e `src/lib/media/ffmpeg.ts` (`extractAudioWithFfmpeg`, core de CDN) com testes "Scenario: Mixagem para mono" e "Scenario: Navegador não decodifica o áudio" (mocks).

## 2. Worker e transcritor

- [x] 2.1 Criar `src/workers/transcription.worker.ts` (pipeline, streamer, progresso de download e trechos) e `src/features/transcription/transcriber.ts` (real via Comlink, falso por `VITE_TRANSCRIBER=fake`, `cancel`) com testes "Scenario: Idioma enviado ao modelo" e "Scenario: Detecção automática" sobre as opções montadas.
- [x] 2.2 Configurar `worker.format = 'es'` no Vite e verificar o build com o worker.

## 3. Tela de transcrição

- [x] 3.1 Criar `useTranscription` (estados, etapas, barra geral, segmentação, sessão) e a página `/transcribe`; testes "Scenario: Idioma padrão", "Scenario: Nada técnico na tela", aviso de "Scenario: Sem WebGPU", "Scenario: Andamento visível", "Scenario: Cancelar no meio", "Scenario: Legenda gerada" e "Scenario: Erro no worker".
- [x] 3.2 Proteger a saída durante o processamento; testes "Scenario: Confirmar saída" e "Scenario: Desistir de sair".
- [x] 3.3 Importação de .srt/.vtt; testes "Scenario: Importar SRT" e "Scenario: Importar arquivo inválido".

## 4. E2E

- [x] 4.1 Playwright com `VITE_TRANSCRIBER=fake` (dev e build em `dist-e2e`) e e2e do fluxo upload → gerar → `/edit`.
- [x] 4.2 Teste opcional `RUN_REAL_MODEL=1` com `sample-speech.webm` e o modelo real; rodar uma vez e registrar o resultado. Resultado (18/10/2026, Chromium headless, WASM, whisper-base): 2 cues com o texto falado correto em 7,8 s (modelo em cache).

## 5. Verificação

- [x] 5.1 `openspec validate add-transcription --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; textos nos dois idiomas.
