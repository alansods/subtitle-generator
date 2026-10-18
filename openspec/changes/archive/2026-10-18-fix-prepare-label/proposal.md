# Proposal

## Why

No teste manual, o rótulo "Preparando (só na primeira vez)" confundiu: o usuário gera a legenda uma vez por vídeo, então "só na primeira vez" não faz sentido para ele. O detalhe (o download do modelo acontece uma vez por computador) é técnico e não precisa aparecer.

## What Changes

- A etapa passa a se chamar apenas "Preparando" ("Getting ready" em inglês), sem explicação adicional (decisão do usuário).

### Fora do escopo

- O comportamento da etapa (download do modelo no primeiro uso, instantânea com cache) não muda.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `transcription`: nome da primeira etapa em "Progresso em etapas".

## Impact

- Traduções `transcribe.stages.prepare`.
