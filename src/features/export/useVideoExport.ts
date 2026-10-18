import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createVideoExporter,
  VideoExportCancelled,
  type BurnInInput,
  type VideoExporter,
} from '@/lib/media/videoExport';

export type VideoExportState =
  | { status: 'idle' }
  | { status: 'running'; stage: 'prepare' }
  | { status: 'running'; stage: 'encode'; ratio: number; remainingSec: number | null }
  | { status: 'error' };

// Estimativa só depois de um pouco de andamento, para não mostrar números absurdos.
const MIN_RATIO_FOR_ESTIMATE = 0.03;

export function remainingSeconds(ratio: number, elapsedMs: number): number | null {
  if (ratio < MIN_RATIO_FOR_ESTIMATE || ratio >= 1) return null;
  return Math.max(1, Math.round(((elapsedMs / ratio) * (1 - ratio)) / 1000));
}

export function useVideoExport() {
  const [state, setState] = useState<VideoExportState>({ status: 'idle' });
  const exporterRef = useRef<VideoExporter | null>(null);
  const runningRef = useRef(false);

  const start = useCallback(async (input: BurnInInput): Promise<Blob | null> => {
    const exporter = createVideoExporter();
    exporterRef.current = exporter;
    runningRef.current = true;
    setState({ status: 'running', stage: 'prepare' });
    let encodeStart = 0;
    try {
      const blob = await exporter.run(input, (progress) => {
        if (exporterRef.current !== exporter) return;
        if (progress.stage === 'prepare') {
          setState({ status: 'running', stage: 'prepare' });
          return;
        }
        encodeStart ||= performance.now();
        setState({
          status: 'running',
          stage: 'encode',
          ratio: progress.ratio,
          remainingSec: remainingSeconds(progress.ratio, performance.now() - encodeStart),
        });
      });
      if (exporterRef.current !== exporter) return null;
      runningRef.current = false;
      exporterRef.current = null;
      setState({ status: 'idle' });
      return blob;
    } catch (error) {
      if (exporterRef.current !== exporter) return null;
      runningRef.current = false;
      exporterRef.current = null;
      setState(error instanceof VideoExportCancelled ? { status: 'idle' } : { status: 'error' });
      return null;
    }
  }, []);

  const cancel = useCallback(() => {
    const exporter = exporterRef.current;
    runningRef.current = false;
    exporterRef.current = null;
    exporter?.cancel();
    setState({ status: 'idle' });
  }, []);

  // Sair da tela (já confirmado) interrompe a geração.
  useEffect(
    () => () => {
      exporterRef.current?.cancel();
      exporterRef.current = null;
    },
    [],
  );

  const isRunning = useCallback(() => runningRef.current, []);

  return { state, start, cancel, isRunning };
}
