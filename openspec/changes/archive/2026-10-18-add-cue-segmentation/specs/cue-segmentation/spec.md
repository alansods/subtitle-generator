# Spec Delta

## Purpose

Define como palavras transcritas com tempos são agrupadas em cues legíveis: tamanho, duração, onde cortar e como evitar sobreposição.

## ADDED Requirements

### Requirement: Tamanho máximo da cue
Cada cue SHALL ter no máximo 2 linhas de no máximo 42 caracteres cada; quando o texto passar de 42 caracteres, ele MUST ser dividido em duas linhas balanceadas numa fronteira entre palavras.

#### Scenario: Frase longa sem pontuação
- **WHEN** 30 palavras sem pontuação e sem pausas, somando mais de 150 caracteres, são segmentadas
- **THEN** toda cue resultante tem no máximo 2 linhas e nenhuma linha passa de 42 caracteres

#### Scenario: Duas linhas balanceadas
- **WHEN** uma cue tem 60 caracteres de texto
- **THEN** o texto fica em duas linhas, cada uma com no máximo 42 caracteres, com diferença de comprimento menor que a de qualquer outra quebra possível

### Requirement: Limites de duração
Cada cue SHALL durar no máximo 7 s; uma cue mais curta que 1 s MUST ser estendida até 1 s quando houver espaço antes da próxima cue (respeitando a lacuna mínima).

#### Scenario: Fala contínua de 12 segundos
- **WHEN** palavras contínuas por 12 s, sem pontuação nem pausas, são segmentadas
- **THEN** nenhuma cue dura mais que 7 s

#### Scenario: Resposta curta
- **WHEN** a palavra "Sim." dura 0,3 s e a próxima fala começa 3 s depois
- **THEN** a cue "Sim." dura 1 s

### Requirement: Onde cortar
A segmentação SHALL preferir cortar depois de pontuação final (`.`, `?`, `!`); se precisar cortar uma cue longa sem pontuação final, SHALL preferir depois de vírgula, e em seguida numa pausa maior que 0,5 s entre palavras.

#### Scenario: Pontuação final
- **WHEN** as palavras "Olá, pessoal. Hoje vamos falar de legendas." são segmentadas e a primeira frase dura mais de 1 s
- **THEN** a primeira cue termina em "pessoal." e a segunda começa em "Hoje"

#### Scenario: Vírgula antes do limite
- **WHEN** uma frase sem ponto ultrapassa o tamanho de uma cue e tem uma vírgula antes do limite
- **THEN** a primeira cue termina na palavra com a vírgula

#### Scenario: Pausa entre palavras
- **WHEN** há uma pausa de 0,8 s entre duas palavras sem pontuação e a cue atual já dura mais de 1 s
- **THEN** uma nova cue começa depois da pausa

### Requirement: Palavras inteiras
A segmentação MUST NOT dividir uma palavra entre cues ou entre linhas, e o texto das cues em sequência SHALL reproduzir as palavras originais na ordem.

#### Scenario: Texto preservado
- **WHEN** qualquer sequência de palavras é segmentada
- **THEN** juntando os textos das cues com espaços obtém-se exatamente as palavras originais na ordem

### Requirement: Sem sobreposição
Cues consecutivas MUST NOT se sobrepor e SHALL ter lacuna mínima de 0,08 s; em conflito, o fim da cue anterior é antecipado.

#### Scenario: Palavras coladas entre cues
- **WHEN** a última palavra de uma cue termina em 4,00 s e a primeira da próxima começa em 4,02 s
- **THEN** a primeira cue termina no máximo em 3,94 s, deixando 0,08 s até a próxima
