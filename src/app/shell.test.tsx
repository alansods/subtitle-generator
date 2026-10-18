import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { mockMatchMedia } from '@/test/matchMedia';
import { renderRoute } from '@/test/renderRoute';
import { initTheme } from '@/theme/theme';

import { Stepper } from './Stepper';

describe('Requirement: Cabeçalho em todas as telas', () => {
  it('Scenario: Cabeçalho presente', async () => {
    for (const path of ['/', '/edit', '/rota-inexistente']) {
      const { unmount } = renderRoute(path);
      const header = await screen.findByRole('banner');
      expect(within(header).getByRole('link', { name: /Gerador de Legenda/ })).toBeInTheDocument();
      expect(
        within(header).getByRole('group', { name: 'Idioma da interface' }),
      ).toBeInTheDocument();
      expect(within(header).getByRole('button', { name: /tema/ })).toBeInTheDocument();
      unmount();
    }
  });

  it('Scenario: Marca leva ao início', async () => {
    const { router } = renderRoute('/edit');
    await userEvent.click(await screen.findByRole('link', { name: /Gerador de Legenda/ }));
    expect(router.state.location.pathname).toBe('/');
  });
});

describe('Requirement: Seletor de idioma no cabeçalho', () => {
  it('Scenario: Trocar idioma pelo cabeçalho', async () => {
    renderRoute('/');
    await userEvent.click(await screen.findByRole('button', { name: 'EN' }));
    expect(screen.getByRole('link', { name: /Subtitle Generator/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'PT' })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('Requirement: Botão de tema no cabeçalho', () => {
  it('Scenario: Alternar para escuro', async () => {
    mockMatchMedia(false);
    initTheme();
    renderRoute('/');
    await userEvent.click(await screen.findByRole('button', { name: 'Ativar tema escuro' }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument();
  });
});

describe('Requirement: Rodapé de privacidade', () => {
  it('Scenario: Rodapé presente', async () => {
    renderRoute('/');
    const footer = await screen.findByRole('contentinfo');
    expect(footer).toHaveTextContent('Seu vídeo não sai do seu computador e nada fica salvo.');
  });
});

describe('Requirement: Stepper das etapas', () => {
  it('Scenario: Etapa atual destacada', async () => {
    renderRoute('/edit');
    const nav = await screen.findByRole('navigation', { name: 'Etapas' });
    const items = within(nav).getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual(['1Transcrever', '2Editar', '3Exportar']);
    expect(within(nav).getByText('Editar').closest('[aria-current]')).toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  it('Scenario: Etapa indisponível', async () => {
    const rootRoute = createRootRoute({
      component: () => (
        <Stepper current="edit" available={{ transcribe: true, edit: true, export: false }} />
      ),
    });
    const router = createRouter({
      routeTree: rootRoute,
      history: createMemoryHistory({ initialEntries: ['/edit'] }),
    });
    render(<RouterProvider router={router} />);
    const exportStep = await screen.findByRole('button', { name: /Exportar/ });
    expect(exportStep).toBeDisabled();
    await userEvent.click(exportStep);
    expect(router.state.location.pathname).toBe('/edit');
  });

  it('Scenario: Navegar por uma etapa disponível', async () => {
    const { router } = renderRoute('/edit');
    await userEvent.click(await screen.findByRole('link', { name: /Transcrever/ }));
    expect(router.state.location.pathname).toBe('/transcribe');
  });
});

describe('Requirement: Página não encontrada', () => {
  it('Scenario: Rota inexistente', async () => {
    const { router } = renderRoute('/rota-inexistente');
    expect(
      await screen.findByRole('heading', { name: 'Página não encontrada' }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: 'Voltar ao início' }));
    expect(router.state.location.pathname).toBe('/');
  });
});
