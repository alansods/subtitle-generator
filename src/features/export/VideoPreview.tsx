import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useSession } from '@/lib/session/store';
import { styleToCss } from '@/lib/subtitles/style';

// Um quadro do vídeo no início da primeira legenda, com ela desenhada no estilo atual.
export function VideoPreview() {
  const { t } = useTranslation();
  const video = useSession((s) => s.video);
  const style = useSession((s) => s.style);
  const first = useSession((s) => s.cues.find((cue) => cue.text.trim()));
  const ref = useRef<HTMLVideoElement>(null);
  const css = styleToCss(style);
  const at = first ? first.start + 0.05 : 0;

  useEffect(() => {
    const element = ref.current;
    if (element && element.readyState >= 1) element.currentTime = at;
  }, [at]);

  if (!video) return null;
  return (
    <figure
      aria-label={t('export.video.preview')}
      className="relative overflow-hidden rounded-2xl bg-[#14171b]"
      style={{
        aspectRatio: `${String(video.width)} / ${String(video.height)}`,
        containerType: 'size',
      }}
    >
      {/* Prévia muda e parada: a legenda está desenhada por cima. */}
      <video
        ref={ref}
        src={video.url}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 size-full"
        onLoadedMetadata={(event) => {
          event.currentTarget.currentTime = at;
        }}
      />
      {first && (
        <div style={css.wrap}>
          <span data-testid="preview-cue" style={css.text}>
            {first.text}
          </span>
        </div>
      )}
    </figure>
  );
}
