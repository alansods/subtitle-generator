# Design

## Context

Ver proposal.md. A sessão em memória (`useSession.setVideo`) já existe. Layout e conteúdo vêm do protótipo aprovado (identidade neutra + violeta). Requisitos em `specs/video-upload/spec.md`.

## Decisions

- **D1. Validação em duas fases.** `validateVideoFile(file, limits)` (pura) decide formato e tamanho: retorna `{ status: 'ok' } | { status: 'warn-large' } | { status: 'error', reason: 'format' | 'too-large' }`. Formato aceito por extensão (`.mp4`, `.webm`, `.mov`) ou tipo (`video/mp4`, `video/webm`, `video/quicktime`). Depois, `probeVideo(file)` cria um `<video>` com a object URL, espera `loadedmetadata` (timeout de 10 s) e devolve duração, largura e altura; falha → erro `unplayable`. `canPlayType` vazio também → `unplayable`.
- **D2. Duração infinita.** WebM gravado por MediaRecorder reporta `duration = Infinity`; o probe faz `currentTime = 1e101` e lê a duração no `durationchange`.
- **D3. Limites em código.** `UPLOAD_LIMITS = { maxBytes: 500 MiB, warnBytes: 200 MiB }` em `src/features/upload/limits.ts`; tamanhos exibidos em MB com `Intl` no idioma ativo.
- **D4. Componentes.** `HomePage` (topo, passos, chamada final) e `VideoDropzone` (input escondido + botão, `dragover/drop`, estado de erro/aviso com `role="alert"`/`role="status"`). O hook `useVideoIntake()` orquestra validar → probe → `setVideo` → `navigate('/transcribe')` e expõe o estado para a UI.
- **D5. E2E com fixture real.** `tests/e2e/fixtures/sample.webm` (3 s) gerado por `scripts/make-fixture-video.mjs` no Chromium; o e2e usa `setInputFiles` no input.

## Risks / Trade-offs

- [`canPlayType` responde "maybe" para MOV mesmo sem suporte ao codec] → O probe de metadados decide.
- [Vídeos muito grandes demoram para gerar metadados] → Timeout de 10 s com erro claro.
