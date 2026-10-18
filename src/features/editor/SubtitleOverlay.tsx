import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { useSession } from '@/lib/session/store';
import { styleToCss } from '@/lib/subtitles/style';

import { activeCueAt, addCueAt } from './cueOps';
import { playback, usePlayback } from './playback';

export function SubtitleOverlay() {
  const { t } = useTranslation();
  const cues = useSession((s) => s.cues);
  const setCues = useSession((s) => s.setCues);
  const updateCue = useSession((s) => s.updateCue);
  const active = usePlayback((s) => activeCueAt(cues, s.time));
  const playing = usePlayback((s) => s.playing);
  const [editing, setEditing] = useState<{ id: string; draft: string } | null>(null);
  const style = useSession((s) => s.style);
  const css = styleToCss(style);
  const WRAP = css.wrap as CSSProperties;
  const TEXT = css.text as CSSProperties;
  // Em edição, o campo precisa ser legível mesmo com fundo transparente.
  const EDIT: CSSProperties =
    style.background === 'white'
      ? { ...TEXT, background: '#fff', color: '#000' }
      : { ...TEXT, background: '#000', color: '#fff', textShadow: 'none' };

  const startEditing = (id: string, text: string) => {
    playback.pause();
    setEditing({ id, draft: text });
  };

  const save = () => {
    if (!editing) return;
    updateCue(editing.id, { text: editing.draft });
    setEditing(null);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      save();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setEditing(null);
    }
  };

  const addHere = () => {
    const { time, duration } = usePlayback.getState();
    const result = addCueAt(cues, time, duration);
    setCues(result.cues);
    setEditing({ id: result.id, draft: '' });
  };

  if (editing) {
    return (
      <div style={WRAP}>
        <div className="flex w-full flex-col items-center gap-1.5">
          <textarea
            // eslint-disable-next-line jsx-a11y/no-autofocus -- o usuário acabou de clicar na legenda para editar
            autoFocus
            rows={2}
            value={editing.draft}
            aria-label={t('editor.editCue')}
            onChange={(event) => {
              setEditing({ ...editing, draft: event.target.value });
            }}
            onKeyDown={onKeyDown}
            onBlur={save}
            style={{
              ...EDIT,
              width: 'min(92%, 900px)',
              textAlign: 'center',
              resize: 'none',
              outline: '2px solid #a897ff',
            }}
          />
          <span className="rounded bg-black/75 px-2 py-0.5 text-xs text-white">
            {t('editor.editHint')}
          </span>
        </div>
      </div>
    );
  }

  if (active?.text) {
    return (
      <div style={WRAP}>
        <button
          type="button"
          aria-label={`${t('editor.editCue')}: ${active.text.replace(/\n/g, ' ')}`}
          onClick={() => {
            startEditing(active.id, active.text);
          }}
          className="cursor-text hover:outline-2 hover:outline-offset-4 hover:outline-[#a897ff] hover:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a897ff]"
          style={TEXT}
        >
          {active.text}
        </button>
      </div>
    );
  }

  if (active) {
    return (
      <div style={WRAP}>
        <button
          type="button"
          onClick={() => {
            startEditing(active.id, active.text);
          }}
          className="rounded-full border border-dashed border-white/70 bg-black/60 px-3.5 py-2 text-[13px] text-white"
        >
          {t('editor.emptyCue')}
        </button>
      </div>
    );
  }

  if (playing) return null;

  return (
    <div style={WRAP}>
      <button
        type="button"
        onClick={addHere}
        className="rounded-full border border-dashed border-white/70 bg-black/60 px-3.5 py-2 text-[13px] text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        {t('editor.addHere')}
      </button>
    </div>
  );
}
