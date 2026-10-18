# Proposal

## Why

O Whisper devolve palavras com tempos; uma legenda boa precisa de blocos curtos, legíveis e bem cortados. A qualidade percebida do app depende mais dessa segmentação do que do modelo: cortar no meio de uma frase ou deixar um bloco de 10 segundos estraga a legenda.

## What Changes

- Função pura `segmentWords(words, rules)` que agrupa palavras em cues respeitando: no máximo 42 caracteres por linha e 2 linhas; duração entre 1 s e 7 s; quebra preferida em pontuação final, depois vírgula, depois pausa maior que 0,5 s; nunca no meio de uma palavra; sem sobreposição e com lacuna mínima de 0,08 s.
- Quebra de linha balanceada (`wrapLines`) quando o texto passa de 42 caracteres.
- Regras em constante (`SEGMENTATION_RULES`) para ajuste futuro.

### Fora do escopo

- Chamar a segmentação a partir da transcrição (`add-transcription`).

## Capabilities

### New Capabilities

- `cue-segmentation`: regras para transformar palavras com tempos em cues.

### Modified Capabilities

Nenhuma.

## Impact

- Novo `src/lib/subtitles/segmentation.ts` com testes. Sem dependências.
