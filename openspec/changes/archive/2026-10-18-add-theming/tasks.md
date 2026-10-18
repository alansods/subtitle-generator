# Tasks

## 1. Tokens e fontes

- [x] 1.1 Substituir os tokens de `:root` e `.dark` em `src/styles/globals.css` pela paleta aprovada, adicionar os tokens extras ao `@theme inline` e definir `--radius` e `color-scheme`. Verificar com `npm run build`.
- [x] 1.2 Instalar e importar as fontes (`@fontsource-variable/plus-jakarta-sans`, `@fontsource/ibm-plex-mono`) e mapear `--font-sans`/`--font-mono`. Verificar que o build inclui os arquivos de fonte.
- [x] 1.3 Teste "Scenario: Contraste dos tokens" lendo os blocos `:root` e `.dark` do CSS.

## 2. Regra e store de tema

- [x] 2.1 Criar `src/theme/theme.ts` e o hook `useTheme` com testes "Scenario: Sistema escuro sem escolha salva", "Scenario: Escolha salva vence o sistema", "Scenario: Valor salvo inválido", "Scenario: Alternar a partir do sistema escuro" e "Scenario: Sistema muda para escuro".

## 3. Sem flash

- [x] 3.1 Adicionar o script inline ao `<head>` do `index.html` e testes "Scenario: Classe aplicada antes do app" e "Scenario: Armazenamento bloqueado" executando o script extraído do arquivo.

## 4. Verificação

- [x] 4.1 `openspec validate add-theming --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando.
