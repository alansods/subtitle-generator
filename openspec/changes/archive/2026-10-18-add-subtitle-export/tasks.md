# Tasks

## 1. Download

- [x] 1.1 Criar `src/lib/download.ts` (`downloadText`: Blob UTF-8, link temporário, revogação da URL) com teste unitário.
- [x] 1.2 Criar `ExportPage` (formato, nome, baixar, bloqueio por erro, voltar) na rota `/export`; testes "Scenario: Nome do arquivo", "Scenario: Baixar SRT", "Scenario: Início depois de baixar", "Scenario: Legenda com erro", "Scenario: Só avisos" e "Scenario: Voltar".
- [x] 1.3 E2E: gerar legenda (transcritor falso) → exportar → arquivo `.srt` baixado com conteúdo SRT.

## 2. Verificação

- [x] 2.1 `openspec validate add-subtitle-export --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; textos nos dois idiomas.
