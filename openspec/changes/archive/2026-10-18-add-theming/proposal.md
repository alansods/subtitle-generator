# Proposal

## Why

O app precisa abrir no tema certo desde o primeiro pixel (sem piscar claro antes do escuro) e com a identidade visual aprovada: fundos neutros, violeta só na ação principal e no estado ativo, Plus Jakarta Sans e IBM Plex Mono. As telas seguintes usam esses tokens.

## What Changes

- Modos claro, escuro e "seguir sistema" (padrão sem escolha salva), persistidos em `localStorage` (`gdl:theme`).
- Script inline no `index.html` aplica a classe `dark` antes de qualquer renderização.
- Em "seguir sistema", o tema acompanha a mudança do sistema operacional em tempo real.
- Tokens de cor do shadcn/ui substituídos pela paleta aprovada nos dois temas, com tokens extras (aviso, sucesso, tons suaves, onda da timeline) e raio base maior.
- Fontes Plus Jakarta Sans (interface) e IBM Plex Mono (tempos) servidas pelo próprio app via `@fontsource`.
- Teste de contraste AA dos pares de texto nos dois temas.

### Fora do escopo

- O botão de alternar tema no cabeçalho (`add-app-shell`); aqui existem as funções e o hook.
- A fonte Inter da legenda (`add-subtitle-style`).

## Capabilities

### New Capabilities

- `theming`: modos de tema, detecção inicial, persistência, ausência de flash, acompanhamento do sistema, contraste e independência em relação ao estilo da legenda.

### Modified Capabilities

Nenhuma.

## Impact

- `index.html` (script inline), `src/styles/globals.css` (tokens), novo `src/theme/`, `src/main.tsx` (fontes).
- Dependências: `@fontsource-variable/plus-jakarta-sans`, `@fontsource/ibm-plex-mono`.
