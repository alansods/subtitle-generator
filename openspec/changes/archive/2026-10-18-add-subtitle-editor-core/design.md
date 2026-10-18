# Design

## Context

Ver proposal.md. Cues na sessão (Zustand, só memória); o vídeo é uma object URL. Requisitos em `specs/subtitle-editor/spec.md`.

## Decisions

- **D1. Store de reprodução separada.** `usePlayback` (Zustand) guarda `time`, `duration`, `playing`, `rate`, `volume`; `playback` expõe `attach(video)`, `play`, `pause`, `toggle`, `seek`, `setRate`, `setVolume`. Enquanto toca, um laço `requestAnimationFrame` lê `video.currentTime`; `timeupdate`/`seeked` cobrem o pausado. Componentes assinam só o que usam: a legenda e a lista assinam o id da cue ativa (re-render só quando ela muda), os controles assinam o tempo.
- **D2. Operações puras.** `src/features/editor/cueOps.ts` com `activeCueAt`, `nudgeCue`, `splitCue`, `mergeWithNext`, `deleteCue`, `insertAfter` e `addCueAt`, todas devolvendo um novo array ordenado e aplicadas via `setCues`. Testáveis sem DOM.
- **D3. Legenda sobreposta com unidades do contêiner.** O contêiner do vídeo tem `container-type: size`; a legenda usa `font-size` em `cqh` (5,5% da altura no tamanho M) e margem vertical de 6 cqh, para escalar igual ao vídeo exportado depois. O estilo padrão (preto, M, embaixo) vira configurável em `add-subtitle-style`.
- **D4. Edição inline.** A legenda é um `<button>` (acessível por teclado); em edição vira `<textarea>` com `autoFocus`. `Enter` sem Shift salva, `Esc` cancela; `blur` salva se ainda estiver em edição.
- **D5. Seguir vídeo.** Quando a cue ativa muda e o toggle está ligado, a lista ajusta seu próprio `scrollTop` para o item (não usa `scrollIntoView`, que rolaria a página).
- **D6. Tempo exibido.** `formatClock(t)` → `mm:ss.mmm` (com horas quando ≥ 1 h).

## Risks / Trade-offs

- [Re-render a 60 fps] → Seletores estreitos; só o rótulo de tempo e a barra de posição mudam a cada frame.
- [jsdom não reproduz mídia] → Testes simulam `currentTime` e eventos de mídia.
