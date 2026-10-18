import { AlertTriangle, Merge, Plus, Scissors, Trash2 } from 'lucide-react';
import { memo, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSession } from '@/lib/session/store';
import type { Cue } from '@/lib/subtitles/types';
import { summarizeIssues, validateCues, type CueIssue } from '@/lib/subtitles/validation';
import { cn } from '@/lib/utils';

import {
  activeCueAt,
  deleteCue,
  formatClock,
  insertAfter,
  mergeWithNext,
  nudgeCue,
  splitCue,
} from './cueOps';
import { playback, usePlayback } from './playback';

const NUDGE = 0.1;
const NO_ISSUES: CueIssue[] = [];

const nudgeButton =
  'grid size-[26px] place-items-center rounded-md bg-card text-sm leading-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';
const actionButton =
  'inline-flex min-h-8 items-center gap-1.5 rounded-full bg-card px-2.5 text-xs font-semibold hover:bg-secondary/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50 [&_svg]:size-3.5';

interface RowProps {
  cue: Cue;
  number: number;
  active: boolean;
  isLast: boolean;
  issues: CueIssue[];
}

function IssueBadges({ issues }: { issues: CueIssue[] }) {
  const { t } = useTranslation();
  return (
    <ul className="flex flex-wrap gap-1">
      {issues.map((issue) => (
        <li
          key={issue.code}
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-bold',
            issue.level === 'error'
              ? 'bg-danger-soft text-destructive'
              : 'bg-warning-soft text-warning',
          )}
        >
          {t(`validation.${issue.code}`)}
        </li>
      ))}
    </ul>
  );
}

const CueRow = memo(function CueRow({ cue, number, active, isLast, issues }: RowProps) {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const updateCue = useSession((s) => s.updateCue);
  const setCues = useSession((s) => s.setCues);

  const mutate = (change: (cues: Cue[], duration: number) => Cue[]) => {
    setCues(change(useSession.getState().cues, usePlayback.getState().duration));
  };
  const n = { n: number };

  return (
    <li
      data-cue-id={cue.id}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex flex-col gap-2 rounded-[18px] border-2 px-3.5 py-3',
        active
          ? 'border-primary bg-accent'
          : issues.some((issue) => issue.level === 'error')
            ? 'border-destructive bg-card'
            : 'border-transparent bg-secondary',
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          aria-label={t('editor.seekTo', n)}
          onClick={() => {
            playback.pause();
            playback.seek(cue.start + 0.001);
          }}
          className="min-h-[30px] rounded-md bg-card px-2 font-mono text-xs font-semibold hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          #{number}
        </button>
        <span className="flex items-center gap-0.5 font-mono text-xs">
          <button
            type="button"
            className={nudgeButton}
            aria-label={t('editor.startEarlier', n)}
            onClick={() => {
              mutate((c, d) => nudgeCue(c, cue.id, 'start', -NUDGE, d));
            }}
          >
            −
          </button>
          <span>{formatClock(cue.start)}</span>
          <button
            type="button"
            className={nudgeButton}
            aria-label={t('editor.startLater', n)}
            onClick={() => {
              mutate((c, d) => nudgeCue(c, cue.id, 'start', NUDGE, d));
            }}
          >
            +
          </button>
          <span aria-hidden="true" className="px-1 text-muted-foreground">
            →
          </span>
          <button
            type="button"
            className={nudgeButton}
            aria-label={t('editor.endEarlier', n)}
            onClick={() => {
              mutate((c, d) => nudgeCue(c, cue.id, 'end', -NUDGE, d));
            }}
          >
            −
          </button>
          <span>{formatClock(cue.end)}</span>
          <button
            type="button"
            className={nudgeButton}
            aria-label={t('editor.endLater', n)}
            onClick={() => {
              mutate((c, d) => nudgeCue(c, cue.id, 'end', NUDGE, d));
            }}
          >
            +
          </button>
        </span>
      </div>
      <textarea
        ref={textareaRef}
        rows={2}
        value={cue.text}
        aria-label={t('editor.cueText', n)}
        onChange={(event) => {
          updateCue(cue.id, { text: event.target.value });
        }}
        className="w-full rounded-md border bg-card px-2.5 py-2 text-sm leading-snug"
      />
      {issues.length > 0 && <IssueBadges issues={issues} />}
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          className={actionButton}
          onClick={() => {
            mutate((c) =>
              splitCue(
                c,
                cue.id,
                textareaRef.current?.selectionStart ?? Math.floor(cue.text.length / 2),
              ),
            );
          }}
        >
          <Scissors aria-hidden="true" />
          {t('editor.split')}
        </button>
        <button
          type="button"
          className={actionButton}
          disabled={isLast}
          onClick={() => {
            mutate((c) => mergeWithNext(c, cue.id));
          }}
        >
          <Merge aria-hidden="true" />
          {t('editor.merge')}
        </button>
        <button
          type="button"
          className={actionButton}
          onClick={() => {
            mutate((c, d) => insertAfter(c, cue.id, d).cues);
          }}
        >
          <Plus aria-hidden="true" />
          {t('editor.insertAfter')}
        </button>
        <button
          type="button"
          className={cn(actionButton, 'text-destructive')}
          onClick={() => {
            mutate((c) => deleteCue(c, cue.id));
          }}
        >
          <Trash2 aria-hidden="true" />
          {t('editor.delete')}
        </button>
      </div>
    </li>
  );
});

export function CueList() {
  const { t } = useTranslation();
  const cues = useSession((s) => s.cues);
  const activeId = usePlayback((s) => activeCueAt(cues, s.time)?.id);
  const [follow, setFollow] = useState(true);
  const [onlyIssues, setOnlyIssues] = useState(false);
  const issues = useMemo(() => validateCues(cues), [cues]);
  const summary = summarizeIssues(issues);
  const hasIssues = summary.cuesWithIssues > 0;
  const filtering = onlyIssues && hasIssues;
  const summaryLabel = [
    summary.errors ? t('validation.errors', { count: summary.errors }) : null,
    summary.warnings ? t('validation.warnings', { count: summary.warnings }) : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const listRef = useRef<HTMLOListElement>(null);
  const titleId = useId();

  // Seguir vídeo: rola a própria lista (não a página) até a cue ativa.
  useEffect(() => {
    if (!follow || !activeId || !listRef.current) return;
    const row = listRef.current.querySelector<HTMLElement>(`[data-cue-id="${activeId}"]`);
    if (row) listRef.current.scrollTop = Math.max(0, row.offsetTop - 8);
  }, [activeId, follow]);

  return (
    <section
      aria-labelledby={titleId}
      className="flex max-h-[760px] min-w-0 flex-[1_1_380px] flex-col rounded-3xl bg-card"
    >
      <div className="flex flex-wrap items-center gap-2.5 px-4 py-3">
        <h2 id={titleId} className="text-base font-semibold">
          {t('editor.cues')}{' '}
          <span className="text-sm font-normal text-muted-foreground">({cues.length})</span>
        </h2>
        {hasIssues && (
          <button
            type="button"
            aria-pressed={filtering}
            onClick={() => {
              setOnlyIssues(!filtering);
            }}
            className={cn(
              'inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] font-bold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              summary.errors
                ? 'border-destructive text-destructive'
                : 'border-warning text-warning',
              filtering && (summary.errors ? 'bg-danger-soft' : 'bg-warning-soft'),
            )}
          >
            <AlertTriangle aria-hidden="true" className="size-4" />
            {summaryLabel}
          </button>
        )}
        <label className="ml-auto flex items-center gap-1.5 text-[13px]">
          <input
            type="checkbox"
            checked={follow}
            onChange={() => {
              setFollow(!follow);
            }}
            className="size-4 accent-primary"
          />
          {t('editor.follow')}
        </label>
      </div>
      {filtering && (
        <p className="flex items-center gap-2 px-4 pb-2 text-[13px] text-muted-foreground">
          {t('validation.filtering')}
          <button
            type="button"
            onClick={() => {
              setOnlyIssues(false);
            }}
            className="rounded px-0.5 text-accent-foreground underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {t('validation.showAll')}
          </button>
        </p>
      )}
      <ol
        ref={listRef}
        data-testid="cue-list"
        className="relative flex flex-1 flex-col gap-1.5 overflow-y-auto p-2"
      >
        {cues.map((cue, index) =>
          filtering && !issues.has(cue.id) ? null : (
            <CueRow
              key={cue.id}
              cue={cue}
              number={index + 1}
              active={cue.id === activeId}
              isLast={index === cues.length - 1}
              issues={issues.get(cue.id) ?? NO_ISSUES}
            />
          ),
        )}
      </ol>
    </section>
  );
}
