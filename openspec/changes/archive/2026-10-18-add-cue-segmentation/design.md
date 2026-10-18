# Design

## Context

Ver proposal.md. Entrada: palavras `{ text, start, end }` com tempos em segundos (formato das word timestamps do Transformers.js, texto às vezes com espaço inicial). Requisitos em `specs/cue-segmentation/spec.md`.

## Decisions

- **D1. Guloso com retrocesso.** Percorre as palavras acumulando na cue atual. Fecha a cue antes de uma pausa maior que 0,5 s (sempre: a pausa dá espaço para estender até 1 s) ou logo depois de uma palavra com pontuação final, quando a cue já tem pelo menos 1 s. Quando a próxima palavra estouraria um limite rígido (texto que não cabe em 2 linhas de 42 ou duração acima de 7 s), escolhe o melhor ponto de corte dentro da cue atual. A ordem de preferência é: a última pontuação final; senão, a última vírgula; senão, a maior pausa acima de 0,5 s; senão, logo antes da palavra que estouraria. O corte só é aceito se a primeira parte tiver pelo menos 1 s, e o restante volta a ser acumulado.
- **D2. Caber em duas linhas.** `wrapLines(words)` testa todas as quebras entre palavras e escolhe a que deixa as duas linhas com no máximo 42 caracteres e menor diferença de tamanho. Uma cue "cabe" se tiver até 42 caracteres ou se existir essa quebra. Uma palavra única com mais de 42 caracteres fica sozinha (a validação a aponta depois).
- **D3. Pós-processamento.** Em ordem: estender cues com menos de 1 s até 1 s (limitado por `próxima.start - 0,08`), depois garantir a lacuna mínima antecipando o fim da anterior (sem passar do próprio início + 0,001). Tempos arredondados para milissegundos.
- **D4. Regras parametrizadas.** `SEGMENTATION_RULES = { maxLineChars: 42, minDuration: 1, maxDuration: 7, pauseSec: 0.5, minGap: 0.08 }` (o limite de 2 linhas é estrutural em `wrapLines`).

## Risks / Trade-offs

- [Guloso não é ótimo global] → Suficiente para legenda; os casos ruins aparecem na validação e o usuário corrige no editor.
