# Proposal

## Why

No teste manual, o usuário assistiu à legenda gerada e confirmou que os tempos estavam certos e dava para ler, mas o editor mostrava avisos de "leitura rápida". As regras de velocidade de leitura e de duração vieram de guias de legendagem profissional; numa legenda que acompanha a fala, elas apontam a própria fala (quem fala rápido gera legendas curtas e rápidas) e viram ruído. Só faz sentido avisar o que atrapalha a exibição.

## What Changes

- **BREAKING (regra):** removidos os avisos de leitura rápida (mais de 17 caracteres por segundo) e de duração (menor que 0,7 s ou maior que 7 s).
- Continuam os avisos de exibição: mais de 2 linhas e linha com mais de 42 caracteres.
- Os erros não mudam (início depois do fim, sobreposição, texto vazio).

### Fora do escopo

- Regras da segmentação automática (`cue-segmentation`), que continuam buscando cues de 1 a 7 s.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `subtitle-validation`: "Avisos de legenda" passa a cobrir só linhas e tamanho de linha.

## Impact

- `src/lib/subtitles/validation.ts`, `CueList` (selo de leitura rápida sai), traduções e testes.
