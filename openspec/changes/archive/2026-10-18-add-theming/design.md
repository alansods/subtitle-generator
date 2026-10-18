# Design

## Context

Ver proposal.md. O shadcn já gerou variáveis CSS em `src/styles/globals.css` com a variante `dark` por classe. Identidade aprovada no protótipo (paleta neutra + violeta). Requisitos em `specs/theming/spec.md`.

## Decisions

- **D1. Fonte única dos tokens no CSS.** `:root` e `.dark` em `globals.css` recebem a paleta aprovada nos nomes do shadcn (`--background`, `--primary`…) e tokens extras (`--warning`, `--warning-soft`, `--success`, `--success-soft`, `--danger-soft`, `--ink`, `--ink-foreground`, `--wave`, `--region`). O teste de contraste lê o próprio CSS (regex nos blocos), sem duplicar valores em TS.
- **D2. Regra em funções puras.** `src/theme/theme.ts`: `themeModeSchema`, `resolveTheme(mode, prefersDark)`, `nextMode(resolved)` e um store mínimo (`getThemeState`, `subscribe`, `setThemeMode`, `toggleTheme`) consumido por `useTheme()` via `useSyncExternalStore`. Escuta `matchMedia('(prefers-color-scheme: dark)')` só no modo `system`.
- **D3. Script inline sem dependências.** `index.html` tem um `<script>` no `<head>` que replica a regra (lê `gdl:theme` em `try/catch`, consulta `matchMedia`, aplica `dark`). O teste extrai esse script do `index.html` e o executa no jsdom com `localStorage`/`matchMedia` simulados, garantindo que a cópia não diverge da regra.
- **D4. Fontes locais.** `@fontsource-variable/plus-jakarta-sans` e `@fontsource/ibm-plex-mono` (400, 500) importados em `main.tsx`; `@theme inline` define `--font-sans` e `--font-mono`. Alternativa: Google Fonts; descartada por depender de rede (princípio offline).
- **D5. Raio maior.** `--radius: 1.125rem` (18 px), alinhado aos cantos do protótipo; botões em pílula ficam a cargo de cada componente.

## Risks / Trade-offs

- [Script inline duplica a regra de TS] → Teste executa o script real contra os mesmos cenários.
- [COEP credentialless e fontes] → Fontes são do mesmo domínio; sem impacto.
