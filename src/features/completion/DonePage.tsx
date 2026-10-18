import { Link } from '@tanstack/react-router';
import { Check, Pencil, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { downloadBlob, downloadText } from '@/lib/download';
import { useSession } from '@/lib/session/store';
import { buildSubtitleFile, formatFromFileName } from '@/lib/subtitles/files';

const card =
  'flex min-h-24 flex-col items-start gap-1.5 rounded-3xl p-5 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

export function DonePage() {
  const { t } = useTranslation();
  const downloaded = useSession((s) => s.downloaded);
  const cues = useSession((s) => s.cues);
  if (!downloaded) return null;

  const downloadAgain = () => {
    // Vídeo: o mesmo MP4 já gerado, sem processar de novo.
    if (downloaded.blob) {
      downloadBlob(downloaded.fileName, downloaded.blob);
      return;
    }
    const { content, mime } = buildSubtitleFile(cues, formatFromFileName(downloaded.fileName));
    downloadText(downloaded.fileName, content, mime);
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-12 pb-6 text-center">
      <span
        aria-hidden="true"
        className="grid size-[72px] place-items-center rounded-full bg-success-soft text-success"
      >
        <Check className="size-9" strokeWidth={2.4} />
      </span>
      <div className="flex flex-col items-center gap-2.5">
        <h1 className="text-3xl font-bold">
          {downloaded.kind === 'video' ? t('done.titleVideo') : t('done.titleSubtitle')}
        </h1>
        <code className="rounded-lg border bg-card px-3 py-1.5 font-mono text-sm">
          {downloaded.fileName}
        </code>
        <button
          type="button"
          onClick={downloadAgain}
          className="rounded px-1.5 py-1.5 text-sm text-accent-foreground underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t('done.again')}
        </button>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Link to="/edit" className={`${card} bg-card hover:bg-secondary`}>
          <span className="flex items-center gap-2 text-base font-bold">
            <Pencil aria-hidden="true" className="size-[18px]" />
            {t('done.edit')}
          </span>
          <span className="text-[13px] leading-snug text-muted-foreground">
            {t('done.editDescription')}
          </span>
        </Link>
        <Link to="/" className={`${card} bg-primary text-primary-foreground hover:bg-primary/90`}>
          <span className="flex items-center gap-2 text-base font-bold">
            <Plus aria-hidden="true" className="size-[18px]" />
            {t('done.new')}
          </span>
          <span className="text-[13px] leading-snug">{t('done.newDescription')}</span>
        </Link>
      </div>
      <p className="max-w-lg text-[13px] leading-relaxed text-muted-foreground">{t('done.note')}</p>
    </div>
  );
}
