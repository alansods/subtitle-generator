import { useSession, type SessionVideo } from '@/lib/session/store';
import type { Cue } from '@/lib/subtitles/types';

export function fakeVideo(overrides: Partial<SessionVideo> = {}): SessionVideo {
  const file = new File(['video'], 'reuniao.mp4', { type: 'video/mp4' });
  return {
    file,
    url: 'blob:fake-video',
    name: 'reuniao',
    fileName: 'reuniao.mp4',
    mimeType: 'video/mp4',
    sizeBytes: file.size,
    durationSec: 40,
    width: 1280,
    height: 720,
    ...overrides,
  };
}

export function fakeCues(): Cue[] {
  return [
    { id: 'c1', start: 0.4, end: 4.2, text: 'Olá! Neste vídeo vou mostrar' },
    { id: 'c2', start: 4.4, end: 7, text: 'como gerar legendas no navegador.' },
  ];
}

// Coloca a sessão num estado conhecido para o teste.
export function seedSession({ video = true, cues = false, downloaded = false } = {}) {
  const state = useSession.getState();
  state.reset();
  if (video) state.setVideo(fakeVideo());
  if (cues) state.setCues(fakeCues());
  if (downloaded) state.markDownloaded({ kind: 'subtitle', fileName: 'reuniao.srt' });
}
