import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { routeTree } from '@/routeTree.gen';

describe('Requirement: Aplicação inicializa sem erros', () => {
  it('Scenario: Carga inicial limpa: a rota raiz monta o app-root', async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ['/'] }),
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId('app-root')).toBeInTheDocument();
  });
});
