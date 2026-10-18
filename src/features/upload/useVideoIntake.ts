import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

import { useSession } from '@/lib/session/store';

import { probeVideo } from './probe';
import { baseName, mimeTypeOf, validateVideoFile } from './validate';

export type IntakeState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'warn-large'; file: File }
  | { status: 'error'; reason: 'format' | 'too-large' | 'unplayable'; file: File };

// Validar → ler metadados → colocar na sessão → ir para a transcrição.
export function useVideoIntake() {
  const [state, setState] = useState<IntakeState>({ status: 'idle' });
  const setVideo = useSession((s) => s.setVideo);
  const navigate = useNavigate();

  const accept = useCallback(
    async (file: File) => {
      setState({ status: 'checking' });
      const mimeType = mimeTypeOf(file);
      const url = URL.createObjectURL(file);
      try {
        const metadata = await probeVideo(url, mimeType);
        setVideo({
          file,
          url,
          name: baseName(file.name),
          fileName: file.name,
          mimeType,
          sizeBytes: file.size,
          ...metadata,
        });
        await navigate({ to: '/transcribe' });
      } catch {
        URL.revokeObjectURL(url);
        setState({ status: 'error', reason: 'unplayable', file });
      }
    },
    [navigate, setVideo],
  );

  const submit = useCallback(
    (file: File) => {
      const check = validateVideoFile(file);
      if (check.status === 'error') {
        setState({ status: 'error', reason: check.reason, file });
        return;
      }
      if (check.status === 'warn-large') {
        setState({ status: 'warn-large', file });
        return;
      }
      void accept(file);
    },
    [accept],
  );

  const confirmLarge = useCallback(() => {
    if (state.status === 'warn-large') void accept(state.file);
  }, [accept, state]);

  return { state, submit, confirmLarge };
}
