# Proposal

## Why

O repositório ainda não tem nenhum código, build ou ferramenta de qualidade. Todas as mudanças seguintes (`add-app-shell`, `add-i18n` etc.) precisam de uma base comum: o build com Vite e React, o roteamento tipado, o Tailwind com shadcn/ui, os testes e o isolamento cross-origin. Sem o isolamento, o ffmpeg multi-thread não roda. Fazer isso numa mudança própria evita que cada feature resolva infraestrutura por conta própria e garante que as regras do processo (tipagem estrita, lint e cenários com teste) valham desde o primeiro commit.

## What Changes

- Projeto Vite + React + TypeScript (strict), com o alias `@/` apontando para `src/`.
- Estrutura de pastas da seção 16 do briefing, ajustada às decisões de produto (sem biblioteca de projetos e sem persistência): `src/app`, `src/routes`, `src/features/{upload,transcription,editor,style,export,completion}`, `src/workers`, `src/lib/{subtitles,session,preferences,media}`, `src/i18n/locales`, `src/components/ui`, `src/styles`, `tests/e2e`, `.storybook`. Pastas ainda sem conteúdo ficam com `.gitkeep`.
- TanStack Router com roteamento baseado em arquivos e geração da árvore de rotas pelo plugin do Vite. Nesta mudança existe só uma rota raiz mínima, sem texto de UI.
- Tailwind CSS v4 + shadcn/ui inicializado (`components.json`, tokens CSS claro/escuro, utilitário `cn`), com dark mode por classe `dark`. Nenhum componente shadcn é adicionado ainda.
- Os headers `Cross-Origin-Opener-Policy: same-origin` e `Cross-Origin-Embedder-Policy: credentialless` são aplicados no `vite dev`, no `vite preview` e em `public/_headers` (Cloudflare Pages).
- ESLint (flat config, typescript-eslint, react-hooks, jsx-a11y) + Prettier.
- Vitest (jsdom) + React Testing Library, Playwright (Chromium) e Storybook (React + Vite).
- Scripts npm: `dev`, `build`, `preview`, `typecheck`, `lint`, `format`, `format:check`, `test`, `test:e2e`, `storybook`, `build-storybook` e `check` (agrega typecheck, lint, format:check e test).
- Workflow de CI no GitHub Actions rodando `npm run check`, `npm run build` e `npm run test:e2e`.

### Fora do escopo

- Layout, cabeçalho, stepper e 404 (`add-app-shell`).
- i18n, tema e qualquer texto visível de UI (`add-i18n`, `add-theming`).
- Instalação das dependências de domínio (Zustand, zundo, Transformers.js, ffmpeg.wasm, wavesurfer.js, Comlink, i18next). Cada uma entra na mudança que a usa. Dexie e OPFS não fazem mais parte do projeto.
- Fontes da identidade visual (Plus Jakarta Sans, IBM Plex Mono) e os tokens de cor (`add-theming`), e o arquivo `Inter-Regular.ttf` da legenda (`add-subtitle-style`). Aqui o shadcn é inicializado com os tokens padrão, que serão substituídos.
- Deploy real no Cloudflare Pages (`deploy-cloudflare-pages`). Aqui só o arquivo `_headers` é criado.

## Capabilities

### New Capabilities

- `project-tooling`: garantias de infraestrutura do projeto, como isolamento cross-origin em dev, preview e produção, a aplicação que monta sem erros e os comandos de qualidade (typecheck, lint, formatação, testes, build, Storybook) que precisam passar antes de arquivar qualquer mudança.

### Modified Capabilities

Nenhuma (não há specs existentes).

## Impact

- **Código novo:** a raiz inteira do projeto (`package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `.prettierrc`, `vitest` e `playwright` configs, `.storybook/`, `index.html`, `src/` mínimo, `public/_headers`, `.github/workflows/ci.yml`).
- **Dependências:** react, react-dom, @tanstack/react-router, @tanstack/router-plugin, zod, tailwindcss, @tailwindcss/vite, clsx, tailwind-merge, class-variance-authority, além das dependências de desenvolvimento de lint, testes e Storybook.
- **Ambiente:** Node ≥ 22.12 (exigência do Vite 8).
- **Sistemas externos:** nenhum. O CI usa só o GitHub Actions, sem segredos.
