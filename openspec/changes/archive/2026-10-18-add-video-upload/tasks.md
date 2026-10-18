# Tasks

## 1. Validação

- [x] 1.1 Criar `src/features/upload/{limits,validate}.ts` com testes "Scenario: Formato não suportado", "Scenario: Acima do limite" e o caso de aviso de "Scenario: Arquivo grande".
- [x] 1.2 Criar `src/features/upload/probe.ts` (metadados com timeout e correção de duração infinita) com teste unitário do caso de erro (mock do `<video>`).

## 2. Página inicial

- [x] 2.1 Criar `VideoDropzone` e `useVideoIntake` com testes de componente "Scenario: Selecionar pelo botão", "Scenario: Arrastar e soltar", "Scenario: Arquivo grande" (continuar) e "Scenario: Codec não suportado".
- [x] 2.2 Criar `HomePage` (topo, benefícios, passo a passo com opções, chamada final) na rota `/`; teste "Scenario: Passo a passo visível".

## 3. E2E

- [x] 3.1 Gerar `tests/e2e/fixtures/sample.webm` e escrever e2e "Scenario: Dados do vídeo na sessão" (upload real → `/transcribe` com o título da etapa e o nome do vídeo na sessão).

## 4. Verificação

- [x] 4.1 `openspec validate add-video-upload --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; textos nos dois idiomas.
