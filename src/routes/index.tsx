import { createFileRoute } from '@tanstack/react-router';

// A página inicial ganha conteúdo em add-app-shell; aqui a rota só existe.
export const Route = createFileRoute('/')({
  component: () => null,
});
