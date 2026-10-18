import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderRoute } from '@/test/renderRoute';
import { seedSession } from '@/test/session';

import { useSession } from './store';

async function goHomeFromEditor() {
  const { router } = renderRoute('/edit');
  await userEvent.click(await screen.findByRole('link', { name: /Gerador de Legenda/ }));
  return router;
}

function fireBeforeUnload() {
  const event = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(event);
  return event;
}

describe('Requirement: Guardas de rota', () => {
  it('Scenario: Transcrever sem vídeo', async () => {
    seedSession({ video: false });
    const { router } = renderRoute('/transcribe');
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });
  });

  it('Scenario: Editar sem vídeo', async () => {
    seedSession({ video: false });
    const { router } = renderRoute('/edit');
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });
  });

  it('Scenario: Exportar sem cues', async () => {
    seedSession({ video: true, cues: false });
    const { router } = renderRoute('/export');
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/transcribe');
    });
  });
});

describe('Requirement: Descartar com confirmação', () => {
  it('Scenario: Confirmar descarte', async () => {
    seedSession({ cues: true });
    const router = await goHomeFromEditor();
    await userEvent.click(await screen.findByRole('button', { name: 'Descartar e começar outra' }));
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });
    expect(useSession.getState().video).toBeNull();
    expect(useSession.getState().cues).toEqual([]);
  });

  it('Scenario: Cancelar descarte', async () => {
    seedSession({ cues: true });
    const router = await goHomeFromEditor();
    await userEvent.click(await screen.findByRole('button', { name: 'Continuar editando' }));
    expect(router.state.location.pathname).toBe('/edit');
    expect(useSession.getState().cues).toHaveLength(2);
  });

  it('Scenario: Legenda já baixada', async () => {
    seedSession({ cues: true, downloaded: true });
    const router = await goHomeFromEditor();
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(useSession.getState().video).toBeNull();
  });

  it('Scenario: Edição depois do download', async () => {
    seedSession({ cues: true, downloaded: true });
    useSession.getState().updateCue('c1', { text: 'Texto corrigido' });
    await goHomeFromEditor();
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
  });
});

describe('Requirement: Aviso ao fechar a aba', () => {
  it('Scenario: Fechar com legenda não baixada', async () => {
    seedSession({ cues: true });
    renderRoute('/edit');
    await screen.findByRole('heading', { name: 'Editar legenda' });
    expect(fireBeforeUnload().defaultPrevented).toBe(true);
  });

  it('Scenario: Fechar sem nada a perder', async () => {
    seedSession({ cues: false });
    renderRoute('/transcribe');
    await screen.findByRole('heading', { name: 'Gerar legenda' });
    expect(fireBeforeUnload().defaultPrevented).toBe(false);
  });
});
