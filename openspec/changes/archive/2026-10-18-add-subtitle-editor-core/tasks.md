# Tasks

## 1. Lógica

- [x] 1.1 Criar `cueOps.ts` e `formatClock` com testes "Scenario: Ajustar o início", "Scenario: Dividir no cursor", "Scenario: Juntar com a próxima", "Scenario: Excluir", "Scenario: Inserir depois" e "Scenario: Adicionar entre cues" (cálculo).
- [x] 1.2 Criar a store `usePlayback` e o controlador `playback`.

## 2. Player e legenda

- [x] 2.1 Criar `VideoPlayer` (controles) e `SubtitleOverlay` (legenda em tempo real, edição inline, adicionar aqui); testes "Scenario: Reproduzir e pausar", "Scenario: Mudar a velocidade", "Scenario: Cue ativa", "Scenario: Entre cues", "Scenario: Corrigir e salvar com Enter", "Scenario: Quebra de linha", "Scenario: Cancelar com Esc", "Scenario: Salvar ao sair do campo" e "Scenario: Adicionar entre cues".

## 3. Lista

- [x] 3.1 Criar `CueList` (número, tempos com ±0,1 s, texto, ações, seguir vídeo); testes "Scenario: Ir para uma cue", "Scenario: Lista acompanha o vídeo", "Scenario: Seguir desligado", "Scenario: Editar o texto na lista" e as ações via interface.

## 4. Página

- [x] 4.1 Criar `EditorPage` na rota `/edit` com o botão "Exportar"; testes "Scenario: Exportar" e "Scenario: Trocar para inglês no editor"; e2e do fluxo upload → gerar → editar uma cue.

## 5. Verificação

- [x] 5.1 `openspec validate add-subtitle-editor-core --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; textos nos dois idiomas.
