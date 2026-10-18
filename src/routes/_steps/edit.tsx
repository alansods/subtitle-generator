import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/_steps/edit')({
  component: EditPage,
});

function EditPage() {
  const { t } = useTranslation();
  return <h1 className="text-[26px] font-semibold">{t('pages.edit.title')}</h1>;
}
