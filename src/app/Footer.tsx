import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="flex items-center justify-center gap-2 px-6 py-5 text-center text-[13px] text-muted-foreground">
      <Lock aria-hidden="true" className="size-3.5" />
      {t('footer.privacy')}
    </footer>
  );
}
