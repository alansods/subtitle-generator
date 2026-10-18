# Tasks

## 1. Geração

- [x] 1.1 Criar `src/lib/subtitles/timecode.ts` (formatar e ler `HH:MM:SS,mmm`/`.mmm`, horas opcionais) com testes de arredondamento em milissegundos.
- [x] 1.2 Criar `formatSrt` e `formatVtt` com testes "Scenario: Duas cues em SRT" e "Scenario: Uma cue em VTT".

## 2. Leitura

- [x] 2.1 Criar `parseSrt` e `parseVtt` com testes "Scenario: SRT do Windows com BOM", "Scenario: VTT com nota e configurações" e "Scenario: VTT sem cabeçalho".
- [x] 2.2 Criar `parseSubtitleFile` (extensão, Zod, ordenação, erro sem cues) com testes "Scenario: Arquivo sem cues", "Scenario: Extensão não suportada" e "Scenario: Cues fora de ordem".
- [x] 2.3 Teste "Scenario: Ida e volta em SRT e VTT".

## 3. Verificação

- [x] 3.1 `openspec validate add-subtitle-formats --strict` e `npm run check` passando.
