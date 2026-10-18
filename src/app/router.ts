import { createRouter } from '@tanstack/react-router';

import { routeTree } from '@/routeTree.gen';

export function createAppRouter() {
  return createRouter({ routeTree, scrollRestoration: true });
}

export const router = createAppRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
