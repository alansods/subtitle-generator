# Spec Delta

## MODIFIED Requirements

### Requirement: Avisos de legenda
Uma cue SHALL ter aviso apenas quando o texto não cabe bem na tela: quando tem mais de 2 linhas ou quando alguma linha passa de 42 caracteres. Duração e velocidade de leitura MUST NOT gerar aviso, porque a legenda acompanha a fala.

#### Scenario: Linha longa
- **WHEN** uma cue tem uma linha de 49 caracteres
- **THEN** ela tem o aviso "linha com mais de 42 caracteres"

#### Scenario: Três linhas
- **WHEN** o texto de uma cue tem 3 linhas
- **THEN** ela tem o aviso "mais de 2 linhas"

#### Scenario: Muito curta e muito longa
- **WHEN** uma cue dura 0,5 s e outra dura 8 s, ambas com uma linha curta
- **THEN** nenhuma delas tem aviso

#### Scenario: Leitura rápida
- **WHEN** uma cue de 1,22 s tem o texto "características principais." (22 caracteres por segundo)
- **THEN** ela não tem aviso

#### Scenario: Cue boa
- **WHEN** uma cue de 3 s tem uma linha de 30 caracteres e não se sobrepõe à seguinte
- **THEN** ela não tem erro nem aviso
