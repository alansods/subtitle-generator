# Design

## Context

Ver proposal.md. Sessão em memória com o vídeo (File + object URL); segmentação e leitores de SRT/VTT prontos. Requisitos em `specs/transcription/spec.md`. Transformers.js 4.x, onnxruntime-web, COOP/COEP já ativos (`crossOriginIsolated`).

## Decisions

- **D1. Interface `Transcriber`.** `transcribe(audio: Float32Array, options, onProgress): Promise<TimedWord[]>` e `cancel()`. A implementação real cria um `Worker` (módulo) e conversa via Comlink; `cancel()` faz `worker.terminate()` e rejeita a promessa com `TranscriptionCancelled`. Uma implementação falsa (`VITE_TRANSCRIBER=fake`) devolve palavras determinísticas espalhadas pela duração do áudio, com progresso simulado; é usada no e2e. `createTranscriber()` escolhe pela variável de ambiente.
- **D2. Modelos e dtypes.** `MODELS = { base: 'onnx-community/whisper-base_timestamped', small: 'onnx-community/whisper-small_timestamped', large: 'onnx-community/whisper-large-v3-turbo_timestamped' }` (variantes com atenção cruzada, necessárias para tempos por palavra). WebGPU: `{ encoder_model: 'fp32', decoder_model_merged: 'q4' }`; WASM: `{ encoder_model: 'q8', decoder_model_merged: 'q8' }`. A origem fica em `MODEL_HOST` (padrão Hugging Face) para permitir espelhar depois (`env.remoteHost`).
- **D3. Escolha do dispositivo.** `detectDevice()` em `src/lib/media/capabilities.ts`: WebGPU quando `navigator.gpu.requestAdapter()` devolve adaptador. `chooseModel(device)`: WebGPU → `small`, WASM → `base`. O modelo usado fica na sessão (`transcription.model`) para o "refazer" futuro.
- **D4. Áudio no thread principal.** `AudioContext`/`decodeAudioData` não existem em workers; a decodificação acontece no thread principal (`decodeAudio(file)`: `new AudioContext({ sampleRate: 16000 })`, média dos canais) e o `Float32Array` é transferido ao worker (`Comlink.transfer`). Falha → `extractAudioWithFfmpeg(file)` (ffmpeg.wasm single-thread, `-ac 1 -ar 16000 -f f32le`), com o core `@ffmpeg/core@0.12.10` de CDN via `toBlobURL`.
- **D5. Progresso.** O worker repassa o `progress_callback` do download (soma de `loaded/total` por arquivo) e conta trechos concluídos via `WhisperTextStreamer.on_finalize` (um por chamada de `generate`); o total de trechos é calculado com a mesma regra do pipeline (janela 30 s, passo 20 s). O hook `useTranscription` mantém a máquina de estados `idle → running(stage, pct) → done | error` e calcula a barra geral (Preparando 0–20%, Extraindo 20–30%, Transcrevendo 30–95%, Separando 95–100%).
- **D6. Saída protegida.** `useBlocker` na tela enquanto `running` (diálogo "Cancelar o processamento?") e `beforeunload` ativo no mesmo estado.
- **D7. Vite.** `worker: { format: 'es' }` para o worker em módulo; o e2e roda o dev server e um build próprio (`dist-e2e`) com `VITE_TRANSCRIBER=fake`, sem tocar o `dist` de produção.

## Risks / Trade-offs

- [Download grande no primeiro uso] → Etapa "Preparando" com porcentagem; depois vem do cache do navegador.
- [WASM é lento para vídeos longos] → Aviso quando não há WebGPU; modelo menor.
- [Testes automatizados não rodam o modelo real] → e2e usa o transcritor falso; um teste opcional (`RUN_REAL_MODEL=1`) roda o modelo real com o fixture de fala.
