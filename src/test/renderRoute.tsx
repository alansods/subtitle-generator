import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
  type AnyRouter,
} from '@tanstack/react-router';
import { render, waitFor } from '@testing-library/react';

import { routeTree } from '@/routeTree.gen';

const routers = new Set<AnyRouter>();

// Renderiza o app inteiro (árvore real de rotas) a partir de uma URL, em memória.
export function renderRoute(path: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  routers.add(router);
  const result = render(<RouterProvider router={router} />);
  return { router, ...result };
}

// Espera as navegações em andamento terminarem antes de desmontar: uma transição que
// termina depois do teste atualiza o React quando o jsdom já foi desligado
// ("window is not defined" no CI).
export async function settleRouters() {
  for (const router of routers) {
    await waitFor(() => {
      if (router.state.status !== 'idle' || router.state.isLoading) throw new Error('carregando');
    });
  }
  await new Promise((resolve) => setTimeout(resolve, 0));
  routers.clear();
}
