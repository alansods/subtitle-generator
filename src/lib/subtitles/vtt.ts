import { normalizeNewlines, parseBlocks, type RawCue } from './blocks';
import { formatTimecode } from './timecode';
import type { Cue } from './types';

export class SubtitleFormatError extends Error {
  constructor(readonly reason: 'format' | 'empty' | 'unsupported') {
    super(reason);
    this.name = 'SubtitleFormatError';
  }
}

export function formatVtt(cues: readonly Pick<Cue, 'start' | 'end' | 'text'>[]): string {
  const body = cues
    .map(
      (cue) =>
        `${formatTimecode(cue.start, '.')} --> ${formatTimecode(cue.end, '.')}\n${cue.text}\n`,
    )
    .join('\n');
  return `WEBVTT\n\n${body}`;
}

const IGNORED_BLOCK = /^(NOTE|STYLE|REGION)(\s|$)/;

export function parseVtt(text: string): RawCue[] {
  const normalized = normalizeNewlines(text);
  if (!/^WEBVTT(?:[ \t].*)?(?:\n|$)/.test(normalized)) throw new SubtitleFormatError('format');
  // O primeiro bloco é o cabeçalho; os demais podem ser cues ou blocos a ignorar.
  const withoutHeader = normalized.replace(/^WEBVTT[^\n]*(?:\n[^\n]+)*/, '');
  return parseBlocks(withoutHeader, (first) => IGNORED_BLOCK.test(first));
}
