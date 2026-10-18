# Proposal

## Why

Gerar a legenda a partir do áudio é o coração do app. Precisa acontecer no computador do usuário (privacidade, custo zero), sem travar a interface, com progresso claro, cancelamento e sem nenhuma decisão técnica para o usuário: ele só diz qual idioma é falado.

## What Changes

- Tela `/transcribe`: vídeo (só visualização), "Idioma falado no vídeo" (Português, Inglês, Detectar automaticamente; padrão = idioma da interface), explicação curta, botão "Gerar legenda" e link "Importar legenda existente (.srt/.vtt)".
- Escolha automática do modelo pelo dispositivo: com WebGPU, `whisper-small`; sem WebGPU, `whisper-base` (variantes `_timestamped`, com tempos por palavra), e aviso de que neste navegador a legenda demora mais.
- Extração do áudio a 16 kHz mono com Web Audio; se o navegador não decodificar, extração com ffmpeg.wasm (core carregado de CDN com versão fixa).
- Transcrição num Web Worker (Transformers.js via Comlink) com tempos por palavra, trechos de 30 s e o idioma escolhido.
- Progresso em etapas: Preparando (só na primeira vez), Extraindo áudio, Transcrevendo (%), Separando em legendas; barra geral e anúncio `aria-live`.
- Cancelar encerra o worker e volta ao estado inicial; sair da tela durante o processamento pede confirmação e cancela.
- Ao concluir: segmentação (`segmentWords`), cues na sessão e navegação para `/edit`.
- Importar .srt/.vtt pula a transcrição e vai para `/edit`; arquivo inválido mostra erro.
- Transcritor falso e determinístico ativado por `VITE_TRANSCRIBER=fake` para os testes e2e.

### Fora do escopo

- "Refazer com mais precisão" (`add-retranscribe-more-accuracy`).
- Editor (`add-subtitle-editor-core`).

## Capabilities

### New Capabilities

- `transcription`: tela de transcrição, escolha automática do modelo, extração de áudio, transcrição, progresso, cancelamento, conclusão e importação.

### Modified Capabilities

Nenhuma.

## Impact

- Novos `src/features/transcription/`, `src/workers/transcription.worker.ts`, `src/lib/media/{capabilities,audio,ffmpeg}.ts`; rota `/transcribe`; sessão guarda o modelo usado.
- Dependências: `@huggingface/transformers`, `comlink`, `@ffmpeg/ffmpeg`, `@ffmpeg/util`.
- Rede no primeiro uso: modelo do Hugging Face e runtime do ONNX/ffmpeg de CDN (cache do navegador depois).
