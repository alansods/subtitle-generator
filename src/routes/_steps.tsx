import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { useShallow } from 'zustand/react/shallow';

import { Stepper } from '@/app/Stepper';
import { stepFromPath } from '@/app/steps';
import { stepAvailability } from '@/lib/session/selectors';
import { useSession } from '@/lib/session/store';

export const Route = createFileRoute('/_steps')({
  component: StepsLayout,
});

function StepsLayout() {
  const { pathname } = useLocation();
  const current = stepFromPath(pathname) ?? 'transcribe';
  const available = useSession(useShallow(stepAvailability));
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-end gap-4">
        <Stepper current={current} available={available} />
      </div>
      <Outlet />
    </div>
  );
}
