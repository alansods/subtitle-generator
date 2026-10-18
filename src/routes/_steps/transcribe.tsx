import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_steps/transcribe')({
  component: TranscribePage,
});

function TranscribePage() {
  const { t } = useTranslation();
  return <h1 className="text-[26px] font-semibold">{t('pages.transcribe.title')}</h1>;
}
