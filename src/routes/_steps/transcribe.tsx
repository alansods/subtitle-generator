import { createFileRoute } from '@tanstack/react-router';

import { TranscribePage } from '@/features/transcription/TranscribePage';
import { requireVideo } from '@/lib/session/guards';

export const Route = createFileRoute('/_steps/transcribe')({
  beforeLoad: requireVideo,
  component: TranscribePage,
});
