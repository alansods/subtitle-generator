import { roundMs } from './timecode';
import { createCueId, type Cue } from './types';

export interface TimedWord {
  text: string;
  start: number;
  end: number;
}

export const SEGMENTATION_RULES = {
  maxLineChars: 42,
  minDuration: 1,
  maxDuration: 7,
  pauseSec: 0.5,
  minGap: 0.08,
} as const;

export type SegmentationRules = typeof SEGMENTATION_RULES;

const END_PUNCTUATION = /[.?!…]["'”’)\]]*$/;
const SOFT_PUNCTUATION = /[,;:]["'”’)\]]*$/;

// Até 2 linhas: a quebra entre palavras que respeita o limite e deixa as linhas mais
// parecidas em tamanho. `null` quando não cabe em duas linhas.
export function wrapLines(words: string[], maxLineChars: number = SEGMENTATION_RULES.maxLineChars) {
  const full = words.join(' ');
  if (full.length <= maxLineChars) return [full];
  let best: string[] | null = null;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const first = words.slice(0, i).join(' ');
    const second = words.slice(i).join(' ');
    if (first.length > maxLineChars || second.length > maxLineChars) continue;
    const diff = Math.abs(first.length - second.length);
    if (diff < bestDiff) {
      best = [first, second];
      bestDiff = diff;
    }
  }
  return best;
}

const texts = (words: TimedWord[]) => words.map((w) => w.text);
const duration = (words: TimedWord[]) =>
  words.length ? (words.at(-1)?.end ?? 0) - (words[0]?.start ?? 0) : 0;

// Quantas palavras da cue atual ficam na primeira parte quando ela precisa ser cortada.
function bestSplit(words: TimedWord[], rules: SegmentationRules): number {
  const longEnough = (keep: number) => duration(words.slice(0, keep)) >= rules.minDuration;
  for (const pattern of [END_PUNCTUATION, SOFT_PUNCTUATION]) {
    for (let keep = words.length; keep >= 1; keep--) {
      if (pattern.test(words[keep - 1]?.text ?? '') && longEnough(keep)) return keep;
    }
  }
  let bestKeep = words.length;
  let bestGap = rules.pauseSec;
  for (let keep = 1; keep < words.length; keep++) {
    const gap = (words[keep]?.start ?? 0) - (words[keep - 1]?.end ?? 0);
    if (gap > bestGap && longEnough(keep)) {
      bestGap = gap;
      bestKeep = keep;
    }
  }
  return bestKeep;
}

function normalize(words: TimedWord[]): TimedWord[] {
  const out: TimedWord[] = [];
  for (const word of words) {
    const text = word.text.trim();
    if (!text) continue;
    const start = Math.max(word.start, out.at(-1)?.start ?? 0);
    out.push({ text, start, end: Math.max(word.end, start) });
  }
  return out;
}

export function segmentWords(
  input: TimedWord[],
  rules: SegmentationRules = SEGMENTATION_RULES,
): Cue[] {
  const words = normalize(input);
  const fits = (group: TimedWord[]) =>
    group.length === 1 ||
    (wrapLines(texts(group), rules.maxLineChars) !== null && duration(group) <= rules.maxDuration);

  const groups: TimedWord[][] = [];
  let current: TimedWord[] = [];
  words.forEach((word, index) => {
    while (current.length > 0 && !fits([...current, word])) {
      const keep = bestSplit(current, rules);
      groups.push(current.slice(0, keep));
      current = current.slice(keep);
    }
    current.push(word);
    const next = words[index + 1];
    const pauseAfter = next ? next.start - word.end > rules.pauseSec : false;
    // Pausa longa sempre corta (há espaço para estender a cue até a duração mínima);
    // pontuação final corta quando a cue já tem a duração mínima.
    const endsSentence = END_PUNCTUATION.test(word.text) && duration(current) >= rules.minDuration;
    if (pauseAfter || endsSentence) {
      groups.push(current);
      current = [];
    }
  });
  if (current.length) groups.push(current);

  const cues = groups.map((group) => ({
    id: createCueId(),
    start: group[0]?.start ?? 0,
    end: group.at(-1)?.end ?? 0,
    text: (wrapLines(texts(group), rules.maxLineChars) ?? [texts(group).join(' ')]).join('\n'),
  }));

  // Duração mínima (se houver espaço) e lacuna mínima entre cues consecutivas.
  cues.forEach((cue, index) => {
    const next = cues[index + 1];
    const limit = next ? next.start - rules.minGap : Infinity;
    if (cue.end - cue.start < rules.minDuration) {
      cue.end = Math.max(cue.end, Math.min(cue.start + rules.minDuration, limit));
    }
    if (next && next.start - cue.end < rules.minGap) {
      cue.end = Math.max(cue.start + 0.001, next.start - rules.minGap);
    }
    cue.start = roundMs(cue.start);
    cue.end = roundMs(cue.end);
  });
  return cues;
}
