# Tasks

## 1. Regras

- [x] 1.1 Criar `src/lib/subtitles/validation.ts` (`VALIDATION_RULES`, `validateCues`, contagens) com testes "Scenario: Início depois do fim", "Scenario: Sobreposição", "Scenario: Texto vazio", "Scenario: Linha longa", "Scenario: Três linhas", "Scenario: Muito curta e muito longa", "Scenario: Leitura rápida" e "Scenario: Cue boa".

## 2. Editor

- [x] 2.1 Selos por problema e destaque de erro no `CueList`; teste "Scenario: Selos na cue".
- [x] 2.2 Resumo e filtro no editor; testes "Scenario: Filtrar pelas cues com problema" e "Scenario: Sem problemas".

## 3. Verificação

- [x] 3.1 `openspec validate add-subtitle-validation --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; mensagens nos dois idiomas.
