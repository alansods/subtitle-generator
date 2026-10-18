import { AlertCircle, LoaderCircle, Upload } from 'lucide-react';
import { useId, useRef, useState, type DragEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { useFormatters } from '@/i18n/format';
import { cn } from '@/lib/utils';

import { bytesToMegabytes, UPLOAD_LIMITS } from './limits';
import { useVideoIntake } from './useVideoIntake';
import { ACCEPT_ATTRIBUTE } from './validate';

export function VideoDropzone() {
  const { t } = useTranslation();
  const format = useFormatters();
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const [dragging, setDragging] = useState(false);
  const { state, submit, confirmLarge } = useVideoIntake();

  const megabytes = (bytes: number) => `${format.number(bytesToMegabytes(bytes))} MB`;
  const max = megabytes(UPLOAD_LIMITS.maxBytes);

  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) submit(file);
  };

  return (
    <section
      aria-labelledby={titleId}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => {
        setDragging(false);
      }}
      onDrop={onDrop}
      data-testid="dropzone"
      className={cn(
        'flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed px-7 py-10 text-center shadow-sm',
        dragging ? 'border-primary bg-accent' : 'border-border bg-card',
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-16 place-items-center rounded-[20px] bg-primary text-primary-foreground"
      >
        <Upload className="size-7" />
      </span>
      <h2 id={titleId} className="text-xl font-bold">
        {t('upload.dropTitle')}
      </h2>
      <span className="text-sm text-muted-foreground">{t('upload.or')}</span>
      <Button onClick={() => inputRef.current?.click()} disabled={state.status === 'checking'}>
        {state.status === 'checking' ? (
          <>
            <LoaderCircle aria-hidden="true" className="animate-spin" />
            {t('upload.checking')}
          </>
        ) : (
          t('upload.select')
        )}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        className="sr-only"
        tabIndex={-1}
        aria-label={t('upload.select')}
        data-testid="video-input"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) submit(file);
        }}
      />
      <span className="text-[13px] text-muted-foreground">{t('upload.hint', { max })}</span>

      {state.status === 'error' && (
        <div
          role="alert"
          className="flex max-w-xl items-start gap-2.5 rounded-xl border border-destructive bg-danger-soft px-3.5 py-3 text-left text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-[18px] shrink-0" />
          <span>
            {state.reason === 'format' && t('upload.errors.format')}
            {state.reason === 'too-large' &&
              t('upload.errors.tooLarge', { size: megabytes(state.file.size), max })}
            {state.reason === 'unplayable' && t('upload.errors.unplayable')}
          </span>
        </div>
      )}

      {state.status === 'warn-large' && (
        <div
          role="status"
          className="flex max-w-xl flex-wrap items-center gap-3 rounded-xl border border-warning bg-warning-soft px-3.5 py-3 text-left text-sm text-warning"
        >
          <span className="flex-[1_1_240px]">
            {t('upload.warnLarge', { size: megabytes(state.file.size) })}
          </span>
          <Button variant="secondary" size="sm" onClick={confirmLarge}>
            {t('upload.continue')}
          </Button>
        </div>
      )}
    </section>
  );
}
