import { createFileRoute } from '@tanstack/react-router';

import { DonePage } from '@/features/completion/DonePage';
import { requireDownload } from '@/lib/session/guards';

export const Route = createFileRoute('/done')({
  beforeLoad: requireDownload,
  component: DonePage,
});
