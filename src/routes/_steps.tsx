import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { StepNav } from '@/app/StepNav';
import { Stepper } from '@/app/Stepper';
import { stepFromPath } from '@/app/steps';
import { stepAvailability } from '@/lib/session/selectors';
import { useSession } from '@/lib/session/store';

export const Route = createFileRoute('/_steps')({
  component: StepsLayout,
});

function StepsLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const current = stepFromPath(pathname) ?? 'transcribe';
  const available = useSession(useShallow(stepAvailability));
  return (
    <div className="flex flex-col gap-4">
      {/* Título e stepper na mesma linha; no celular o stepper fica acima do título. */}
      <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-[26px] font-semibold">{t(`pages.${current}.title`)}</h1>
        <Stepper current={current} available={available} />
      </div>
      <Outlet />
      <StepNav current={current} available={available} />
    </div>
  );
}
