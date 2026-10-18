// Tempos de legenda: segundos (float) ↔ "HH:MM:SS,mmm" (SRT) ou "HH:MM:SS.mmm" (VTT).

const pad = (value: number, size: number) => String(value).padStart(size, '0');

export function formatTimecode(seconds: number, separator: ',' | '.'): string {
  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const ms = totalMs % 1000;
  const totalSec = Math.floor(totalMs / 1000);
  const s = totalSec % 60;
  const m = Math.floor(totalSec / 60) % 60;
  const h = Math.floor(totalSec / 3600);
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}${separator}${pad(ms, 3)}`;
}

// Aceita horas opcionais e vírgula ou ponto antes dos milissegundos (1 a 3 dígitos).
const TIMECODE = /^(?:(\d{1,3}):)?(\d{1,2}):(\d{1,2})[.,](\d{1,3})$/;

export function parseTimecode(text: string): number | undefined {
  const match = TIMECODE.exec(text.trim());
  if (!match) return undefined;
  const [, h = '0', m = '0', s = '0', ms = '0'] = match;
  const millis = Number(ms.padEnd(3, '0'));
  return Number(h) * 3600 + Number(m) * 60 + Number(s) + millis / 1000;
}

// Arredonda para milissegundos, a precisão que os formatos guardam.
export const roundMs = (seconds: number) => Math.round(seconds * 1000) / 1000;
