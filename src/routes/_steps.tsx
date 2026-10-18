import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';

import { Stepper } from '@/app/Stepper';
import { stepFromPath, type StepAvailability } from '@/app/steps';

// Disponibilidade das etapas; passa a vir da sessão em add-session.
function useStepAvailability(): StepAvailability {
  return { transcribe: true, edit: true, export: true };
}

export const Route = createFileRoute('/_steps')({
  component: StepsLayout,
});

function StepsLayout() {
  const { pathname } = useLocation();
  const current = stepFromPath(pathname) ?? 'transcribe';
  const available = useStepAvailability();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Stepper current={current} available={available} />
      </div>
      <Outlet />
    </div>
  );
}
