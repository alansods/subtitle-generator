# Design

## Context

Ver proposal.md. Router TanStack com rotas por arquivo; stepper aceita disponibilidade por etapa. Requisitos em `specs/session/spec.md`.

## Decisions

- **D1. Zustand sem middleware de persistência.** `src/lib/session/store.ts` exporta `useSession` com estado `{ video, cues, downloaded }` e ações `setVideo`, `setCues`, `updateCue`, `markDownloaded`, `reset`. `setVideo` revoga a object URL anterior e zera cues/download; `reset` revoga a URL. `setCues`/`updateCue` zeram `downloaded` (edição torna o download desatualizado). O histórico de undo (zundo) entra em `add-editor-shortcuts-and-history`.
- **D2. Seletores puros.** `selectors.ts` com `hasVideo`, `hasCues`, `hasUnsavedWork` (cues > 0 e `downloaded === null`) e `stepAvailability(state)`, testáveis sem React.
- **D3. Guardas via `beforeLoad`.** `guards.ts` com `requireVideo()` e `requireCues()` que lançam `redirect` do TanStack. `_steps/transcribe` usa `requireVideo`; `_steps/edit` e `_steps/export`, `requireCues` (que chama `requireVideo` antes).
- **D4. Descarte no layout raiz.** `DiscardGuard` usa `useBlocker({ shouldBlockFn: ({ next }) => next.pathname === '/' && hasUnsavedWork(...), withResolver: true, enableBeforeUnload: () => hasUnsavedWork(...) })` e um `AlertDialog` (shadcn) com "Descartar e começar outra" e "Continuar editando". A rota `/` chama `reset()` no `beforeLoad`, então qualquer chegada ao início (confirmada ou sem trabalho pendente) descarta a sessão.
- **D5. Tipos.** `src/lib/subtitles/types.ts` com `cueSchema` (Zod: `id`, `start`, `end`, `text`) e `Cue`; `SessionVideo` com `file`, `url`, `name`, `fileName`, `mimeType`, `sizeBytes`, `durationSec`, `width`, `height`.

## Risks / Trade-offs

- [Recarregar a página perde tudo] → É a decisão de produto; o aviso nativo cobre o caso de legenda não baixada.
- [`beforeunload` não permite texto customizado] → O navegador mostra a mensagem padrão.
