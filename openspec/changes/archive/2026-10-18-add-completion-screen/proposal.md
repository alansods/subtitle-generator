# Proposal

## Why

Depois de baixar, o usuário precisa de um fechamento claro: confirmar que deu certo e escolher entre ajustar mais alguma coisa neste vídeo ou começar outro. Sem isso ele fica na tela de exportação sem saber se acabou.

## What Changes

- Tela `/done` ("Pronto!"): confirma o download com o nome do arquivo, "Baixar de novo", "Voltar a editar este vídeo" e "Fazer nova legenda", e lembra que nada foi guardado.
- Guarda: sem download realizado, `/done` leva à exportação (ou às guardas já existentes, sem vídeo ou sem cues).
- "Fazer nova legenda" vai para o início sem pedir confirmação (a legenda já foi baixada) e descarta a sessão.
- **Mudança de comportamento:** baixar a legenda na exportação passa a levar para `/done`.

### Fora do escopo

- Download de vídeo (`add-video-export`), que também levará para `/done`.

## Capabilities

### New Capabilities

- `completion`: tela de finalização e suas ações.

### Modified Capabilities

- `subtitle-export`: "Baixar a legenda" passa a navegar para `/done` depois do download.

## Impact

- Nova rota `src/routes/done.tsx`, `src/features/completion/DonePage.tsx`, guarda `requireDownload`, `ExportPage` navega após baixar; traduções.
