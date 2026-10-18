import { createFileRoute } from '@tanstack/react-router';

import { ExportPage } from '@/features/export/ExportPage';
import { requireCues } from '@/lib/session/guards';

export const Route = createFileRoute('/_steps/export')({
  beforeLoad: requireCues,
  component: ExportPage,
});
