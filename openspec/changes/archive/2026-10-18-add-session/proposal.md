# Proposal

## Why

O app é de uso único e não guarda nada: vídeo, legendas e estado de download precisam viver só na memória da aba. As etapas dependem desse estado (sem vídeo não há o que transcrever; sem legenda não há o que editar), e o usuário não pode perder uma legenda não baixada sem ser avisado.

## What Changes

- Store de sessão em memória (Zustand) com o vídeo atual, as cues e o download realizado; nada é gravado em IndexedDB, OPFS ou `localStorage`.
- Disponibilidade das etapas do stepper derivada da sessão.
- Guardas de rota: `/transcribe` exige vídeo; `/edit` e `/export` exigem cues.
- Ir para o início descarta a sessão; com legenda não baixada (ou editada depois do download), um diálogo pede confirmação antes.
- Fechar ou recarregar a aba com legenda não baixada dispara o aviso nativo do navegador.
- Tipos e schema Zod de `Cue`.

### Fora do escopo

- Upload do vídeo (`add-video-upload`), geração de cues (`add-transcription`) e download (`add-subtitle-export`); aqui só as operações da sessão que essas mudanças vão chamar.
- Bloqueio de saída durante processamento (`add-transcription`, `add-video-export`).

## Capabilities

### New Capabilities

- `session`: sessão em memória, disponibilidade das etapas, guardas, descarte com confirmação e aviso ao fechar a aba.

### Modified Capabilities

Nenhuma (o requisito do stepper em `app-shell` já prevê etapas indisponíveis; a sessão passa a fornecer a disponibilidade).

## Impact

- Novos `src/lib/session/` e `src/lib/subtitles/types.ts`; `_steps.tsx` e rotas de etapa ganham `beforeLoad`; layout raiz ganha o diálogo de descarte; dependência `zustand`; componente `alert-dialog` do shadcn.
