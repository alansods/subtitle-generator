# Proposal

## Why

O usuário escolhe como a legenda fica no vídeo (fundo preto, branco ou transparente; tamanho; posição) e precisa ver exatamente o que vai receber. Uma única configuração deve alimentar a prévia no editor e a legenda gravada na imagem (burn-in), para que o exportado seja equivalente ao que se vê.

## What Changes

- `SubtitleStyle` na sessão: `background` (`black` | `white` | `transparent`), `fontSize` (`sm` | `md` | `lg`), `position` (`bottom` | `top`); padrão preto, M, embaixo; volta ao padrão com um novo vídeo.
- `styleToCss(style)`: estilos da legenda sobreposta (fonte Inter, tamanho em % da altura do vídeo: 4,5 / 5,5 / 6,5%, margem de 6% da altura).
- `styleToAss(style, videoHeight)`: `force_style` do libass equivalente (cores, `BorderStyle`, `Alignment`, `Fontsize` e `MarginV` na escala da altura do vídeo).
- Painel "Estilo da legenda" no editor (abaixo do player), com escolhas em linguagem simples; a legenda sobreposta passa a usar o estilo escolhido.
- Fonte Inter servida pelo app (`@fontsource/inter`) para a legenda.

### Fora do escopo

- Usar o `force_style` no ffmpeg e a prévia em frame na exportação (`add-video-export`).

## Capabilities

### New Capabilities

- `subtitle-style`: opções de estilo, aplicação na prévia e equivalência com o burn-in.

### Modified Capabilities

Nenhuma.

## Impact

- Novo `src/lib/subtitles/style.ts`; `src/features/style/StylePanel.tsx`; `SubtitleOverlay` usa o estilo da sessão; sessão ganha `style`/`setStyle`; dependência `@fontsource/inter`.
