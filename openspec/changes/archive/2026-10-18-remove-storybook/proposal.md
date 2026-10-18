# Proposal

## Why

O Storybook veio do briefing original, mas para esta ferramenta interna o ganho é pequeno: o usuário final nunca o vê, a revisão visual já acontece no protótipo navegável e o comportamento é garantido por testes de componente e e2e. Ele custa mais de 50 dependências, um passo a mais no CI e stories para manter a cada mudança. Decisão do usuário: remover.

## What Changes

- Remover as dependências `storybook`, `@storybook/react-vite`, `@storybook/addon-themes` e `eslint-plugin-storybook`.
- Remover `.storybook/`, `src/app/RootLayout.stories.tsx`, `tests/tooling/storybook.test.ts`, os scripts `storybook`/`build-storybook`, o passo do CI e as referências em configs e README.
- **BREAKING (tooling):** o requisito "Catálogo de componentes" sai da spec `project-tooling`.
- O contexto do OpenSpec deixa de listar Storybook na stack.

### Fora do escopo

- Qualquer mudança em comportamento do app.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `project-tooling`: remove o requisito "Catálogo de componentes".

## Impact

- `package.json`, `eslint.config.js`, `tsconfig.app.json`, `.gitignore`, `.prettierignore`, `.github/workflows/ci.yml`, `README.md`, `openspec/config.yaml`.
