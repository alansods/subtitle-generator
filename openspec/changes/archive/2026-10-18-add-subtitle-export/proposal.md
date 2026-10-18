# Proposal

## Why

Baixar o arquivo de legenda é o resultado que a maioria dos usuários quer (para subir no YouTube ou num player). Os geradores de SRT/VTT existem; falta a tela que entrega o arquivo e impede baixar uma legenda com erros.

## What Changes

- Tela `/export` com a opção "Somente legenda": formato SRT (padrão) ou VTT, nome do arquivo `<nome-do-vídeo>.srt|.vtt` e botão "Baixar legenda".
- Download do arquivo em UTF-8 gerado no navegador; a sessão é marcada como baixada (ir para o início não pede mais confirmação) e a tela confirma o download.
- Erros de validação bloqueiam o download e mostram um aviso com atalho "Corrigir no editor"; avisos não bloqueiam.
- Botão "Voltar ao editor".

### Fora do escopo

- Vídeo com legenda embutida ou selecionável (`add-video-export`).
- Tela de finalização (`add-completion-screen`).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `subtitle-export`: ganha os requisitos da tela de download da legenda (os de formato e importação não mudam).

## Impact

- Novos `src/features/export/ExportPage.tsx` e `src/lib/download.ts`; rota `/export`; traduções.
