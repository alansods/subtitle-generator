import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { buttonVariants } from '@/components/button-variants';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-3.5 px-4 py-20 text-center">
      <span className="font-mono text-6xl font-medium text-muted-foreground">404</span>
      <h1 className="text-2xl font-semibold">{t('notFound.title')}</h1>
      <p className="max-w-md text-muted-foreground">{t('notFound.body')}</p>
      <Link to="/" className={buttonVariants({ variant: 'primary' })}>
        {t('notFound.home')}
      </Link>
    </div>
  );
}
