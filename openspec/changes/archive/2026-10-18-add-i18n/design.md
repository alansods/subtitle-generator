# Design

## Context

Ver proposal.md. Não há backend; os recursos de tradução precisam estar no bundle para o app funcionar offline. Requisitos em `specs/i18n/spec.md`.

## Goals / Non-Goals

**Goals:** API pequena e testável (`detectInitialLocale`, `setLocale`, formatadores) e i18n pronto antes do primeiro render.

**Non-Goals:** carregamento sob demanda dos idiomas; pluralização complexa além do que o i18next já oferece.

## Decisions

- **D1. i18next com recursos estáticos.** `src/i18n/index.ts` importa os dois JSON e chama `i18n.use(initReactI18next).init({ resources, lng, fallbackLng: 'pt-BR', interpolation: { escapeValue: false } })` de forma síncrona (`initAsync: false`). Alternativa: backend HTTP do i18next; descartada porque exige rede.
- **D2. Funções puras para a regra de idioma.** `src/i18n/locale.ts` expõe `SUPPORTED_LOCALES`, `isSupportedLocale`, `detectInitialLocale(stored, navigatorLanguage)` e `setLocale(locale)`. A regra fica testável sem DOM.
- **D3. Armazenamento seguro de preferências.** `src/lib/preferences/storage.ts` com `readPreference(key, schema)` e `writePreference(key, value)`; ambos envolvem `localStorage` em `try/catch` e validam com Zod. Reutilizado pelo tema.
- **D4. Formatadores.** `src/i18n/format.ts` com `formatNumber(value, locale, options?)` e `formatDate(value, locale, options?)` sobre `Intl`, e o hook `useFormatters()` que lê o idioma ativo do `useTranslation`.
- **D5. Paridade.** Teste unitário achata as chaves aninhadas dos dois JSON e compara os conjuntos.
- **D6. Storybook.** `.storybook/preview.tsx` adiciona `globalTypes.locale` (pt-BR/en) e um decorator que chama `i18n.changeLanguage`.

## Risks / Trade-offs

- [Bundle cresce com os dois idiomas] → Os arquivos são pequenos (texto), aceitável.
- [Chave faltando em runtime mostra a chave crua] → Teste de paridade + `fallbackLng`.
