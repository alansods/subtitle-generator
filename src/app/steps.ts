export const STEPS = ['transcribe', 'edit', 'export'] as const;
export type StepId = (typeof STEPS)[number];
export type StepAvailability = Record<StepId, boolean>;

export const STEP_PATHS = {
  transcribe: '/transcribe',
  edit: '/edit',
  export: '/export',
} as const satisfies Record<StepId, string>;

export function stepFromPath(pathname: string): StepId | undefined {
  return STEPS.find((step) => STEP_PATHS[step] === pathname);
}
