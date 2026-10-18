# Design

## Context

Ver proposal.md. `styleToAss` já gera o `force_style`; `loadFfmpeg` já carrega o core single-thread para extrair áudio; sessão e tela Pronto existem. Requisitos em `specs/video-export/spec.md`.

## Decisions

- **D1. ASS próprio com resolução do vídeo.** `formatAss(cues, { width, height })` gera `[Script Info]` com `PlayResX/PlayResY` = dimensões do vídeo e `ScaledBorderAndShadow: yes`, um estilo `Default` neutro e um `Dialogue` por cue (`\N` nas quebras, `{`/`}` escapados). O filtro `subtitles=subs.ass:fontsdir=/fonts:force_style='…'` aplica o estilo; como a escala do ASS é a altura real, os números de `styleToAss` valem em pixels. Alternativa: SRT + `force_style`; descartada porque o libass converte SRT com `PlayResY=288`, o que distorce o tamanho.
- **D2. Core multi-thread quando possível.** `loadFfmpeg()` escolhe `@ffmpeg/core-mt@0.12.10` (com `ffmpeg-core.worker.js`) quando `crossOriginIsolated`, senão `@ffmpeg/core@0.12.10`; os dois de CDN via `toBlobURL`. A extração de áudio (fallback) passa a usar o mesmo carregador.
- **D3. Comando fixo, sem escolha de qualidade.** `buildBurnInArgs` → `-i input -vf subtitles=… -fps_mode passthrough -c:v libx264 -preset veryfast -crf 23 -pix_fmt yuv420p -c:a aac -b:a 160k -threads 4 -movflags +faststart output.mp4`. `-fps_mode passthrough` mantém os tempos dos quadros de vídeos com taxa variável (sem isso um WebM gravado sai com milhares de quadros duplicados); `-threads 4` porque com threads automáticas o core multi-thread trava no primeiro quadro. Áudio sempre AAC (o original pode ser Opus de WebM). Fonte: `public/fonts/Inter-Medium.ttf` (OFL) gravada em `/fonts` do FS do ffmpeg.
- **D4. Exportador como interface.** `VideoExporter.run(input, onProgress) → Promise<Blob>` e `cancel()` (`ffmpeg.terminate()` e descarte da instância carregada). Real (ffmpeg.wasm) ou falso (`VITE_VIDEO_EXPORTER=fake`, gera um Blob pequeno com progresso simulado). Progresso via `ffmpeg.on('progress')`; tempo restante estimado pela taxa desde o início. Limpeza dos arquivos do FS ao final.
- **D5. Vídeo baixado em memória.** `SessionDownload` ganha `blob?` para o vídeo; "Baixar de novo" usa o mesmo Blob. Editar cues ou estilo zera o download (comportamento já existente).
- **D6. Prévia.** Um `<video>` sem controles, posicionado no início da primeira cue (`currentTime`), com a legenda sobreposta usando `styleToCss` (mesma estrutura do editor).

## Risks / Trade-offs

- [Gravação lenta em vídeos longos] → Progresso com tempo restante e cancelamento; aviso do tamanho no upload já existe.
- [Memória do WebAssembly com arquivos grandes] → Limite de 500 MB no upload; erro tratado com "Tentar de novo".
- [Nome da família da fonte no libass] → O ffmpeg.wasm não tem provedor de fontes, então não há substituição: com `FontName=Inter` nada era desenhado. Verificado com o ffmpeg real que `FontName=Inter Medium` (família do arquivo) funciona; delta em `subtitle-style`.
