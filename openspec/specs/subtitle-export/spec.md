# subtitle-export Specification

## Purpose
Define como as legendas viram arquivos SRT e VTT compatíveis com players e com o YouTube, e como arquivos SRT e VTT existentes são lidos de volta para a sessão.

## Requirements

### Requirement: Gerar SRT
A aplicação SHALL gerar SRT com índices sequenciais a partir de 1, tempos no formato `HH:MM:SS,mmm --> HH:MM:SS,mmm`, o texto da cue em uma ou duas linhas e uma linha em branco entre cues.

#### Scenario: Duas cues em SRT
- **WHEN** as cues (0,4 s–4,2 s "Olá!") e (3725,5 s–3727 s "Linha 1\nLinha 2") são exportadas em SRT
- **THEN** o arquivo é `1\n00:00:00,400 --> 00:00:04,200\nOlá!\n\n2\n01:02:05,500 --> 01:02:07,000\nLinha 1\nLinha 2\n`

### Requirement: Gerar VTT
A aplicação SHALL gerar VTT começando por `WEBVTT` e uma linha em branco, com tempos no formato `HH:MM:SS.mmm --> HH:MM:SS.mmm` e uma linha em branco entre cues.

#### Scenario: Uma cue em VTT
- **WHEN** a cue (0,4 s–4,2 s "Olá!") é exportada em VTT
- **THEN** o arquivo é `WEBVTT\n\n00:00:00.400 --> 00:00:04.200\nOlá!\n`

### Requirement: Importar SRT tolerante
A leitura de SRT SHALL aceitar BOM, quebras de linha `\r\n`, linhas em branco extras, ponto ou vírgula nos milissegundos e tags de formatação (que são removidas do texto).

#### Scenario: SRT do Windows com BOM
- **WHEN** um SRT com BOM, `\r\n`, linhas em branco extras e `<i>itálico</i>` é lido
- **THEN** as cues resultantes têm os tempos corretos e o texto `itálico`, sem tags

### Requirement: Importar VTT tolerante
A leitura de VTT SHALL exigir o cabeçalho `WEBVTT`, aceitar tempos sem horas, ignorar identificadores de cue, configurações após o tempo e blocos `NOTE`, `STYLE` e `REGION`.

#### Scenario: VTT com nota e configurações
- **WHEN** um VTT com um bloco `NOTE`, um identificador de cue, tempo `00:01.000 --> 00:02.500 align:start` e texto "Oi" é lido
- **THEN** resulta uma cue de 1 s a 2,5 s com texto "Oi"

#### Scenario: VTT sem cabeçalho
- **WHEN** um arquivo `.vtt` sem a linha `WEBVTT` é lido
- **THEN** a leitura falha com erro de formato

### Requirement: Importação validada
A importação SHALL escolher o leitor pela extensão (`.srt` ou `.vtt`), validar cada cue com o schema de cue, ordenar as cues por início e MUST falhar quando o arquivo não tem nenhuma cue válida ou tem outra extensão.

#### Scenario: Arquivo sem cues
- **WHEN** o arquivo `vazio.srt` sem nenhuma cue é importado
- **THEN** a importação falha com erro "nenhuma legenda encontrada"

#### Scenario: Extensão não suportada
- **WHEN** o arquivo `legenda.txt` é importado
- **THEN** a importação falha com erro de formato não suportado

#### Scenario: Cues fora de ordem
- **WHEN** um SRT tem a cue das 10 s antes da cue das 2 s
- **THEN** as cues importadas ficam ordenadas por início

### Requirement: Ida e volta sem perda
Gerar um arquivo e lê-lo de volta SHALL resultar nas mesmas cues (início, fim com precisão de milissegundo e texto).

#### Scenario: Ida e volta em SRT e VTT
- **WHEN** um conjunto de cues com textos de uma e duas linhas é gerado em SRT e em VTT e cada arquivo é lido de volta
- **THEN** as cues lidas têm os mesmos inícios, fins e textos das originais
