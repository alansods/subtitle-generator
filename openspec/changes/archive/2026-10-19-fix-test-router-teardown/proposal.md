# Proposal

## Why

O CI falhou de forma intermitente com "window is not defined": uma navegação do TanStack Router ainda em andamento no fim de um teste atualizava o React depois que o jsdom já tinha sido desligado.

## What Changes

- `renderRoute` registra os routers criados e `settleRouters()` espera cada um ficar ocioso; o `afterEach` do setup chama `settleRouters()` antes do `cleanup()`.

### Fora do escopo

- Qualquer mudança de comportamento do app (sem delta de spec).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

Nenhuma.

## Impact

- `src/test/renderRoute.tsx`, `src/test/setup.ts`.
