# Tasks

## 1. Base

- [x] 1.1 Criar `src/lib/subtitles/ass.ts` (`formatAss`) com teste "Scenario: Arquivo ASS na resolução do vídeo".
- [x] 1.2 `loadFfmpeg` com core multi-thread quando isolado; teste "Scenario: Core multi-thread".
- [x] 1.3 Criar `src/lib/media/videoExport.ts` (`buildBurnInArgs`, exportador real e falso) com teste "Scenario: Comando de gravação"; fonte Inter em `public/fonts`.

## 2. Interface

- [x] 2.1 Opção "Vídeo com legenda" na exportação (painel de estilo, prévia, nome, "Gerar vídeo", bloqueio por erro); testes "Scenario: Escolher vídeo com legenda", "Scenario: Prévia acompanha o estilo" e "Scenario: Legenda com erro".
- [x] 2.2 Progresso, cancelamento, saída protegida, falha e conclusão; testes "Scenario: Andamento", "Scenario: Cancelar a geração", "Scenario: Sair durante a geração", "Scenario: Erro do ffmpeg" e "Scenario: Vídeo pronto".
- [x] 2.3 "Baixar de novo" para vídeo na tela Pronto; teste "Scenario: Baixar o vídeo de novo".

## 3. E2E

- [x] 3.1 E2E com exportador falso (fluxo até o download do MP4) e teste opcional `RUN_REAL_FFMPEG=1` com o ffmpeg real; rodar uma vez e registrar o resultado.
  - Resultado (2026-10-18, Chromium headless, core multi-thread, página isolada): `sample-speech.webm` 320×180 de 10 s gravado em 1,8 s; MP4 válido e a legenda desenhada no quadro (156 px brancos na faixa inferior). Primeira tentativa com `FontName=Inter` não desenhava nada (sem provedor de fontes no ffmpeg.wasm); corrigido para `Inter Medium`.

## 4. Verificação

- [x] 4.1 `openspec validate add-video-export --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; textos nos dois idiomas.
