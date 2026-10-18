import { createFileRoute } from '@tanstack/react-router';

import { EditorPage } from '@/features/editor/EditorPage';
import { requireCues } from '@/lib/session/guards';

export const Route = createFileRoute('/_steps/edit')({
  beforeLoad: requireCues,
  component: EditorPage,
});
