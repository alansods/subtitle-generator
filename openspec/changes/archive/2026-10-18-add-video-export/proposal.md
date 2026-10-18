# Proposal

## Why

No teste manual, o usuário pediu a opção de baixar o vídeo inteiro com a legenda aplicada na imagem, além do arquivo de legenda. É o formato que funciona em qualquer lugar (WhatsApp, Instagram, TV) e respeita o estilo escolhido no editor.

## What Changes

- Nova opção "Vídeo com legenda" na tela de exportação, ao lado de "Somente legenda" (que não muda).
- Ao escolher a opção: painel de estilo (o mesmo do editor), prévia num quadro do vídeo com a legenda no estilo escolhido, nome do arquivo `<nome do vídeo>-legendado.mp4` e botão "Gerar vídeo".
- Geração no navegador com ffmpeg.wasm (multi-thread quando a página está isolada; senão, single-thread): legenda em ASS com resolução igual à do vídeo, `force_style` do estilo, fonte Inter carregada no ffmpeg, vídeo H.264 e áudio AAC em MP4. Sem escolha de qualidade (padrão fixo).
- Progresso ("Preparando", "Gerando vídeo" com porcentagem e tempo restante estimado), "Cancelar" e confirmação ao sair da tela durante a geração.
- Ao terminar: download do MP4, sessão marcada como baixada e ida para a tela Pronto; "Baixar de novo" baixa o mesmo vídeo sem gerar outra vez.
- Gerador ASS no projeto (`formatAss`), sem biblioteca externa.
- Exportador falso e determinístico (`VITE_VIDEO_EXPORTER=fake`) para os testes e2e; teste opcional com o ffmpeg real (`RUN_REAL_FFMPEG=1`).

### Fora do escopo

- Vídeo com faixa de legenda separada (soft subtitle): descartado pelo usuário.
- Escolha de qualidade ou de formato de saída.

## Capabilities

### New Capabilities

- `video-export`: opção de vídeo com legenda, prévia, geração, progresso, cancelamento e download.

### Modified Capabilities

- `completion`: "Baixar de novo" também cobre o vídeo gerado (sem gerar outra vez).
- `subtitle-style`: o `force_style` usa `FontName=Inter Medium`, o nome de família do arquivo da fonte (o ffmpeg.wasm não substitui fontes; com `Inter` a legenda não era desenhada).

## Impact

- Novos `src/lib/subtitles/ass.ts`, `src/lib/media/videoExport.ts`, `src/features/export/VideoExport*.tsx`; `src/lib/media/ffmpeg.ts` passa a preferir o core multi-thread; `public/fonts/Inter-Medium.ttf` (+ licença OFL); sessão guarda o vídeo baixado em memória para "Baixar de novo".
- Rede no primeiro uso: core do ffmpeg (~32 MB) de CDN com versão fixa (cache do navegador depois).
