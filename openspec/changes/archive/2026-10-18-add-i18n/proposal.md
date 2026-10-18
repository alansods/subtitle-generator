# Proposal

## Why

Todo texto de UI precisa vir de arquivos de tradução (pt-BR e en) desde a primeira tela; o cabeçalho, o upload e o editor das próximas mudanças dependem disso. Fazer a base de i18n antes evita retrabalho e garante a regra "nenhum texto fixo em componente".

## What Changes

- Inicialização do i18next + react-i18next com os recursos `src/i18n/locales/pt-BR.json` e `en.json`, carregados no bundle (funciona offline).
- Detecção do idioma inicial: o salvo em `localStorage` (`gdl:locale`); se não houver ou for inválido, `navigator.language` (`pt*` → `pt-BR`, resto → `en`).
- Troca de idioma em tempo de execução, persistindo a escolha e refletindo em `<html lang>`.
- Formatadores com `Intl` (números e datas) conforme o idioma ativo.
- Teste de paridade de chaves entre os dois arquivos.
- Storybook com seletor de idioma na barra de ferramentas.

### Fora do escopo

- O toggle PT | EN do cabeçalho (`add-app-shell`); aqui existe só a função de trocar idioma.
- Tradução de textos de telas que ainda não existem.

## Capabilities

### New Capabilities

- `i18n`: idiomas suportados, detecção inicial, troca e persistência, origem dos textos e formatação de números e datas.

### Modified Capabilities

Nenhuma.

## Impact

- Novas dependências: `i18next`, `react-i18next`.
- Novos arquivos em `src/i18n/` e `src/lib/preferences/`; `src/main.tsx` passa a inicializar o i18n; `.storybook/preview.tsx` ganha decorator de idioma.
