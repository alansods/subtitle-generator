import type { Cue } from './types';

// Avisos só para o que atrapalha a exibição. Duração e velocidade de leitura não geram
// aviso: a legenda acompanha a fala, e quem fala rápido gera cues curtas e rápidas.
export const VALIDATION_RULES = {
  maxLines: 2,
  maxLineChars: 42,
} as const;

export type IssueCode = 'order' | 'overlap' | 'empty' | 'lines' | 'lineLength';

// Erros bloqueiam a exportação; avisos só alertam.
export interface CueIssue {
  code: IssueCode;
  level: 'error' | 'warning';
}

export function validateCue(cue: Cue, next?: Cue): CueIssue[] {
  const issues: CueIssue[] = [];
  if (cue.start >= cue.end) issues.push({ code: 'order', level: 'error' });
  if (next && cue.end > next.start) issues.push({ code: 'overlap', level: 'error' });
  if (cue.text.trim() === '') issues.push({ code: 'empty', level: 'error' });

  const lines = cue.text.split('\n');
  if (lines.length > VALIDATION_RULES.maxLines) issues.push({ code: 'lines', level: 'warning' });
  if (lines.some((line) => line.length > VALIDATION_RULES.maxLineChars)) {
    issues.push({ code: 'lineLength', level: 'warning' });
  }
  return issues;
}

export function validateCues(cues: readonly Cue[]): Map<string, CueIssue[]> {
  const result = new Map<string, CueIssue[]>();
  cues.forEach((cue, index) => {
    const issues = validateCue(cue, cues[index + 1]);
    if (issues.length) result.set(cue.id, issues);
  });
  return result;
}

export function summarizeIssues(issues: Map<string, CueIssue[]>) {
  let errors = 0;
  let warnings = 0;
  let cuesWithErrors = 0;
  for (const list of issues.values()) {
    const cueErrors = list.filter((issue) => issue.level === 'error').length;
    errors += cueErrors;
    warnings += list.length - cueErrors;
    if (cueErrors) cuesWithErrors += 1;
  }
  return { errors, warnings, cuesWithErrors, cuesWithIssues: issues.size };
}
