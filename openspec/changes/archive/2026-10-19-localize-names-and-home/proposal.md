# Proposal

## Why

As capturas do README com a interface em inglês mostraram três problemas: o vídeo exportado sai como `<nome>-legendado.mp4` mesmo em inglês; a página inicial anuncia "Vídeo com legenda que liga e desliga" (descartado) e "Desfazer e refazer" (ainda não existe); e os nomes de exemplo da página inicial (`reuniao-equipe`) aparecem em português na versão em inglês.

## What Changes

- Sufixo do vídeo exportado no idioma da interface: `-legendado` (pt-BR) e `-subtitled` (en).
- Página inicial: saem "legenda que liga e desliga" e "Desfazer e refazer"; entra "Divida e junte" (existe no editor). Os nomes de exemplo seguem o idioma (`reuniao-equipe` / `team-meeting`).
- Capturas do README refeitas.

### Fora do escopo

- Implementar desfazer/refazer (fica para a mudança de atalhos e histórico).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `video-export`: nome do arquivo de vídeo com sufixo no idioma da interface.
- `video-upload`: a página inicial só lista opções que existem, com exemplos no idioma da interface.

## Impact

- `src/features/export/VideoExportPanel.tsx`, `src/features/upload/HomePage.tsx`, `src/i18n/locales/*.json`, testes, `docs/screenshots/*.png`.
