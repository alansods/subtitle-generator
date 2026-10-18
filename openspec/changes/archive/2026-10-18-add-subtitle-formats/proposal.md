# Proposal

## Why

Baixar a legenda (SRT ou VTT, compatíveis com o YouTube) é o resultado final mais usado, e importar uma legenda existente é a alternativa à transcrição. Os dois dependem de geradores e leitores de formato corretos e tolerantes, escritos no próprio projeto (sem biblioteca externa).

## What Changes

- `formatSrt(cues)` e `formatVtt(cues)`: índices sequenciais (SRT), cabeçalho `WEBVTT` (VTT), tempos `HH:MM:SS,mmm` / `HH:MM:SS.mmm`, linha em branco entre cues.
- `parseSrt(text)` e `parseVtt(text)` tolerantes: BOM, `\r\n`, linhas em branco extras, vírgula ou ponto nos milissegundos, horas opcionais no VTT, blocos `NOTE`/`STYLE`/`REGION` ignorados, configurações de cue ignoradas, tags de formatação removidas.
- `parseSubtitleFile(fileName, text)` escolhe o leitor pela extensão (`.srt`/`.vtt`), valida as cues com Zod, ordena por início e recusa arquivos sem nenhuma cue válida.
- Testes de ida e volta (gerar → ler → mesmas cues).

### Fora do escopo

- Tela de download (`add-subtitle-export`) e o link de importação na tela de transcrição (`add-transcription`).
- Formato ASS (`add-subtitle-style` / `add-video-export`).

## Capabilities

### New Capabilities

- `subtitle-export`: geração de SRT/VTT e importação de SRT/VTT existentes.

### Modified Capabilities

Nenhuma.

## Impact

- Novos `src/lib/subtitles/{timecode,srt,vtt,parse}.ts` com testes. Sem dependências novas.
