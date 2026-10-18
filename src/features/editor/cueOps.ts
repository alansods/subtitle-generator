import { wrapLines } from '@/lib/subtitles/segmentation';
import { roundMs } from '@/lib/subtitles/timecode';
import { createCueId, type Cue } from '@/lib/subtitles/types';

// Operações de edição: puras, sempre devolvem um novo array ordenado por início.

export const MIN_GAP = 0.08;
export const NEW_CUE_DURATION = 2;

const sorted = (cues: Cue[]) => cues.slice().sort((a, b) => a.start - b.start);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function activeCueAt(cues: readonly Cue[], time: number): Cue | undefined {
  return cues.find((cue) => time >= cue.start && time < cue.end);
}

export function nudgeCue(
  cues: Cue[],
  id: string,
  field: 'start' | 'end',
  delta: number,
  duration: number,
): Cue[] {
  return sorted(
    cues.map((cue) =>
      cue.id === id ? { ...cue, [field]: roundMs(clamp(cue[field] + delta, 0, duration)) } : cue,
    ),
  );
}

export function setCueTime(cues: Cue[], id: string, field: 'start' | 'end', time: number) {
  return sorted(cues.map((cue) => (cue.id === id ? { ...cue, [field]: roundMs(time) } : cue)));
}

// Divide no cursor do texto; o tempo é dividido na mesma proporção do texto.
export function splitCue(cues: Cue[], id: string, cursor: number): Cue[] {
  const index = cues.findIndex((cue) => cue.id === id);
  const cue = cues[index];
  if (!cue) return cues;
  const before = cue.text.slice(0, cursor).trimEnd();
  const after = cue.text.slice(cursor).trimStart();
  if (!before || !after) return cues;
  const middle = cue.start + (cue.end - cue.start) * (cursor / cue.text.length);
  const first = { ...cue, text: before, end: roundMs(middle - MIN_GAP / 2) };
  const second = {
    id: createCueId(),
    text: after,
    start: roundMs(middle + MIN_GAP / 2),
    end: cue.end,
  };
  return sorted([...cues.slice(0, index), first, second, ...cues.slice(index + 1)]);
}

export function mergeWithNext(cues: Cue[], id: string): Cue[] {
  const index = cues.findIndex((cue) => cue.id === id);
  const cue = cues[index];
  const next = cues[index + 1];
  if (!cue || !next) return cues;
  const words = `${cue.text} ${next.text}`.split(/\s+/).filter(Boolean);
  const text = (wrapLines(words) ?? [words.join(' ')]).join('\n');
  const merged = { ...cue, text, end: Math.max(cue.end, next.end) };
  return [...cues.slice(0, index), merged, ...cues.slice(index + 2)];
}

export function deleteCue(cues: Cue[], id: string): Cue[] {
  return cues.filter((cue) => cue.id !== id);
}

// Nova cue vazia logo depois de outra: 2 s ou até 0,08 s antes da seguinte.
export function insertAfter(cues: Cue[], id: string, duration: number) {
  const index = cues.findIndex((cue) => cue.id === id);
  const cue = cues[index];
  if (!cue) return { cues, id: undefined };
  return createAt(cues, cue.end + MIN_GAP, duration);
}

// Nova cue no tempo atual do vídeo, para "+ Adicionar legenda aqui".
export function addCueAt(cues: Cue[], time: number, duration: number) {
  return createAt(cues, time, duration);
}

function createAt(cues: Cue[], start: number, duration: number) {
  const next = cues.find((cue) => cue.start > start);
  let end = Math.min(start + NEW_CUE_DURATION, next ? next.start - MIN_GAP : duration);
  if (end <= start) end = start + 0.5;
  const cue: Cue = { id: createCueId(), start: roundMs(start), end: roundMs(end), text: '' };
  return { cues: sorted([...cues, cue]), id: cue.id };
}

// mm:ss.mmm (h:mm:ss.mmm a partir de 1 hora).
export function formatClock(seconds: number): string {
  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const ms = String(totalMs % 1000).padStart(3, '0');
  const totalSec = Math.floor(totalMs / 1000);
  const s = String(totalSec % 60).padStart(2, '0');
  const m = Math.floor(totalSec / 60) % 60;
  const h = Math.floor(totalSec / 3600);
  return h > 0
    ? `${String(h)}:${String(m).padStart(2, '0')}:${s}.${ms}`
    : `${String(m).padStart(2, '0')}:${s}.${ms}`;
}
