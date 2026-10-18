import { create } from 'zustand';

// Estado de reprodução do vídeo do editor, separado da sessão: muda a cada frame.
export interface PlaybackState {
  time: number;
  duration: number;
  playing: boolean;
  rate: number;
  volume: number;
}

const INITIAL: PlaybackState = { time: 0, duration: 0, playing: false, rate: 1, volume: 1 };

export const usePlayback = create<PlaybackState>()(() => INITIAL);

let video: HTMLVideoElement | null = null;
let frame = 0;

function tick() {
  if (!video) return;
  usePlayback.setState({ time: video.currentTime });
  if (!video.paused) frame = requestAnimationFrame(tick);
}

const clamp = (value: number, max: number) => Math.min(Math.max(0, value), max || value);

export const playback = {
  // Liga a store a um <video>; devolve a função que desliga.
  attach: (element: HTMLVideoElement, fallbackDuration = 0) => {
    video = element;
    usePlayback.setState({
      ...INITIAL,
      duration: Number.isFinite(element.duration) ? element.duration : fallbackDuration,
      playing: !element.paused,
    });
    const sync = () => {
      usePlayback.setState({ time: element.currentTime });
    };
    const onPlay = () => {
      usePlayback.setState({ playing: true });
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };
    const onPause = () => {
      cancelAnimationFrame(frame);
      usePlayback.setState({ playing: false, time: element.currentTime });
    };
    const onMetadata = () => {
      if (Number.isFinite(element.duration)) usePlayback.setState({ duration: element.duration });
    };
    const events: [string, () => void][] = [
      ['play', onPlay],
      ['pause', onPause],
      ['ended', onPause],
      ['timeupdate', sync],
      ['seeked', sync],
      ['loadedmetadata', onMetadata],
      ['durationchange', onMetadata],
    ];
    events.forEach(([name, handler]) => {
      element.addEventListener(name, handler);
    });
    return () => {
      cancelAnimationFrame(frame);
      events.forEach(([name, handler]) => {
        element.removeEventListener(name, handler);
      });
      if (video === element) video = null;
    };
  },
  play: () => {
    void video?.play();
  },
  pause: () => {
    video?.pause();
  },
  toggle: () => {
    if (video?.paused) playback.play();
    else playback.pause();
  },
  seek: (time: number) => {
    if (!video) return;
    const target = clamp(time, usePlayback.getState().duration);
    video.currentTime = target;
    usePlayback.setState({ time: target });
  },
  setRate: (rate: number) => {
    if (video) video.playbackRate = rate;
    usePlayback.setState({ rate });
  },
  setVolume: (volume: number) => {
    if (video) video.volume = volume;
    usePlayback.setState({ volume });
  },
};
