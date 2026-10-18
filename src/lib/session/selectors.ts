import type { StepAvailability } from '@/app/steps';

import type { SessionState } from './store';

export const hasVideo = (state: SessionState) => state.video !== null;
export const hasCues = (state: SessionState) => state.cues.length > 0;

// Há o que perder: legenda gerada e não baixada desde a última edição.
export const hasUnsavedWork = (state: SessionState) => hasCues(state) && state.downloaded === null;

export function stepAvailability(state: SessionState): StepAvailability {
  return { transcribe: hasVideo(state), edit: hasCues(state), export: hasCues(state) };
}
