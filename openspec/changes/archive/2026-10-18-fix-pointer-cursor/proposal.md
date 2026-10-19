# Proposal

## Why

O Tailwind v4 deixou de pôr `cursor: pointer` nos botões. Em várias telas, passar o mouse sobre um botão mostra a seta padrão, e nada indica que o elemento é clicável.

## What Changes

- Regra global na camada base: botões, `[role="button"]`, `select`, checkboxes e controles deslizantes habilitados usam o cursor de mão; desabilitados não.

### Fora do escopo

- Mudanças de aparência além do cursor.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `app-shell`: novo requisito "Cursor de elemento clicável".

## Impact

- `src/styles/globals.css`, `tests/e2e/app-shell.spec.ts`.
