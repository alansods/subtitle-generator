import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { requireCues } from '@/lib/session/guards';

export const Route = createFileRoute('/_steps/export')({
  beforeLoad: requireCues,
  component: ExportPage,
});

function ExportPage() {
  const { t } = useTranslation();
  return <h1 className="text-[26px] font-semibold">{t('pages.export.title')}</h1>;
}
