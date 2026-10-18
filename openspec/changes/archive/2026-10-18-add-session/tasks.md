# Tasks

## 1. Store e seletores

- [x] 1.1 Criar `src/lib/subtitles/types.ts` (`cueSchema`, `Cue`) e `src/lib/session/{store,selectors}.ts`; testes "Scenario: Sessão começa vazia", "Scenario: Nada é persistido", "Scenario: Novo vídeo substitui o anterior", "Scenario: Só com vídeo" e "Scenario: Com cues".

## 2. Guardas e stepper

- [x] 2.1 Criar `src/lib/session/guards.ts`, aplicar nas rotas de etapa e ligar a disponibilidade do stepper à sessão; testes "Scenario: Transcrever sem vídeo", "Scenario: Editar sem vídeo" e "Scenario: Exportar sem cues".

## 3. Descarte e aviso de saída

- [x] 3.1 Criar `DiscardGuard` (useBlocker + AlertDialog) no layout raiz e `reset()` no `beforeLoad` de `/`; testes "Scenario: Confirmar descarte", "Scenario: Cancelar descarte", "Scenario: Legenda já baixada", "Scenario: Edição depois do download", "Scenario: Fechar com legenda não baixada" e "Scenario: Fechar sem nada a perder".

## 4. Verificação

- [x] 4.1 `openspec validate add-session --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; textos novos nos dois idiomas.
