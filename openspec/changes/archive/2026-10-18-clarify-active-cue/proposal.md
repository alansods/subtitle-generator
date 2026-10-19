# Proposal

## Why

Na lista do editor, a cue ativa (a do tempo atual do vídeo) tem uma borda roxa grossa sem nenhuma explicação. O usuário entendeu esse destaque como um aviso de problema na legenda. Avisos e erros têm outra forma (etiqueta com o motivo escrito; erro com borda vermelha), mas a borda colorida parece um alerta.

## What Changes

- A cue ativa deixa de ter borda colorida: fundo suave, um filete à esquerda e o rótulo visível "Tocando agora" ("Now playing").
- Erros continuam com borda vermelha; se a cue ativa tiver erro, a borda vermelha fica e o rótulo aparece junto.

### Fora do escopo

- Validação (avisos e erros continuam iguais).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `subtitle-editor`: "Lista de legendas" passa a exigir o rótulo "Tocando agora" na cue ativa, sem borda colorida.

## Impact

- `src/features/editor/CueList.tsx`, `src/i18n/locales/*.json`, `src/features/editor/EditorPage.test.tsx`.
