# Tasks

## 1. Base do projeto (Vite + React + TypeScript)

- [x] 1.1 Criar `package.json` (nome `gerador-de-legenda`, `type: module`, `engines.node >=22.12`), `.nvmrc` (24), `.gitignore` e `.editorconfig`, e instalar `vite`, `@vitejs/plugin-react`, `react`, `react-dom`, `typescript@~6.0.3` e os tipos, conforme as versões do design D1. Verificar que `npm install` termina sem erros de peer dependency.
- [x] 1.2 Criar `tsconfig.json` (references), `tsconfig.app.json` (strict, `noUncheckedIndexedAccess`, alias `@/*` → `src/*`) e `tsconfig.node.json` (configs e `config/`, `tests/`), e configurar o alias no `vite.config.ts`. Verificar com `npx tsc -b` saindo com código 0.
- [x] 1.3 Criar a estrutura de pastas (`src/app`, `src/routes`, `src/features/{upload,transcription,editor,style,export,completion}`, `src/workers`, `src/lib/{subtitles,session,preferences,media}`, `src/i18n/locales`, `src/components/ui`, `src/styles`, `tests/e2e`, `tests/tooling`, `.storybook`), com `.gitkeep` nas pastas vazias. Não criar pastas de projetos ou de armazenamento persistente. Verificar com `find` que todas existem.

## 2. Roteamento e entrada da aplicação

- [x] 2.1 Instalar `@tanstack/react-router`, `@tanstack/router-plugin` e `zod`, registrar o plugin no `vite.config.ts` (`autoCodeSplitting: true`, rotas em `src/routes`) e criar `src/routes/__root.tsx` (`<div data-testid="app-root"><Outlet /></div>`) e `src/routes/index.tsx` (retorna `null`). Verificar que `src/routeTree.gen.ts` é gerado ao rodar `npx vite build`.
- [x] 2.2 Criar `src/app/router.ts` (createRouter + `declare module` `Register`), `src/main.tsx` (RouterProvider em `#root`, `StrictMode`) e `index.html` (`lang="pt-BR"`, sem texto visível além do `<title>`). Verificar com `npm run dev` que a página carrega sem erro no console.

## 3. Estilo (Tailwind v4 + shadcn/ui)

- [x] 3.1 Instalar `tailwindcss` e `@tailwindcss/vite`, registrar o plugin e criar `src/styles/globals.css` com `@import "tailwindcss"` e `@custom-variant dark (&:where(.dark, .dark *));`, importado em `main.tsx`. Verificar que uma classe utilitária aplicada em `__root.tsx` aparece no CSS gerado pelo build.
- [x] 3.2 Rodar `npx shadcn@latest init` sem interação (base `neutral`, variáveis CSS) para gerar `components.json`, os tokens claro/escuro em `globals.css` e `src/lib/utils.ts` (`cn`). Verificar que `components.json` aponta os aliases para `@/components/ui` e `@/lib/utils` e que `npx tsc -b` passa.

## 4. Headers de isolamento cross-origin

- [x] 4.1 Criar `config/cross-origin-headers.ts` com o objeto `crossOriginHeaders` e usá-lo em `server.headers` e `preview.headers` do `vite.config.ts`. Criar `public/_headers` com o bloco `/*` e os dois headers. Verificar com `curl -sI http://localhost:5173/` (dev) que os dois headers aparecem.

## 5. Lint e formatação

- [x] 5.1 Instalar `eslint@^9.39`, `@eslint/js@^9.39`, `typescript-eslint`, `globals`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-jsx-a11y`, `eslint-plugin-storybook` e `eslint-config-prettier`, e criar `eslint.config.js` conforme o design D7 (ignorando `src/routeTree.gen.ts`, `src/components/ui`, `dist`, `storybook-static`, `playwright-report` e `test-results`). Verificar com `npx eslint .` saindo com código 0.
- [x] 5.2 Instalar `prettier` e `prettier-plugin-tailwindcss`, criar `.prettierrc` e `.prettierignore` (incluindo `src/routeTree.gen.ts`, `openspec/`, `dist` e lockfile) e formatar o repositório. Verificar com `npx prettier --check .` saindo com código 0.
- [x] 5.3 Adicionar ao `package.json` os scripts `dev`, `build` (`tsc -b && vite build`), `preview`, `typecheck` (`tsc -b`), `lint`, `format` e `format:check`. Verificar rodando cada um.

## 6. Testes unitários e de componentes (Vitest + RTL)

- [x] 6.1 Instalar `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` e `@testing-library/user-event`, criar `vitest.config.ts` com os projetos `unit` (jsdom, `src/**/*.test.{ts,tsx}`, setup `src/test/setup.ts`) e `tooling` (node, `tests/tooling/**/*.test.ts`, timeout 120 s), e os scripts `test` (`vitest run --project unit`), `test:watch` e `test:tooling`. Verificar com `npm test` reconhecendo a configuração.
- [x] 6.2 Escrever `src/routes/__root.test.tsx` (RTL): renderiza o router em memória e confirma que `app-root` está no documento. Verificar com `npm test` passando.

## 7. Testes de tooling (cenários de infraestrutura)

- [x] 7.1 Escrever `tests/tooling/headers.test.ts` com "Scenario: Configuração de hospedagem declara os headers": faz o parse de `public/_headers` e compara com `crossOriginHeaders` para `/*`. Verificar com `npm run test:tooling` passando.
- [x] 7.2 Escrever `tests/tooling/typecheck.test.ts` com "Scenario: Verificação de tipos passa" (`tsc -b` sai com 0) e "Scenario: Erro de tipo é detectado" (fixture `tests/tooling/fixtures/type-error/` com tsconfig que estende `tsconfig.app.json` e um arquivo com atribuição incompatível, sai com ≠ 0). Excluir a fixture do typecheck, lint e Prettier principais. Verificar com `npm run test:tooling` passando.
- [x] 7.3 Escrever `tests/tooling/lint.test.ts` com "Scenario: Lint passa" (`eslint .` sai com 0) e "Scenario: Formatação conferida" (`prettier --check .` sai com 0). Verificar com `npm run test:tooling` passando.
- [x] 7.4 Adicionar o script `check` (`npm run typecheck && npm run lint && npm run format:check && npm test`) e escrever `tests/tooling/scripts.test.ts` com "Scenario: Testes unitários e de componentes" (`vitest run --project unit` sai com 0) e "Scenario: Qualidade agregada falha com qualquer etapa" (`scripts.check` encadeia as quatro etapas só com `&&`). Verificar com `npm run test:tooling` e `npm run check` passando.
- [x] 7.5 Escrever `tests/tooling/build.test.ts` com "Scenario: Build gera artefatos estáticos": roda `vite build --outDir` num diretório temporário e confere `index.html` e `_headers`. Verificar com `npm run test:tooling` passando.

## 8. Testes end-to-end (Playwright)

- [x] 8.1 Instalar `@playwright/test`, rodar `npx playwright install chromium` e criar `playwright.config.ts` com os projetos `dev` (porta 5173) e `preview` (build + preview na porta 4173), cada um com seu `webServer`, e o script `test:e2e`. Verificar com `npx playwright test --list` mostrando os dois projetos.
- [x] 8.2 Escrever `tests/e2e/cross-origin.spec.ts` com "Scenario: Servidor de desenvolvimento isolado" e "Scenario: Build de produção isolado" (headers da resposta do documento + `window.crossOriginIsolated === true`, rodando nos projetos correspondentes). Verificar com `npm run test:e2e` passando.
- [x] 8.3 Escrever `tests/e2e/app-loads.spec.ts` com "Scenario: Carga inicial limpa": `app-root` visível e nenhum `console.error` nem `pageerror` coletado. Verificar com `npm run test:e2e` passando nos dois projetos.

## 9. Storybook

- [x] 9.1 Instalar `storybook`, `@storybook/react-vite` e `@storybook/addon-themes`, criar `.storybook/main.ts` (stories em `src/**/*.stories.tsx`) e `.storybook/preview.ts` (importa `globals.css` e aplica `withThemeByClassName` com `light`/`dark` no `<html>`), e os scripts `storybook` e `build-storybook`. Verificar com `npm run build-storybook` saindo com código 0.
- [x] 9.2 Criar uma story mínima (`src/app/RootLayout.stories.tsx`) que renderiza o layout raiz nos dois temas, sem texto de UI. Verificar que ela aparece no `storybook-static/index.json` gerado ("Scenario: Catálogo compila").

- [x] 9.3 Escrever `tests/tooling/storybook.test.ts` com "Scenario: Catálogo compila" (build do catálogo num diretório temporário sai com 0) e "Scenario: Catálogo exibe os dois temas" (`index.json` tem as stories `Claro` e `Escuro` do layout raiz). Verificar com `npm run test:tooling` passando.

## 10. Integração contínua

- [x] 10.1 Criar `.github/workflows/ci.yml` conforme o design D9 (gatilhos `push` e `pull_request`; Node 24; `npm ci`, `check`, `test:tooling`, `build`, `build-storybook`, instalação do Chromium, `test:e2e`; upload do relatório do Playwright em falha).
- [x] 10.2 Instalar `yaml` como dependência de desenvolvimento e escrever `tests/tooling/ci.test.ts` com "Scenario: Pipeline executa as verificações": confere os gatilhos e a presença dos comandos `npm run check`, `npm run build` e `npm run test:e2e`. Verificar com `npm run test:tooling` passando.

## 11. Verificação final

- [x] 11.1 Rodar `openspec validate setup-project --strict` e corrigir até passar.
- [x] 11.2 Rodar em sequência numa instalação limpa (`rm -rf node_modules && npm ci`): `npm run check`, `npm run test:tooling`, `npm run build`, `npm run build-storybook` e `npm run test:e2e`. Todos devem sair com código 0 ("Scenario: Qualidade agregada passa", "Scenario: Testes end-to-end", "Scenario: Catálogo compila").
- [x] 11.3 Confirmar que não há texto de UI visível (`grep` por literais JSX em `src/` sem chave de tradução retorna vazio, exceto `<title>` no `index.html`) e que `README.md` descreve os comandos e o fluxo OpenSpec.
- [x] 11.4 Fazer o commit inicial com a mudança implementada.

## Workflow follow-up

- Rodar `/opsx:verify` e resolver divergências entre spec e código.
- Arquivar com `/opsx:archive` e confirmar que `openspec/specs/project-tooling/spec.md` foi criado com o Purpose desta mudança.
