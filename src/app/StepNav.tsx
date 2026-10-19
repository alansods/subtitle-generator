import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { buttonVariants } from '@/components/button-variants';

import { STEP_PATHS, STEPS, type StepAvailability, type StepId } from './steps';

interface StepNavProps {
  current: StepId;
  available: StepAvailability;
}

// Navegação tradicional no fim de cada etapa: Voltar à esquerda, Avançar à direita.
// Sem Voltar na primeira etapa; sem Avançar na última (ela termina no download).
export function StepNav({ current, available }: StepNavProps) {
  const { t } = useTranslation();
  const index = STEPS.indexOf(current);
  const previous = STEPS[index - 1];
  const next = STEPS[index + 1];

  return (
    <nav aria-label={t('steps.navigation')} className="flex items-center gap-3 border-t pt-4">
      {previous && (
        <Link to={STEP_PATHS[previous]} className={buttonVariants({ variant: 'secondary' })}>
          <ArrowLeft aria-hidden="true" />
          {t('steps.back')}
        </Link>
      )}
      {next &&
        (available[next] ? (
          <Link to={STEP_PATHS[next]} className={buttonVariants({ className: 'ml-auto' })}>
            {t('steps.next')}
            <ArrowRight aria-hidden="true" />
          </Link>
        ) : (
          <Button className="ml-auto" disabled>
            {t('steps.next')}
            <ArrowRight aria-hidden="true" />
          </Button>
        ))}
    </nav>
  );
}
