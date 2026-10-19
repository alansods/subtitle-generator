import { useBlocker, useNavigate } from '@tanstack/react-router';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
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
import { useSession } from '@/lib/session/store';
import { parseSubtitleFile } from '@/lib/subtitles/parse';
import { cn } from '@/lib/utils';

import type { SpokenLanguage } from './protocol';
import { overallProgress, STAGES, useDevice, useTranscription } from './useTranscription';

const LANGUAGES: SpokenLanguage[] = ['pt', 'en', 'auto'];

export function TranscribePage() {
  const { t, i18n } = useTranslation();
  const video = useSession((s) => s.video);
  const device = useDevice();
  const { state, start, cancel, isRunning } = useTranscription();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<SpokenLanguage>(
    i18n.resolvedLanguage === 'en' ? 'en' : 'pt',
  );
  const [importError, setImportError] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const languageId = useId();
  const running = state.status === 'running';

  // Sair durante o processamento: confirma e cancela.
  const blocker = useBlocker({
    shouldBlockFn: isRunning,
    enableBeforeUnload: false,
    withResolver: true,
  });
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

  const importFile = async (file: File) => {
    try {
      const cues = parseSubtitleFile(file.name, await file.text());
      setImportError(false);
      useSession.getState().setCues(cues);
      await navigate({ to: '/edit' });
    } catch {
      setImportError(true);
    }
  };

  const percent = running ? Math.round(overallProgress(state.stage, state.ratio) * 100) : 0;
  const stageIndex = running ? STAGES.indexOf(state.stage) : -1;

  return (
    <>
      <div className="flex flex-wrap items-start gap-7">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-3">
          {video && (
            // A legenda deste vídeo ainda não existe: é o que esta tela vai gerar.
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={video.url}
              controls
              className="aspect-video w-full rounded-3xl bg-[#14171b]"
              aria-label={video.fileName}
            />
          )}
          <p className="text-[13px] text-muted-foreground">{t('footer.privacy')}</p>
        </div>

        <section className="flex min-w-0 flex-[1_1_400px] flex-col gap-5 rounded-3xl bg-card p-6">
          {!running ? (
            <>
              {device === 'wasm' && (
                <div
                  role="status"
                  className="rounded-xl border border-warning bg-warning-soft px-3.5 py-3 text-sm text-warning"
                >
                  {t('transcribe.slowBrowser')}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label htmlFor={languageId} className="text-[15px] font-semibold">
                  {t('transcribe.language')}
                </label>
                <div className="relative">
                  <select
                    id={languageId}
                    value={language}
                    onChange={(event) => {
                      setLanguage(event.target.value as SpokenLanguage);
                    }}
                    className="min-h-11 w-full appearance-none rounded-xl border bg-secondary py-0 pr-10 pl-3.5 text-[15px] font-medium text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {LANGUAGES.map((option) => (
                      <option key={option} value={option}>
                        {t(`transcribe.languages.${option}`)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t('transcribe.explain')}
              </p>

              {state.status === 'error' && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-destructive bg-danger-soft px-3.5 py-3 text-sm text-destructive"
                >
                  <AlertCircle aria-hidden="true" className="mt-0.5 size-[18px] shrink-0" />
                  {state.reason === 'no-speech' ? t('transcribe.noSpeech') : t('transcribe.failed')}
                </div>
              )}

              <Button className="min-h-12 text-base" onClick={() => void start(language)}>
                {state.status === 'error' ? t('transcribe.retry') : t('transcribe.generate')}
              </Button>
              <button
                type="button"
                onClick={() => importRef.current?.click()}
                className="self-center rounded px-1.5 py-1.5 text-sm text-accent-foreground underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {t('transcribe.import')}
              </button>
              <input
                ref={importRef}
                type="file"
                accept=".srt,.vtt"
                className="sr-only"
                tabIndex={-1}
                aria-label={t('transcribe.import')}
                data-testid="subtitle-input"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) void importFile(file);
                }}
              />
              {importError && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive bg-danger-soft px-3.5 py-3 text-sm text-destructive"
                >
                  {t('transcribe.importError')}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-semibold">{t('transcribe.running')}</h2>
                <p className="text-[13px] text-muted-foreground">{t('transcribe.runningHint')}</p>
              </div>
              <div
                role="progressbar"
                aria-label={t('transcribe.running')}
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
              <ol className="flex flex-col gap-2.5">
                {STAGES.map((stage, index) => {
                  const done = index < stageIndex;
                  const current = index === stageIndex;
                  return (
                    <li
                      key={stage}
                      className="flex items-center gap-3 text-[15px]"
                      data-testid={`stage-${stage}`}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'grid size-[22px] place-items-center rounded-full',
                          done && 'bg-success text-card',
                          current && 'border-[3px] border-primary',
                          !done && !current && 'border-2 border-border',
                        )}
                      >
                        {done && <Check className="size-3.5" strokeWidth={3} />}
                      </span>
                      <span
                        className={cn(current ? 'font-semibold' : !done && 'text-muted-foreground')}
                      >
                        {t(`transcribe.stages.${stage}`)}
                        {done && <span className="sr-only"> ({t('transcribe.done')})</span>}
                      </span>
                      {current && state.stage !== 'extract' && state.stage !== 'segment' && (
                        <span className="ml-auto font-mono text-[13px] text-muted-foreground">
                          {Math.floor(state.ratio * 100)}%
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
              <p aria-live="polite" className="sr-only">
                {t(`transcribe.stages.${state.stage}`)} {Math.floor(state.ratio * 10) * 10}%
              </p>
              <Button variant="secondary" className="self-start" onClick={cancel}>
                {t('transcribe.cancel')}
              </Button>
            </div>
          )}
        </section>
      </div>

      <AlertDialog
        open={blocker.status === 'blocked'}
        onOpenChange={(open) => {
          if (!open) blocker.reset?.();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('transcribe.leave.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('transcribe.leave.body')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="min-h-11 rounded-full px-5"
              onClick={() => blocker.reset?.()}
            >
              {t('transcribe.leave.stay')}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="min-h-11 rounded-full px-5"
              onClick={() => {
                cancel();
                blocker.proceed?.();
              }}
            >
              {t('transcribe.leave.go')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
