import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { buttonVariants } from '@/components/button-variants';
import { useSession } from '@/lib/session/store';

import { CueList } from './CueList';
import { VideoPlayer } from './VideoPlayer';

export function EditorPage() {
  const { t } = useTranslation();
  const video = useSession((s) => s.video);
  if (!video) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-[26px] font-semibold">{t('pages.edit.title')}</h1>
        <Link to="/export" className={buttonVariants({ className: 'ml-auto' })}>
          {t('editor.export')}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
      <div className="flex flex-wrap items-start gap-5">
        <div className="min-w-0 flex-[999_1_620px]">
          <VideoPlayer video={video} />
        </div>
        <CueList />
      </div>
    </div>
  );
}
