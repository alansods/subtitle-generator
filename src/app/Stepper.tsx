import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

import { STEP_PATHS, STEPS, type StepAvailability, type StepId } from './steps';

const pill =
  'flex min-h-10 items-center gap-2 rounded-full border py-0 pr-3.5 pl-1.5 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

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
          const number = (
            <span
              className={cn(
                'grid size-7 place-items-center rounded-full text-[13px]',
                isCurrent
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground',
              )}
            >
              {index + 1}
            </span>
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
                    {t(`steps.${step}`)}
                  </span>
                ) : available[step] ? (
                  <Link
                    to={STEP_PATHS[step]}
                    className={cn(pill, 'border-border bg-card text-foreground')}
                  >
                    {number}
                    {t(`steps.${step}`)}
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
                    {t(`steps.${step}`)}
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
