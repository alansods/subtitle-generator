# Proposal

## Why

Uma legenda pode estar "certa" no texto e ruim de ler: longa demais, rápida demais, sobreposta. O usuário não conhece as regras de legendagem; o app precisa apontar exatamente onde corrigir, sem impedir o trabalho por detalhes.

## What Changes

- `validateCues(cues)`: lista de problemas por cue, em dois níveis.
  - **Erro:** início maior ou igual ao fim, sobreposição com a cue seguinte, texto vazio.
  - **Aviso:** mais de 2 linhas, linha com mais de 42 caracteres, duração menor que 0,7 s ou maior que 7 s, leitura acima de 17 caracteres por segundo.
- No editor: selos com a mensagem de cada problema em cada cue, cue com erro destacada, resumo "N avisos · M erros" que filtra a lista para as cues com problema e "Mostrar todas" para voltar.

### Fora do escopo

- Bloquear a exportação quando há erros (`add-subtitle-export` usa este resultado).

## Capabilities

### New Capabilities

- `subtitle-validation`: regras de qualidade das cues e como os problemas aparecem no editor.

### Modified Capabilities

Nenhuma.

## Impact

- Novo `src/lib/subtitles/validation.ts`; `CueList` e `EditorPage` mostram selos, resumo e filtro; traduções.
