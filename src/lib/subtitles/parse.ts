import { parseSrt } from './srt';
import { roundMs } from './timecode';
import { createCueId, cueSchema, type Cue } from './types';
import { parseVtt, SubtitleFormatError } from './vtt';

export { SubtitleFormatError };

// Importa um .srt/.vtt existente: leitor pela extensão, cues validadas e ordenadas.
export function parseSubtitleFile(fileName: string, text: string): Cue[] {
  const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
  let raw;
  if (extension === '.srt') raw = parseSrt(text);
  else if (extension === '.vtt') raw = parseVtt(text);
  else throw new SubtitleFormatError('unsupported');

  const cues = raw
    .map((cue) =>
      cueSchema.safeParse({
        id: createCueId(),
        start: roundMs(cue.start),
        end: roundMs(cue.end),
        text: cue.text,
      }),
    )
    .flatMap((result) => (result.success ? [result.data] : []))
    .sort((a, b) => a.start - b.start);

  if (cues.length === 0) throw new SubtitleFormatError('empty');
  return cues;
}
