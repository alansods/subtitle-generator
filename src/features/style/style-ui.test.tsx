import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { useSession } from '@/lib/session/store';
import { mockMatchMedia } from '@/test/matchMedia';
import { renderRoute } from '@/test/renderRoute';
import { seedSession } from '@/test/session';
import { initTheme, setThemeMode } from '@/theme/theme';

async function openEditorAtCue() {
  seedSession({ cues: true });
  const result = renderRoute('/edit');
  await screen.findByRole('heading', { name: 'Editar legenda' });
  const video = result.container.querySelector('video');
  act(() => {
    if (video) video.currentTime = 1;
  });
  const subtitle = () => screen.getByRole('button', { name: /^Editar legenda:/ });
  return { subtitle };
}

describe('Requirement: Painel de estilo no editor', () => {
  it('Scenario: Escolher fundo branco', async () => {
    const { subtitle } = await openEditorAtCue();
    expect(subtitle()).toHaveStyle({ background: '#000', color: '#fff' });
    await userEvent.click(screen.getByRole('radio', { name: 'Branco' }));
    expect(useSession.getState().style.background).toBe('white');
    expect(subtitle()).toHaveStyle({ background: '#fff', color: '#000' });
  });

  it('Scenario: Legenda em cima', async () => {
    const { subtitle } = await openEditorAtCue();
    await userEvent.click(screen.getByRole('radio', { name: 'Superior' }));
    const wrapper = subtitle().parentElement;
    expect(wrapper?.style.top).toBe('6cqh');
    expect(wrapper?.style.bottom).toBe('');
  });

  it('tamanho G aplica 6,5% da altura', async () => {
    const { subtitle } = await openEditorAtCue();
    await userEvent.click(screen.getByRole('radio', { name: 'G' }));
    expect(subtitle().style.fontSize).toBe('6.5cqh');
  });
});

describe('Requirement: Independente do tema da interface', () => {
  it('Scenario: Tema escuro', async () => {
    mockMatchMedia(false);
    initTheme();
    act(() => {
      setThemeMode('dark');
    });
    const { subtitle } = await openEditorAtCue();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(subtitle()).toHaveStyle({ background: '#000', color: '#fff' });
  });
});
