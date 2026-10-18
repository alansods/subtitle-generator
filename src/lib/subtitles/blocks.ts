import { parseTimecode } from './timecode';

export interface RawCue {
  start: number;
  end: number;
  text: string;
}

const ARROW = /^(\S+)\s+-->\s+(\S+)/;

// Normaliza o texto: sem BOM, quebras de linha \n.
export function normalizeNewlines(text: string): string {
  return text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

// Remove tags de formatação (<i>, <b>, <font>, <c.classe>, <00:01.000>) e marcas do tipo {\an8}.
export function stripTags(line: string): string {
  return line
    .replace(/<[^>]*>/g, '')
    .replace(/\{\\[^}]*\}/g, '')
    .trim();
}

// Lê blocos separados por linha em branco; em cada um, a linha com "-->" define o tempo
// e as seguintes, o texto. Linhas antes do tempo (índice SRT, identificador VTT) são ignoradas.
export function parseBlocks(
  text: string,
  isIgnoredBlock: (first: string) => boolean = () => false,
) {
  const cues: RawCue[] = [];
  for (const block of normalizeNewlines(text).split(/\n{2,}/)) {
    const lines = block.split('\n').filter((line) => line.trim() !== '');
    const first = lines[0];
    if (first === undefined || isIgnoredBlock(first.trim())) continue;
    const timeIndex = lines.findIndex((line) => ARROW.test(line));
    if (timeIndex < 0) continue;
    const match = ARROW.exec(lines[timeIndex] ?? '');
    const start = parseTimecode(match?.[1] ?? '');
    const end = parseTimecode(match?.[2] ?? '');
    if (start === undefined || end === undefined) continue;
    const body = lines
      .slice(timeIndex + 1)
      .map(stripTags)
      .filter((line) => line !== '')
      .join('\n');
    cues.push({ start, end, text: body });
  }
  return cues;
}
