import { z } from 'zod';

// Fonte única da aparência da legenda: gera o CSS da prévia e o force_style do libass
// (burn-in). Os números abaixo valem para as duas saídas.

export const subtitleStyleSchema = z.object({
  background: z.enum(['black', 'white', 'transparent']),
  fontSize: z.enum(['sm', 'md', 'lg']),
  position: z.enum(['bottom', 'top']),
});

export type SubtitleStyle = z.infer<typeof subtitleStyleSchema>;

export const DEFAULT_STYLE: SubtitleStyle = {
  background: 'black',
  fontSize: 'md',
  position: 'bottom',
};

// Tamanho da fonte e margem vertical como fração da altura do vídeo.
export const SIZE_RATIO = { sm: 0.045, md: 0.055, lg: 0.065 } as const;
export const MARGIN_RATIO = 0.06;
// Respiro vertical da caixa como fração do tamanho da fonte (padding na prévia, Outline no ASS).
const BOX_PADDING_RATIO = 0.12;

const OUTLINE_SHADOW = [
  '-2px -2px 0 #000',
  '2px -2px 0 #000',
  '-2px 2px 0 #000',
  '2px 2px 0 #000',
  '0 2px 0 #000',
  '0 -2px 0 #000',
  '2px 0 0 #000',
  '-2px 0 0 #000',
  '2px 3px 2px rgb(0 0 0 / 60%)',
].join(', ');

const pct = (ratio: number) => `${String(Math.round(ratio * 1000) / 10)}cqh`;

// Estilos da legenda sobreposta. `cqh` = % da altura do contêiner (o vídeo).
export function styleToCss(style: SubtitleStyle) {
  const colors =
    style.background === 'black'
      ? { background: '#000', color: '#fff' }
      : style.background === 'white'
        ? { background: '#fff', color: '#000' }
        : { background: 'transparent', color: '#fff', textShadow: OUTLINE_SHADOW };
  return {
    wrap: {
      position: 'absolute',
      left: '4%',
      right: '4%',
      [style.position]: pct(MARGIN_RATIO),
      display: 'flex',
      justifyContent: 'center',
      textAlign: 'center',
      zIndex: 2,
    },
    text: {
      fontFamily: "Inter, 'Plus Jakarta Sans Variable', sans-serif",
      fontWeight: 500,
      fontSize: pct(SIZE_RATIO[style.fontSize]),
      lineHeight: 1.3,
      whiteSpace: 'pre-line',
      padding: `${String(BOX_PADDING_RATIO)}em 0.45em`,
      border: 0,
      ...colors,
    },
  } as const;
}

// force_style do filtro `subtitles` do ffmpeg/libass, na escala da altura do vídeo.
// Com BorderStyle=3, a cor da caixa vem de OutlineColour e o respiro, de Outline.
export function styleToAss(style: SubtitleStyle, videoHeight: number): string {
  const fontSize = Math.round(videoHeight * SIZE_RATIO[style.fontSize]);
  const box = Math.max(1, Math.round(fontSize * BOX_PADDING_RATIO));
  const look = {
    black: `BorderStyle=3,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=${String(box)},Shadow=0`,
    white: `BorderStyle=3,PrimaryColour=&H00000000,OutlineColour=&H00FFFFFF,Outline=${String(box)},Shadow=0`,
    transparent:
      'BorderStyle=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Shadow=1',
  }[style.background];
  return [
    'FontName=Inter',
    `Fontsize=${String(fontSize)}`,
    look,
    `Alignment=${style.position === 'bottom' ? '2' : '8'}`,
    `MarginV=${String(Math.round(videoHeight * MARGIN_RATIO))}`,
  ].join(',');
}
