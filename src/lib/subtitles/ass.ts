import { ASS_FONT_NAME } from './style';
import type { Cue } from './types';

// ASS mínimo para o burn-in: a resolução do script é a do vídeo, então tamanhos e
// margens do force_style (styleToAss) valem em pixels reais.

function assTime(seconds: number): string {
  const centis = Math.max(0, Math.round(seconds * 100));
  const cs = String(centis % 100).padStart(2, '0');
  const totalSec = Math.floor(centis / 100);
  const s = String(totalSec % 60).padStart(2, '0');
  const m = String(Math.floor(totalSec / 60) % 60).padStart(2, '0');
  const h = String(Math.floor(totalSec / 3600));
  return `${h}:${m}:${s}.${cs}`;
}

// Chaves abrem blocos de override no ASS; quebras viram \N.
function assText(text: string): string {
  return text.replace(/\{/g, '(').replace(/\}/g, ')').replace(/\r?\n/g, '\\N');
}

export function formatAss(cues: readonly Cue[], size: { width: number; height: number }): string {
  const header = [
    '[Script Info]',
    'ScriptType: v4.00+',
    `PlayResX: ${String(size.width)}`,
    `PlayResY: ${String(size.height)}`,
    'ScaledBorderAndShadow: yes',
    'WrapStyle: 0',
    '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    `Style: Default,${ASS_FONT_NAME},48,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,40,40,40,1`,
    '',
    '[Events]',
    'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
  ];
  const events = cues.map(
    (cue) =>
      `Dialogue: 0,${assTime(cue.start)},${assTime(cue.end)},Default,,0,0,0,,${assText(cue.text)}`,
  );
  return `${[...header, ...events].join('\n')}\n`;
}
