import { describe, expect, it, vi } from 'vitest';

import { fakeCues, fakeVideo, seedSession } from '@/test/session';

import { stepAvailability } from './selectors';
import { useSession } from './store';

describe('Requirement: Sessão única em memória', () => {
  it('Scenario: Sessão começa vazia', async () => {
    vi.resetModules();
    const { useSession: freshSession } = await import('./store');
    const { video, cues, downloaded, transcription, style } = freshSession.getState();
    expect({ video, cues, downloaded, transcription, style }).toEqual({
      video: null,
      cues: [],
      downloaded: null,
      transcription: null,
      style: { background: 'black', fontSize: 'md', position: 'bottom' },
    });
  });

  it('Scenario: Nada é persistido', () => {
    const openSpy = vi.fn();
    vi.stubGlobal('indexedDB', { open: openSpy });
    window.localStorage.setItem('gdl:locale', 'pt-BR');
    seedSession({ cues: true });
    expect(Object.keys(window.localStorage)).toEqual(['gdl:locale']);
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('Scenario: Novo vídeo substitui o anterior', () => {
    seedSession({ cues: true, downloaded: true });
    useSession.getState().setVideo(fakeVideo({ name: 'outro', fileName: 'outro.webm' }));
    const state = useSession.getState();
    expect(state.video?.name).toBe('outro');
    expect(state.cues).toEqual([]);
    expect(state.downloaded).toBeNull();
  });
});

describe('Requirement: Disponibilidade das etapas', () => {
  it('Scenario: Só com vídeo', () => {
    seedSession();
    expect(stepAvailability(useSession.getState())).toEqual({
      transcribe: true,
      edit: false,
      export: false,
    });
  });

  it('Scenario: Com cues', () => {
    seedSession();
    useSession.getState().setCues(fakeCues());
    expect(stepAvailability(useSession.getState())).toEqual({
      transcribe: true,
      edit: true,
      export: true,
    });
  });
});

describe('Requirement: Opções de estilo', () => {
  it('Scenario: Estilo padrão', () => {
    seedSession();
    expect(useSession.getState().style).toEqual({
      background: 'black',
      fontSize: 'md',
      position: 'bottom',
    });
  });

  it('Scenario: Novo vídeo volta ao padrão', () => {
    seedSession();
    useSession.getState().setStyle({ background: 'white' });
    expect(useSession.getState().style.background).toBe('white');
    useSession.getState().setVideo(fakeVideo({ name: 'outro' }));
    expect(useSession.getState().style).toEqual({
      background: 'black',
      fontSize: 'md',
      position: 'bottom',
    });
  });
});
