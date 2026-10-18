# Design

## Context

O repositório está vazio, só com `openspec/` e os comandos `/opsx` do Claude Code. A motivação está em proposal.md (Why) e os requisitos em `specs/project-tooling/spec.md`. Este documento cobre as escolhas de versão, a configuração e como cada cenário vira teste.

Restrições levantadas ao consultar o registro npm (17/10/2026):

- `typescript-eslint@8.71` aceita só `typescript >=4.8.4 <6.1.0`. A versão mais recente do TypeScript é a 7.0.
- `eslint-plugin-jsx-a11y@6.10` declara suporte só até o ESLint 9. A versão mais recente do ESLint é a 10.
- O Vite 8 exige Node `^20.19 || >=22.12`.

## Goals / Non-Goals

**Goals:**
- Uma base em que `npm ci && npm run check && npm run build && npm run test:e2e` funcione numa máquina limpa e no CI.
- `crossOriginIsolated === true` em dev, preview e produção desde o primeiro commit.
- Cada cenário da spec mapeado para um teste automatizado ou para um passo verificável do CI.

**Non-Goals:**
- Configurar o deploy no Cloudflare Pages (só o arquivo `_headers`).
- Adicionar componentes shadcn, i18n, tema ou qualquer texto de UI.
- Otimizar o build (code splitting, PWA, cache do modelo), que fica para as mudanças que precisarem.

## Decisions

### D1. Versões principais

| Pacote | Versão | Motivo |
|---|---|---|
| vite | ^8.3 | atual |
| @vitejs/plugin-react | ^6.1 | exige Vite 8 |
| react / react-dom | ^19.3 | o briefing pede "18+"; a 19 é a atual |
| typescript | ~6.0.3 | limite do typescript-eslint (<6.1) |
| eslint / @eslint/js | ^9.39 | o jsx-a11y ainda não suporta ESLint 10 |
| @tanstack/react-router + router-plugin | ^1.170 / ^1.168 | atual |
| zod | ^4.6 | atual |
| tailwindcss + @tailwindcss/vite | ^4.3 | Tailwind v4, configuração em CSS |
| vitest | ^5.0 | compatível com Vite 8 |
| @playwright/test | ^1.64 | atual |
| storybook + @storybook/react-vite | ^10.6 | atual |

**Alternativas:** TypeScript 7 com ESLint 10 obrigaria a abrir mão do typescript-eslint com regras tipadas e do jsx-a11y. Acessibilidade é princípio do projeto, então preferimos versões um pouco anteriores. Uma mudança futura pode subir as versões quando os plugins acompanharem.

O arquivo `.nvmrc` aponta para `24` (LTS) e `package.json#engines.node` para `>=22.12`.

### D2. Roteamento baseado em arquivos

Usaremos `@tanstack/router-plugin/vite` com `autoCodeSplitting: true`, rotas em `src/routes/` e árvore gerada em `src/routeTree.gen.ts`. O arquivo gerado é versionado, mas fica fora do lint e do Prettier. O router é criado em `src/app/router.ts`, com a declaração de módulo `Register` para tipagem global, e montado em `src/main.tsx`.

Nesta mudança existem só `__root.tsx` (renderiza `<Outlet />` dentro de um `<div data-testid="app-root">`) e `index.tsx` (retorna `null`). Nenhum texto visível, para não violar a regra de i18n antes de `add-i18n`.

**Alternativa:** a definição de rotas em código ocupa mais espaço e perde a separação automática de código por rota.

### D3. Tailwind v4 + shadcn/ui

`@tailwindcss/vite` carrega `src/styles/globals.css` com `@import "tailwindcss"`. O dark mode por classe fica em `@custom-variant dark (&:where(.dark, .dark *));`. O `npx shadcn@latest init` gera `components.json` (aliases `@/components`, `@/lib/utils`, componentes em `src/components/ui`), os tokens CSS de claro/escuro e `src/lib/utils.ts` com `cn`. O tom base é `neutral`. O contraste AA é revisado em `add-theming`.

### D4. Headers COOP/COEP com fonte única

Um módulo de config na raiz, `config/cross-origin-headers.ts` (fora de `src/` porque é consumido pelo `vite.config.ts` e pelos testes de tooling), exporta:

```ts
export const crossOriginHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',
} as const;
```

O `vite.config.ts` usa esse objeto em `server.headers` e `preview.headers`. O `public/_headers` é um arquivo estático, que o Vite copia para `dist/`, e um teste garante que ele declara exatamente os mesmos pares do objeto. Assim a divergência entre ambientes é detectada no CI.

**Alternativa:** gerar `_headers` com um plugin do Vite elimina a duplicação, mas esconde o arquivo que o Cloudflare lê. O teste de paridade é mais simples e explícito.

**Nota:** o Chromium suporta `credentialless`. Firefox e Safari ignoram ou tratam de forma diferente. Isso é coberto pela regra de navegadores do projeto (o ffmpeg cai para single-thread com aviso, em `add-video-export`).

### D5. Organização dos testes

- **Vitest**, configurado em `vitest.config.ts` com `mergeConfig` do `vite.config.ts` e dois projetos:
  - `unit`: ambiente `jsdom`, `src/**/*.test.{ts,tsx}`, setup com `@testing-library/jest-dom/vitest`.
  - `tooling`: ambiente `node`, `tests/tooling/**/*.test.ts`. São os testes que verificam a própria infraestrutura (arquivos de config e execução de `tsc`/`eslint` como subprocesso).
- **Playwright**, em `playwright.config.ts` com dois projetos Chromium e dois `webServer`:
  - `dev`: `npm run dev -- --port 5173 --strictPort`, baseURL `http://localhost:5173`.
  - `preview`: `npm run build && npm run preview -- --port 4173 --strictPort`, baseURL `http://localhost:4173`.
  - Os testes ficam em `tests/e2e/` e rodam nos dois projetos.
- `npm test` roda `vitest run --project unit`, e `npm run test:tooling` roda `vitest run --project tooling`.
- `npm run check` executa `npm run typecheck && npm run lint && npm run format:check && npm test`. Os testes de tooling ficam fora do `check` porque rodam `tsc` e `eslint` de novo. O CI chama os dois.

### D6. Mapeamento cenário → verificação

| Cenário | Verificação |
|---|---|
| Servidor de desenvolvimento isolado | e2e `tests/e2e/cross-origin.spec.ts`, projeto `dev` (headers do documento e de `/src/main.tsx` + `crossOriginIsolated`) |
| Build de produção isolado | o mesmo e2e no projeto `preview` |
| Configuração de hospedagem declara os headers | tooling `headers.test.ts`: `public/_headers` igual a `crossOriginHeaders` em `/*` |
| Carga inicial limpa | e2e `tests/e2e/app-loads.spec.ts`: `app-root` visível e nenhum `console.error`/`pageerror` |
| Verificação de tipos passa | tooling `typecheck.test.ts`: executa `tsc -b` e espera saída 0 |
| Erro de tipo é detectado | tooling `typecheck.test.ts`: executa `tsc` num fixture (`tests/tooling/fixtures/type-error/`) que estende o tsconfig do app e espera saída ≠ 0 |
| Lint passa | tooling `lint.test.ts`: executa `eslint .` e espera saída 0 |
| Formatação conferida | tooling `lint.test.ts`: executa `prettier --check .` e espera saída 0 |
| Testes unitários e de componentes | tooling `scripts.test.ts`: executa `vitest run --project unit` e espera saída 0. Existe ao menos um teste de componente (RTL) da rota raiz |
| Testes end-to-end | passo `npm run test:e2e` do CI (executar Playwright dentro do Vitest seria lento e recursivo) |
| Qualidade agregada passa | passo `npm run check` do CI |
| Qualidade agregada falha com qualquer etapa | tooling `scripts.test.ts`: `scripts.check` encadeia `typecheck`, `lint`, `format:check` e `test` com `&&`, sem `\|\|` nem `;` |
| Build gera artefatos estáticos | tooling `build.test.ts`: executa `vite build` num `outDir` temporário e confere `index.html` e `_headers` |
| Catálogo compila | tooling `storybook.test.ts`: `storybook build` num diretório temporário sai com 0 e gera `index.html` (o CI também roda `npm run build-storybook`) |
| Catálogo exibe os dois temas | tooling `storybook.test.ts`: `index.json` do build tem as stories `Claro` e `Escuro` de `App/RootLayout` |
| Pipeline executa as verificações | tooling `ci.test.ts`: lê `.github/workflows/ci.yml` (com `yaml`) e confere os gatilhos e os comandos |

Cada teste cita o nome do cenário na descrição (`it('Scenario: Lint passa', …)`).

### D7. ESLint e Prettier

O ESLint usa flat config (`eslint.config.js`) com `@eslint/js` recommended, `typescript-eslint` `strictTypeChecked` + `stylisticTypeChecked` (com `projectService`), `react-hooks` recommended, `react-refresh`, `jsx-a11y` recommended, `eslint-plugin-storybook` e, por último, `eslint-config-prettier`. Ficam ignorados `dist`, `storybook-static`, `src/routeTree.gen.ts`, `playwright-report`, `test-results` e `src/components/ui` (código gerado pelo shadcn, revisado ao adicionar cada componente).

O Prettier usa `.prettierrc` com `singleQuote: true`, `semi: true`, `printWidth: 100` e `prettier-plugin-tailwindcss` para ordenar as classes.

### D8. Storybook

`@storybook/react-vite` reaproveita o `vite.config.ts`. O `.storybook/preview.ts` importa `globals.css` e usa `withThemeByClassName` (`@storybook/addon-themes`) com `light`/`dark` aplicando a classe no `<html>`. O seletor de idioma entra em `add-i18n`. Fica uma story de exemplo mínima (`src/app/RootLayout.stories.tsx`) para o build do catálogo ter conteúdo.

### D9. CI

`.github/workflows/ci.yml` dispara em `push` e `pull_request` e roda num job `ubuntu-latest` com Node 24 e cache npm: `npm ci`, `npm run check`, `npm run test:tooling`, `npm run build`, `npm run build-storybook`, `npx playwright install --with-deps chromium` e `npm run test:e2e`. O relatório do Playwright é enviado como artefato em caso de falha.

### D10. Ajustes descobertos na implementação

- `tsconfig.node.json` inclui a lib `DOM`: os testes e2e são typechecados por ele e usam `window` dentro de `page.evaluate`.
- `tsconfig.app.json` inclui `.storybook/*.ts` com padrão de arquivo explícito: o TypeScript ignora pastas que começam com ponto quando o `include` aponta só para o diretório, e o ESLint tipado precisa desses arquivos num projeto.
- O plugin do router usa `routeFileIgnorePattern: '\.(test|stories)\.tsx?$'`, para testes e stories ao lado das rotas não virarem rotas.
- `vite.config.ts` e `vitest.config.ts` importam módulos locais com extensão `.ts`, porque o Vite avisa que o loader nativo de config (futuro padrão) não resolve imports sem extensão.
- O helper `tests/tooling/run.ts` remove códigos ANSI da saída, porque algumas ferramentas colorem mesmo fora de TTY.
- Instalação de pacotes: o npm 10.9 falha (`edgesOut`) ao resolver peer dependencies opcionais (ex.: Vitest). Use o npm 11 do Node 24, que o CI já usa. O README registra isso.

## Risks / Trade-offs

- [Versões fixadas abaixo da mais recente (TS 6.0, ESLint 9)] → Documentadas aqui. Uma mudança `upgrade-toolchain` sobe as versões quando os plugins suportarem.
- [Testes de tooling executam `tsc`/`eslint` e ficam lentos] → Projeto Vitest separado, fora do `check` local e do watch. Timeout de 120 s.
- [`credentialless` não é suportado da mesma forma fora do Chromium] → O e2e roda só no Chromium. O fallback single-thread do ffmpeg é tratado em `add-video-export`.
- [Dois `webServer` no Playwright (dev + build/preview) deixam o e2e mais lento] → É aceitável no CI. Localmente dá para rodar um projeto só com `--project dev`.
- [O `shadcn init` é interativo e pode mudar entre versões] → Rodado sem interação com `shadcn@4.22.0 init -t vite -b radix -p nova --no-monorepo --no-rtl -y` (o shadcn 4 não tem mais `--base-color`; o preset `nova` usa `baseColor: neutral`). O init também adiciona um `button` e a fonte Geist, que são removidos para manter o escopo; componentes e fontes entram nas mudanças que os usam. O resultado é revisado e versionado.

## Migration Plan

Não se aplica: é o primeiro código do repositório. O rollback é reverter o commit.

## Open Questions

- Hospedagem do repositório remoto (GitHub?) para o CI rodar de fato. O workflow é criado de qualquer forma e só passa a valer quando houver remoto no GitHub.
