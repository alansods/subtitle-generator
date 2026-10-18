import { formatTimecode } from './timecode';
import { parseBlocks, type RawCue } from './blocks';
import type { Cue } from './types';

export function formatSrt(cues: readonly Pick<Cue, 'start' | 'end' | 'text'>[]): string {
  return cues
    .map(
      (cue, index) =>
        `${String(index + 1)}\n${formatTimecode(cue.start, ',')} --> ${formatTimecode(cue.end, ',')}\n${cue.text}\n`,
    )
    .join('\n');
}

export function parseSrt(text: string): RawCue[] {
  return parseBlocks(text);
}
