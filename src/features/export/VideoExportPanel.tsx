import { useBlocker, useNavigate } from '@tanstack/react-router';
import { AlertCircle, Film } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StylePanel } from '@/features/style/StylePanel';
import { downloadBlob } from '@/lib/download';
import { useSession } from '@/lib/session/store';

import { useVideoExport, type VideoExportState } from './useVideoExport';
import { VideoPreview } from './VideoPreview';

function Remaining({ seconds }: { seconds: number | null }) {
  const { t } = useTranslation();
  if (seconds === null) return null;
  return (
    <span className="text-[13px] text-muted-foreground">
      {seconds < 60
        ? t('export.video.remainingSeconds', { count: seconds })
        : t('export.video.remainingMinutes', { count: Math.ceil(seconds / 60) })}
    </span>
  );
}

function Progress({ state, onCancel }: { state: VideoExportState; onCancel: () => void }) {
  const { t } = useTranslation();
  if (state.status !== 'running') return null;
  const encoding = state.stage === 'encode';
  const percent = encoding ? Math.floor(state.ratio * 100) : 0;
  const label = t(`export.video.stages.${state.stage}`);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <h3 className="text-lg font-semibold">{label}</h3>
        {encoding && (
          <span className="ml-auto font-mono text-[15px] font-semibold">{percent}%</span>
        )}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-2.5 overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full bg-primary transition-[width]"
          style={{ width: `${String(percent)}%` }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {encoding && <Remaining seconds={state.remainingSec} />}
        <span className="text-[13px] text-muted-foreground">{t('export.video.hint')}</span>
      </div>
      <p aria-live="polite" className="sr-only">
        {label} {encoding ? `${String(Math.floor(state.ratio * 10) * 10)}%` : ''}
      </p>
      <Button variant="secondary" className="self-start" onClick={onCancel}>
        {t('export.video.cancel')}
      </Button>
    </div>
  );
}

interface VideoExportPanelProps {
  blocked: boolean;
  onRunningChange?: (running: boolean) => void;
}

export function VideoExportPanel({ blocked, onRunningChange }: VideoExportPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const video = useSession((s) => s.video);
  const { state, start, cancel, isRunning } = useVideoExport();
  const running = state.status === 'running';
  const fileName = `${video?.name ?? 'video'}-${t('export.video.suffix')}.mp4`;

  // Sair durante a geração: confirma e cancela.
  const blocker = useBlocker({
    shouldBlockFn: isRunning,
    enableBeforeUnload: false,
    withResolver: true,
  });
  useEffect(() => {
    onRunningChange?.(running);
  }, [running, onRunningChange]);
  useEffect(() => {
    if (!running) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [running]);

  const generate = async () => {
    const { video: current, cues, style } = useSession.getState();
    if (!current) return;
    const blob = await start({
      video: current.file,
      cues,
      style,
      width: current.width,
      height: current.height,
    });
    if (!blob) return;
    downloadBlob(fileName, blob);
    useSession.getState().markDownloaded({ kind: 'video', fileName, blob });
    await navigate({ to: '/done' });
  };

  return (
    <div className="flex flex-wrap items-start gap-5">
      <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-3">
        <VideoPreview />
        <fieldset disabled={running} className="contents">
          <StylePanel />
        </fieldset>
      </div>
      <section className="flex min-w-0 flex-[1_1_320px] flex-col gap-5 rounded-3xl bg-card p-6">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] text-muted-foreground">{t('export.fileName')}</span>
          <code
            data-testid="video-file-name"
            className="rounded-lg border bg-secondary px-3 py-2 font-mono text-sm break-all"
          >
            {fileName}
          </code>
        </div>
        {running ? (
          <Progress state={state} onCancel={cancel} />
        ) : (
          <>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t('export.video.explain')}
            </p>
            {state.status === 'error' && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-destructive bg-danger-soft px-3.5 py-3 text-sm text-destructive"
              >
                <AlertCircle aria-hidden="true" className="mt-0.5 size-[18px] shrink-0" />
                {t('export.video.failed')}
              </div>
            )}
            <Button className="self-start" disabled={blocked} onClick={() => void generate()}>
              <Film aria-hidden="true" />
              {state.status === 'error' ? t('export.video.retry') : t('export.video.generate')}
            </Button>
          </>
        )}
      </section>

      <AlertDialog
        open={blocker.status === 'blocked'}
        onOpenChange={(open) => {
          if (!open) blocker.reset?.();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('export.video.leave.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('export.video.leave.body')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="min-h-11 rounded-full px-5"
              onClick={() => blocker.reset?.()}
            >
              {t('export.video.leave.stay')}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="min-h-11 rounded-full px-5"
              onClick={() => {
                cancel();
                blocker.proceed?.();
              }}
            >
              {t('export.video.leave.go')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
