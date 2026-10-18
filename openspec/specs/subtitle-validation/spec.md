# subtitle-validation Specification

## Purpose
Define as regras de qualidade da legenda (o que é erro e o que é aviso) e como os problemas são mostrados para o usuário corrigir.

## Requirements

### Requirement: Erros de legenda
Uma cue SHALL ter erro quando o início é maior ou igual ao fim, quando termina depois do início da cue seguinte ou quando o texto está vazio (só espaços conta como vazio).

#### Scenario: Início depois do fim
- **WHEN** uma cue começa em 5 s e termina em 4 s
- **THEN** ela tem o erro "início depois do fim"

#### Scenario: Sobreposição
- **WHEN** uma cue termina em 7,2 s e a seguinte começa em 7 s
- **THEN** a primeira tem o erro "sobrepõe a próxima legenda"

#### Scenario: Texto vazio
- **WHEN** o texto de uma cue tem só espaços
- **THEN** ela tem o erro "texto vazio"

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

### Requirement: Problemas visíveis na lista
Cada cue com problemas SHALL mostrar na lista um selo por problema com a mensagem no idioma da interface, e cues com erro MUST ficar destacadas como erro.

#### Scenario: Selos na cue
- **WHEN** a cue 1 tem uma linha de 49 caracteres
- **THEN** a cue 1 da lista mostra o selo "Linha com mais de 42 caracteres"

### Requirement: Resumo e filtro
Quando há problemas, o editor SHALL mostrar um resumo com a contagem de erros e avisos; ativá-lo MUST filtrar a lista para as cues com problema, e "Mostrar todas" MUST voltar à lista completa. Sem problemas, o resumo não aparece.

#### Scenario: Filtrar pelas cues com problema
- **WHEN** 2 de 5 cues têm avisos e o usuário ativa o resumo "2 avisos"
- **THEN** a lista mostra só essas 2 cues
- **AND** "Mostrar todas" volta a mostrar as 5

#### Scenario: Sem problemas
- **WHEN** nenhuma cue tem erro ou aviso
- **THEN** o resumo de problemas não aparece
