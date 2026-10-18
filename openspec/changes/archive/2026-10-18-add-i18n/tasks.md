# Tasks

## 1. Base

- [x] 1.1 Instalar `i18next` e `react-i18next` e verificar que `npm run typecheck` passa.
- [x] 1.2 Criar `src/lib/preferences/storage.ts` (leitura/escrita segura com Zod) com testes de leitura válida, valor inválido e erro do `localStorage`.

## 2. Idioma

- [x] 2.1 Criar `src/i18n/locale.ts` (`SUPPORTED_LOCALES`, `isSupportedLocale`, `detectInitialLocale`, `setLocale`) com testes "Scenario: Idiomas disponíveis", "Scenario: Idioma salvo tem prioridade", "Scenario: Navegador em português de Portugal", "Scenario: Navegador em outro idioma" e "Scenario: Valor salvo inválido".
- [x] 2.2 Criar `src/i18n/locales/pt-BR.json` e `en.json` com as chaves iniciais (`app.name`) e `src/i18n/index.ts` (init síncrono), inicializado em `src/main.tsx` antes do render; testes "Scenario: Trocar para inglês" e "Scenario: Armazenamento indisponível" (componente que usa `t`).
- [x] 2.3 Teste "Scenario: Paridade de chaves" comparando as chaves achatadas dos dois arquivos.

## 3. Formatação

- [x] 3.1 Criar `src/i18n/format.ts` e o hook `useFormatters` com testes "Scenario: Número em português" e "Scenario: Número em inglês".

## 4. Storybook

- [x] 4.1 Converter `.storybook/preview.ts` em `preview.tsx` com seletor de idioma (pt-BR/en) e decorator; verificar com `npm run build-storybook` e `npm run test:tooling`.

## 5. Verificação

- [x] 5.1 `openspec validate add-i18n --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; nenhum texto de UI fora dos arquivos de tradução.
