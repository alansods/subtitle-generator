import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { mockMatchMedia } from '@/test/matchMedia';
import { renderRoute } from '@/test/renderRoute';
import { seedSession } from '@/test/session';
import { initTheme } from '@/theme/theme';

import { Stepper } from './Stepper';

describe('Requirement: Cabeçalho em todas as telas', () => {
  it('Scenario: Cabeçalho presente', async () => {
    seedSession({ cues: true, downloaded: true });
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
    seedSession({ cues: true, downloaded: true });
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
    seedSession({ cues: true });
    renderRoute('/edit');
    const nav = await screen.findByRole('navigation', { name: 'Etapas' });
    const items = within(nav).getAllByRole('listitem');
    expect(items.map((item) => item.textContent)).toEqual([
      'concluídaGerar legenda',
      '2Revisar',
      '3Baixar',
    ]);
    expect(within(nav).getByText('Revisar').closest('[aria-current]')).toHaveAttribute(
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
    const exportStep = await screen.findByRole('button', { name: /Baixar/ });
    expect(exportStep).toBeDisabled();
    await userEvent.click(exportStep);
    expect(router.state.location.pathname).toBe('/edit');
  });

  it('Scenario: Navegar por uma etapa disponível', async () => {
    seedSession({ cues: true });
    const { router } = renderRoute('/edit');
    await userEvent.click(await screen.findByRole('link', { name: /Gerar legenda/ }));
    expect(router.state.location.pathname).toBe('/transcribe');
  });
});

describe('Requirement: Voltar e Avançar', () => {
  const stepNav = () => screen.findByRole('navigation', { name: 'Navegação entre etapas' });

  it('Scenario: Avançar da revisão', async () => {
    seedSession({ cues: true });
    const { router } = renderRoute('/edit');
    await userEvent.click(within(await stepNav()).getByRole('link', { name: 'Avançar' }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/export');
    });
  });

  it('Scenario: Voltar da exportação', async () => {
    seedSession({ cues: true });
    const { router } = renderRoute('/export');
    const nav = await stepNav();
    expect(within(nav).queryByRole('link', { name: 'Avançar' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('button', { name: 'Avançar' })).not.toBeInTheDocument();
    await userEvent.click(within(nav).getByRole('link', { name: 'Voltar' }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/edit');
    });
  });

  it('Scenario: Avançar sem legenda', async () => {
    seedSession();
    renderRoute('/transcribe');
    const nav = await stepNav();
    expect(within(nav).queryByRole('link', { name: 'Voltar' })).not.toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'Avançar' })).toBeDisabled();
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
