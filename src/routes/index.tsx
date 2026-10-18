import { createFileRoute } from '@tanstack/react-router';

import { HomePage } from '@/features/upload/HomePage';
import { useSession } from '@/lib/session/store';

// Chegar ao início é começar de novo: a sessão anterior é descartada. A confirmação
// (quando há legenda não baixada) acontece antes, no DiscardGuard.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    useSession.getState().reset();
  },
  component: HomePage,
});
