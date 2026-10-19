# Tasks

## 1. Navegação

- [x] 1.1 Novos nomes das etapas e títulos (pt-BR e en); stepper na linha do título com ✓ nas concluídas; testes "Scenario: Etapa atual destacada", "Scenario: Etapa indisponível" e "Scenario: Navegar por uma etapa disponível".
- [x] 1.2 `StepNav` (Voltar/Avançar) no fim das etapas, removendo "Exportar" do editor e "Voltar ao editor" da exportação; testes "Scenario: Avançar da revisão", "Scenario: Voltar da exportação" e "Scenario: Avançar sem legenda".

## 2. Transcrição

- [x] 2.1 Idioma falado como lista de seleção; teste "Scenario: Idioma padrão".

## 3. Verificação

- [x] 3.1 E2E atualizados; `openspec validate simplify-step-navigation --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; prints em claro, escuro e 390 px.
