import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { render } from '@testing-library/react';

import { routeTree } from '@/routeTree.gen';

// Renderiza o app inteiro (árvore real de rotas) a partir de uma URL, em memória.
export function renderRoute(path: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  const result = render(<RouterProvider router={router} />);
  return { router, ...result };
}
