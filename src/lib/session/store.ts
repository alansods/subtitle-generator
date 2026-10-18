import { create } from 'zustand';

import type { Cue } from '@/lib/subtitles/types';

// Sessão de trabalho: um vídeo por vez, só em memória. Nada daqui vai para
// localStorage, IndexedDB ou OPFS (decisão de produto: nada fica salvo).

export interface SessionVideo {
  file: File;
  url: string;
  name: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  durationSec: number;
  width: number;
  height: number;
}

export interface SessionDownload {
  kind: 'subtitle' | 'video';
  fileName: string;
}

export interface SessionState {
  video: SessionVideo | null;
  cues: Cue[];
  downloaded: SessionDownload | null;
}

export interface SessionActions {
  setVideo: (video: SessionVideo) => void;
  setCues: (cues: Cue[]) => void;
  updateCue: (id: string, patch: Partial<Omit<Cue, 'id'>>) => void;
  markDownloaded: (download: SessionDownload) => void;
  reset: () => void;
}

const EMPTY: SessionState = { video: null, cues: [], downloaded: null };

function revoke(video: SessionVideo | null) {
  if (video) URL.revokeObjectURL(video.url);
}

export const useSession = create<SessionState & SessionActions>()((set, get) => ({
  ...EMPTY,
  setVideo: (video) => {
    revoke(get().video);
    set({ ...EMPTY, video });
  },
  // Editar torna o download desatualizado: voltar a ter trabalho a perder.
  setCues: (cues) => {
    set({ cues, downloaded: null });
  },
  updateCue: (id, patch) => {
    set({
      cues: get().cues.map((cue) => (cue.id === id ? { ...cue, ...patch } : cue)),
      downloaded: null,
    });
  },
  markDownloaded: (downloaded) => {
    set({ downloaded });
  },
  reset: () => {
    revoke(get().video);
    set(EMPTY);
  },
}));
