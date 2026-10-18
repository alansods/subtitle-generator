import type { Meta, StoryObj } from '@storybook/react-vite';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';

import { routeTree } from '@/routeTree.gen';

// Renderiza o layout raiz real com um router em memória. Ganha conteúdo visível
// quando add-app-shell trouxer cabeçalho e stepper.
function RootLayoutStory() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });
  return <RouterProvider router={router} />;
}

const meta = {
  title: 'App/RootLayout',
  component: RootLayoutStory,
} satisfies Meta<typeof RootLayoutStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Claro: Story = { globals: { theme: 'light' } };

export const Escuro: Story = { globals: { theme: 'dark' } };
