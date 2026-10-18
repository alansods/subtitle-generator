# Tasks

## 1. Remoção

- [x] 1.1 Desinstalar `storybook`, `@storybook/react-vite`, `@storybook/addon-themes` e `eslint-plugin-storybook`; apagar `.storybook/`, `src/app/RootLayout.stories.tsx` e `tests/tooling/storybook.test.ts`. Verificar com `npm ls storybook` vazio.
- [x] 1.2 Remover scripts `storybook`/`build-storybook`, a entrada do Storybook no `eslint.config.js`, o include `.storybook` do `tsconfig.app.json`, `storybook-static` de `.gitignore`/`.prettierignore`/ESLint, o passo do CI e as linhas do README; tirar Storybook da stack em `openspec/config.yaml`. Verificar com `grep -ri storybook` sem ocorrências fora do histórico do OpenSpec.

## 2. Verificação

- [x] 2.1 `openspec validate remove-storybook --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando.
