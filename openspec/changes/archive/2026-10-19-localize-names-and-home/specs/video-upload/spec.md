## MODIFIED Requirements

### Requirement: Página inicial explica o uso
A página inicial SHALL apresentar um título, os benefícios (grátis, sem conta, o vídeo fica no computador, nada fica salvo) e o passo a passo em 4 etapas (escolher o vídeo, gerar a legenda, revisar assistindo, baixar) com as opções disponíveis em cada uma; ela MUST NOT anunciar opções que o app não oferece, e os nomes de arquivo de exemplo MUST seguir o idioma da interface.

#### Scenario: Passo a passo visível
- **WHEN** a página inicial é aberta
- **THEN** ela mostra os 4 passos na ordem: escolher o vídeo, gerar a legenda, revisar assistindo e baixar

#### Scenario: Só opções que existem
- **WHEN** a página inicial é aberta
- **THEN** ela não menciona "Desfazer e refazer" nem "legenda que liga e desliga"

#### Scenario: Exemplos no idioma da interface
- **WHEN** a interface está em inglês e a página inicial é aberta
- **THEN** os nomes de exemplo são `team-meeting.mp4`, `team-meeting.srt`, `team-meeting.vtt` e `team-meeting-subtitled.mp4`
