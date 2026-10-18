# Tasks

## 1. Componentes base

- [x] 1.1 Criar `src/components/Button.tsx` (cva) com as variantes e tamanhos do design; verificar com typecheck e lint.

## 2. Cabeçalho, rodapé e 404

- [x] 2.1 Criar `Header` (marca com link para `/`, seletor PT | EN, botão de tema) e `Footer`, e usá-los no layout raiz; testes "Scenario: Cabeçalho presente", "Scenario: Marca leva ao início", "Scenario: Trocar idioma pelo cabeçalho", "Scenario: Alternar para escuro" e "Scenario: Rodapé presente".
- [x] 2.2 Criar `NotFoundPage` como `notFoundComponent` da raiz; teste "Scenario: Rota inexistente" (componente e e2e).

## 3. Etapas

- [x] 3.1 Criar `Stepper`, o layout `_steps.tsx` e as rotas `/transcribe`, `/edit`, `/export` com o título da etapa; testes "Scenario: Etapa atual destacada", "Scenario: Etapa indisponível" e "Scenario: Navegar por uma etapa disponível".

## 4. Verificação

- [x] 4.1 Paridade de chaves de tradução, `openspec validate add-app-shell --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando.
