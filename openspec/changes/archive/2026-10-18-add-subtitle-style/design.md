# Design

## Context

Ver proposal.md. A legenda sobreposta já usa unidades `cqh` (altura do contêiner do vídeo). O burn-in (`add-video-export`) usará o filtro `subtitles` do ffmpeg com `force_style`. Requisitos em `specs/subtitle-style/spec.md`.

## Decisions

- **D1. Uma tabela, duas saídas.** `src/lib/subtitles/style.ts` define `SIZE_RATIO = { sm: 0.045, md: 0.055, lg: 0.065 }`, `MARGIN_RATIO = 0.06` e as cores por fundo. `styleToCss` usa esses números como `cqh` (`5.5cqh` = 5,5% da altura), `styleToAss` como pixels sobre a altura real (o filtro `subtitles` usa `original_size`/`PlayResY` igual à altura do vídeo). Mudar a tabela muda as duas saídas.
- **D2. Caixa do libass.** Com `BorderStyle=3`, a cor da caixa vem de `OutlineColour` e o tamanho de `Outline`; usamos `Outline` ≈ 12% do tamanho da fonte (o mesmo `padding: 0.12em` vertical da prévia) e `Shadow=0`. Transparente: `BorderStyle=1`, contorno 2 e sombra 1 (como no briefing); na prévia, contorno com `text-shadow` em 8 direções e sombra suave.
- **D3. Estilo na sessão.** `SessionState.style` com padrão; `setVideo` e `reset` voltam ao padrão.
- **D4. Painel.** `StylePanel` com três grupos de rádio em pílula (com amostra de cor no fundo); reutilizável na exportação.
- **D5. Fonte.** `@fontsource/inter/500.css` importado no app; o `.ttf` para o ffmpeg entra em `add-video-export`.

## Risks / Trade-offs

- [Pequenas diferenças de renderização entre navegador e libass] → Mesma fonte, tamanhos e margens; o teste visual de frame exportado fica em `add-video-export`.
