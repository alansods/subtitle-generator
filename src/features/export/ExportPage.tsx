import { Link, useNavigate } from '@tanstack/react-router';
import { AlertCircle, ArrowLeft, Captions, Check, Download, Film } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { buttonVariants } from '@/components/button-variants';
import { downloadText } from '@/lib/download';
import { useSession } from '@/lib/session/store';
import { buildSubtitleFile, SUBTITLE_FORMATS, type SubtitleFormat } from '@/lib/subtitles/files';
import { summarizeIssues, validateCues } from '@/lib/subtitles/validation';
import { cn } from '@/lib/utils';

import { VideoExportPanel } from './VideoExportPanel';

type ExportMode = 'subtitle' | 'video';

const MODES = [
  {
    value: 'subtitle',
    icon: Captions,
    title: 'export.subtitleOnly',
    description: 'export.subtitleOnlyDescription',
  },
  {
    value: 'video',
    icon: Film,
    title: 'export.videoWithSubtitle',
    description: 'export.videoWithSubtitleDescription',
  },
] as const;

export function ExportPage() {
  const { t } = useTranslation();
  const video = useSession((s) => s.video);
  const cues = useSession((s) => s.cues);
  const downloaded = useSession((s) => s.downloaded);
  const markDownloaded = useSession((s) => s.markDownloaded);
  const [format, setFormat] = useState<SubtitleFormat>('srt');
  const [mode, setMode] = useState<ExportMode>('subtitle');
  const [generating, setGenerating] = useState(false);
  const legendId = useId();
  const modeId = useId();
  const { cuesWithErrors } = useMemo(() => summarizeIssues(validateCues(cues)), [cues]);
  const blocked = cuesWithErrors > 0;
  const fileName = `${video?.name ?? 'legenda'}.${format}`;

  const navigate = useNavigate();
  const download = () => {
    const { content, mime } = buildSubtitleFile(cues, format);
    downloadText(fileName, content, mime);
    markDownloaded({ kind: 'subtitle', fileName });
    void navigate({ to: '/done' });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[26px] font-semibold">{t('pages.export.title')}</h1>
        <Link to="/edit" className={buttonVariants({ variant: 'secondary', className: 'ml-auto' })}>
          <ArrowLeft aria-hidden="true" />
          {t('export.back')}
        </Link>
      </div>

      {blocked && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive bg-danger-soft px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="size-[18px] shrink-0" />
          <span className="flex-[1_1_280px]">{t('export.blocked', { count: cuesWithErrors })}</span>
          <Link to="/edit" className="font-semibold underline">
            {t('export.fix')}
          </Link>
        </div>
      )}

      <fieldset aria-labelledby={modeId} disabled={generating}>
        <legend id={modeId} className="mb-2.5 text-[15px] font-semibold">
          {t('export.mode')}
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MODES.map(({ value, icon: Icon, title, description }) => (
            <label
              key={value}
              className={cn(
                'flex cursor-pointer flex-col gap-1.5 rounded-3xl border-2 bg-card p-5 has-[:disabled]:cursor-not-allowed has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                mode === value ? 'border-primary' : 'border-transparent hover:bg-secondary',
              )}
            >
              <input
                type="radio"
                name="export-mode"
                value={value}
                checked={mode === value}
                onChange={() => {
                  setMode(value);
                }}
                className="sr-only"
              />
              <span className="flex items-center gap-2 text-base font-bold">
                <Icon aria-hidden="true" className="size-[18px]" />
                {t(title)}
              </span>
              <span className="text-[13px] leading-snug text-muted-foreground">
                {t(description)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {mode === 'video' ? (
        <VideoExportPanel blocked={blocked} onRunningChange={setGenerating} />
      ) : (
        <section className="flex max-w-2xl flex-col gap-5 rounded-3xl bg-card p-6">
          <fieldset aria-labelledby={legendId}>
            <legend id={legendId} className="mb-2 text-[15px] font-semibold">
              {t('export.format')}
            </legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SUBTITLE_FORMATS) as SubtitleFormat[]).map((option) => (
                <label
                  key={option}
                  className={cn(
                    'inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 text-sm font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                    format === option
                      ? 'bg-ink text-ink-foreground'
                      : 'bg-secondary text-foreground',
                  )}
                >
                  <input
                    type="radio"
                    name="subtitle-format"
                    checked={format === option}
                    onChange={() => {
                      setFormat(option);
                    }}
                    className="sr-only"
                  />
                  {SUBTITLE_FORMATS[option].label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-muted-foreground">{t('export.fileName')}</span>
            <code
              data-testid="file-name"
              className="rounded-lg border bg-secondary px-3 py-2 font-mono text-sm"
            >
              {fileName}
            </code>
          </div>
          <Button className="self-start" disabled={blocked} onClick={download}>
            <Download aria-hidden="true" />
            {t('export.download')}
          </Button>
          {downloaded?.kind === 'subtitle' && (
            <p role="status" className="flex items-center gap-2 text-sm font-semibold text-success">
              <Check aria-hidden="true" className="size-4" />
              {t('export.downloaded', { file: downloaded.fileName })}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
