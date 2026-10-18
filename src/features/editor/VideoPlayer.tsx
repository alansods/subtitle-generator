import { Maximize, Pause, Play, Volume2 } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useFormatters } from '@/i18n/format';
import type { SessionVideo } from '@/lib/session/store';

import { formatClock } from './cueOps';
import { playback, usePlayback } from './playback';
import { SubtitleOverlay } from './SubtitleOverlay';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const iconButton =
  'grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-foreground hover:bg-secondary/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

function TimeLabel() {
  const time = usePlayback((s) => s.time);
  const duration = usePlayback((s) => s.duration);
  return (
    <span className="font-mono text-[13px] whitespace-nowrap">
      {formatClock(time)} / {formatClock(duration)}
    </span>
  );
}

function SeekBar() {
  const { t } = useTranslation();
  const time = usePlayback((s) => s.time);
  const duration = usePlayback((s) => s.duration);
  return (
    <input
      type="range"
      min={0}
      max={duration || 0}
      step={0.01}
      value={time}
      aria-label={t('editor.position')}
      onChange={(event) => {
        playback.seek(Number(event.target.value));
      }}
      className="min-w-36 flex-[1_1_200px] accent-primary"
    />
  );
}

export function VideoPlayer({ video }: { video: SessionVideo }) {
  const { t } = useTranslation();
  const format = useFormatters();
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const speedId = useId();
  const playing = usePlayback((s) => s.playing);
  const rate = usePlayback((s) => s.rate);
  const volume = usePlayback((s) => s.volume);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    return playback.attach(element, video.durationSec);
  }, [video.durationSec]);

  const playLabel = playing ? t('editor.pause') : t('editor.play');

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={wrapperRef}
        className="group relative overflow-hidden rounded-3xl bg-[#14171b]"
        style={{
          aspectRatio: `${String(video.width)} / ${String(video.height)}`,
          containerType: 'size',
        }}
      >
        {/* A legenda é desenhada pelo app (overlay), não pelo player nativo. */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          src={video.url}
          className="absolute inset-0 size-full"
          playsInline
          preload="auto"
        />
        <button
          type="button"
          aria-label={playLabel}
          onClick={playback.toggle}
          className="absolute inset-0 z-[1] grid place-items-center bg-transparent focus-visible:outline-none"
          tabIndex={-1}
        >
          {!playing && (
            <span className="grid size-16 place-items-center rounded-full bg-black/55">
              <Play aria-hidden="true" className="size-7 fill-white text-white" />
            </span>
          )}
        </button>
        <SubtitleOverlay />
      </div>

      <div
        role="group"
        aria-label={t('editor.controls')}
        className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5 rounded-2xl bg-card px-3 py-2"
      >
        <button
          type="button"
          className={iconButton}
          aria-label={playLabel}
          onClick={playback.toggle}
        >
          {playing ? (
            <Pause aria-hidden="true" className="size-[18px]" />
          ) : (
            <Play aria-hidden="true" className="size-[18px]" />
          )}
        </button>
        <TimeLabel />
        <SeekBar />
        <label htmlFor={speedId} className="flex items-center gap-1.5 text-[13px]">
          {t('editor.speed')}
        </label>
        <select
          id={speedId}
          value={String(rate)}
          onChange={(event) => {
            playback.setRate(Number(event.target.value));
          }}
          className="rounded-lg border bg-card px-1.5 py-1 text-[13px]"
        >
          {SPEEDS.map((speed) => (
            <option key={speed} value={String(speed)}>
              {format.number(speed)}×
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-[13px]">
          <Volume2 aria-hidden="true" className="size-4" />
          <span className="sr-only">{t('editor.volume')}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => {
              playback.setVolume(Number(event.target.value));
            }}
            className="w-20 accent-primary"
          />
        </label>
        <button
          type="button"
          className={iconButton}
          aria-label={t('editor.fullscreen')}
          title={t('editor.fullscreen')}
          onClick={() => void wrapperRef.current?.requestFullscreen()}
        >
          <Maximize aria-hidden="true" className="size-[18px]" />
        </button>
      </div>
    </div>
  );
}
