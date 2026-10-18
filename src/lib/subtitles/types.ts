import { z } from 'zod';

// Uma legenda (cue): intervalo em segundos (precisão de ms) e texto com até 2 linhas.
export const cueSchema = z
  .object({
    id: z.string().min(1),
    start: z.number().nonnegative(),
    end: z.number().nonnegative(),
    text: z.string(),
  })
  .strict();

export type Cue = z.infer<typeof cueSchema>;

let sequence = 0;
export function createCueId(): string {
  sequence += 1;
  return `cue-${Date.now().toString(36)}-${sequence.toString(36)}`;
}
