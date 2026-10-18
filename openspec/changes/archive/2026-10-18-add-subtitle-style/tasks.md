# Tasks

## 1. Estilo

- [x] 1.1 Criar `src/lib/subtitles/style.ts` (`SubtitleStyle`, padrão, `styleToCss`, `styleToAss`) com testes "Scenario: Tamanho proporcional", "Scenario: Transparente com contorno", "Scenario: Preto, M, inferior em 1080p", "Scenario: Branco em cima" e "Scenario: Transparente".
- [x] 1.2 Guardar o estilo na sessão; testes "Scenario: Estilo padrão" e "Scenario: Novo vídeo volta ao padrão".

## 2. Interface

- [x] 2.1 Instalar `@fontsource/inter`, criar `StylePanel`, colocá-lo no editor e fazer a legenda sobreposta usar o estilo; testes "Scenario: Escolher fundo branco", "Scenario: Legenda em cima" e "Scenario: Tema escuro".

## 3. Verificação

- [x] 3.1 `openspec validate add-subtitle-style --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; textos nos dois idiomas.
