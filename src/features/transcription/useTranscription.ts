import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { extractAudio } from '@/lib/media/audio';
import { detectDevice, type InferenceDevice } from '@/lib/media/capabilities';
import { useSession } from '@/lib/session/store';
import { segmentWords } from '@/lib/subtitles/segmentation';

import { chooseModel } from './models';
import type { ProgressEvent, SpokenLanguage } from './protocol';
import { createTranscriber, TranscriptionCancelled, type Transcriber } from './transcriber';

export const STAGES = ['prepare', 'extract', 'transcribe', 'segment'] as const;
export type Stage = (typeof STAGES)[number];

export type TranscriptionState =
  | { status: 'idle' }
  | { status: 'running'; stage: Stage; ratio: number }
  | { status: 'error'; reason: 'failed' | 'no-speech' };

// Faixa de cada etapa na barra geral.
const WEIGHTS: Record<Stage, [number, number]> = {
  prepare: [0, 0.2],
  extract: [0.2, 0.3],
  transcribe: [0.3, 0.95],
  segment: [0.95, 1],
};

export function overallProgress(stage: Stage, ratio: number): number {
  const [from, to] = WEIGHTS[stage];
  return from + (to - from) * Math.min(1, Math.max(0, ratio));
}

export function useDevice() {
  const [device, setDevice] = useState<InferenceDevice | null>(null);
  useEffect(() => {
    let active = true;
    void detectDevice().then((detected) => {
      if (active) setDevice(detected);
    });
    return () => {
      active = false;
    };
  }, []);
  return device;
}

export function useTranscription() {
  const [state, setState] = useState<TranscriptionState>({ status: 'idle' });
  const transcriberRef = useRef<Transcriber | null>(null);
  // Lido pelo bloqueio de saída no momento da navegação (o estado do React pode estar
  // um render atrasado quando a transcrição termina e já navega para o editor).
  const runningRef = useRef(false);
  const navigate = useNavigate();

  const onProgress = useCallback((event: ProgressEvent) => {
    setState((current) =>
      current.status === 'running' && current.stage === event.stage
        ? { ...current, ratio: event.ratio }
        : current,
    );
  }, []);

  const start = useCallback(
    async (language: SpokenLanguage) => {
      const session = useSession.getState();
      if (!session.video) return;
      const device = await detectDevice();
      const model = chooseModel(device);
      const transcriber = createTranscriber();
      transcriberRef.current = transcriber;
      runningRef.current = true;
      try {
        setState({ status: 'running', stage: 'prepare', ratio: 0 });
        await transcriber.prepare({ model, device }, onProgress);

        setState({ status: 'running', stage: 'extract', ratio: 0 });
        const audio = await extractAudio(session.video.file);

        setState({ status: 'running', stage: 'transcribe', ratio: 0 });
        const words = await transcriber.transcribe(audio, { model, device, language }, onProgress);

        setState({ status: 'running', stage: 'segment', ratio: 0 });
        const cues = segmentWords(words);
        if (cues.length === 0) {
          runningRef.current = false;
          setState({ status: 'error', reason: 'no-speech' });
          return;
        }
        useSession.getState().setCues(cues);
        useSession.getState().setTranscription({ model, language });
        transcriberRef.current = null;
        runningRef.current = false;
        setState({ status: 'idle' });
        await navigate({ to: '/edit' });
      } catch (error) {
        if (error instanceof TranscriptionCancelled) return;
        console.error(error);
        setState({ status: 'error', reason: 'failed' });
      } finally {
        transcriberRef.current = null;
        runningRef.current = false;
      }
    },
    [navigate, onProgress],
  );

  const cancel = useCallback(() => {
    runningRef.current = false;
    transcriberRef.current?.cancel();
    transcriberRef.current = null;
    setState({ status: 'idle' });
  }, []);

  // Sair da tela (já confirmado) encerra o processamento.
  useEffect(
    () => () => {
      transcriberRef.current?.cancel();
    },
    [],
  );

  const isRunning = useCallback(() => runningRef.current, []);

  return { state, start, cancel, isRunning };
}
