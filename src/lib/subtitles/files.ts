import { formatSrt } from './srt';
import type { Cue } from './types';
import { formatVtt } from './vtt';

export const SUBTITLE_FORMATS = {
  srt: { label: 'SRT', mime: 'application/x-subrip', build: formatSrt },
  vtt: { label: 'VTT', mime: 'text/vtt', build: formatVtt },
} as const;

export type SubtitleFormat = keyof typeof SUBTITLE_FORMATS;

export function buildSubtitleFile(cues: readonly Cue[], format: SubtitleFormat) {
  const { mime, build } = SUBTITLE_FORMATS[format];
  return { content: build(cues), mime };
}

export function formatFromFileName(fileName: string): SubtitleFormat {
  return fileName.toLowerCase().endsWith('.vtt') ? 'vtt' : 'srt';
}
