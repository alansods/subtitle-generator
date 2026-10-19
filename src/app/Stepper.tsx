import { Link } from '@tanstack/react-router';
import { Check, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

import { STEP_PATHS, STEPS, type StepAvailability, type StepId } from './steps';

const pill =
  'flex min-h-10 items-center gap-2 rounded-full border py-0 pr-3.5 pl-1.5 text-sm font-semibold whitespace-nowrap max-sm:pr-1.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

interface StepperProps {
  current: StepId;
  available: StepAvailability;
}

export function Stepper({ current, available }: StepperProps) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('steps.label')}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0">
        {STEPS.map((step, index) => {
          const isCurrent = step === current;
          const isDone = index < STEPS.indexOf(current);
          const number = (
            <span
              className={cn(
                'grid size-7 place-items-center rounded-full text-[13px]',
                isCurrent
                  ? 'bg-primary text-primary-foreground'
                  : isDone
                    ? 'bg-success-soft text-success'
                    : 'bg-secondary text-muted-foreground',
              )}
            >
              {isDone ? (
                <>
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                  <span className="sr-only">{t('steps.done')}</span>
                </>
              ) : (
                index + 1
              )}
            </span>
          );
          // No celular, só a etapa atual mostra o nome (as outras ficam com o número/✓).
          const label = (
            <span className={cn(!isCurrent && 'max-sm:sr-only')}>{t(`steps.${step}`)}</span>
          );
          return (
            <Fragment key={step}>
              {index > 0 && (
                <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
              )}
              <li>
                {isCurrent ? (
                  <span
                    aria-current="step"
                    className={cn(pill, 'border-primary bg-accent text-foreground')}
                  >
                    {number}
                    {label}
                  </span>
                ) : available[step] ? (
                  <Link
                    to={STEP_PATHS[step]}
                    className={cn(pill, 'border-border bg-card text-foreground')}
                  >
                    {number}
                    {label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className={cn(
                      pill,
                      'border-border bg-transparent text-muted-foreground opacity-60',
                    )}
                  >
                    {number}
                    {label}
                  </button>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
