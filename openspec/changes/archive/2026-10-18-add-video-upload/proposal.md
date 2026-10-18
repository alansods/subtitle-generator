# Proposal

## Why

É a porta de entrada do app: a página inicial precisa mostrar em segundos como é simples (passo a passo e opções) e receber o vídeo, recusando com mensagem clara o que o navegador não consegue usar antes de qualquer processamento pesado.

## What Changes

- Página inicial (`/`): topo com título, descrição e benefícios (grátis, sem conta, o vídeo fica no computador, nada fica salvo), área de upload e seção "Como fazer sua legenda" em 4 passos com as opções de cada um, mais uma chamada final.
- Área de upload: arrastar e soltar ou botão "Selecionar vídeo".
- Validação: formatos MP4, WebM e MOV; erro acima de 500 MB; aviso acima de 200 MB com "Continuar mesmo assim"; erro quando o navegador não consegue reproduzir o arquivo (sem suporte ao tipo ou falha ao ler os metadados).
- Aceito o vídeo: colocá-lo na sessão (nome sem extensão, duração, largura, altura) e ir para `/transcribe`.
- Limites configuráveis em código (`UPLOAD_LIMITS`).
- Fixture de vídeo para e2e gerado pelo Chromium (`scripts/make-fixture-video.mjs`).

### Fora do escopo

- Miniatura do vídeo e lista de projetos (descartadas por decisão de produto).
- A tela de transcrição em si (`add-transcription`).

## Capabilities

### New Capabilities

- `video-upload`: página inicial, seleção do arquivo, validação e criação da sessão.

### Modified Capabilities

Nenhuma.

## Impact

- `src/routes/index.tsx`, novo `src/features/upload/`, chaves de tradução novas, `tests/e2e/fixtures/sample.webm`.
