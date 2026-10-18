import { redirect } from '@tanstack/react-router';

import { hasCues, hasVideo } from './selectors';
import { useSession } from './store';

export function requireVideo() {
  if (!hasVideo(useSession.getState())) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- padrão do TanStack Router
    throw redirect({ to: '/', replace: true });
  }
}

export function requireCues() {
  requireVideo();
  if (!hasCues(useSession.getState())) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- padrão do TanStack Router
    throw redirect({ to: '/transcribe', replace: true });
  }
}
