# Proposal

## Why

A legenda automática sempre precisa de revisão. O diferencial do app é revisar assistindo: a legenda aparece sobre o vídeo no tempo certo e um clique no texto permite corrigir ali mesmo, sem procurar a linha num arquivo.

## What Changes

- Tela `/edit` com player (à esquerda) e lista de legendas (à direita; empilhados em telas estreitas) e botão "Exportar".
- Player com controles próprios: reproduzir/pausar, posição, tempo atual/total, velocidade (0,5× a 2×), volume e tela cheia.
- Legenda sobre o vídeo sincronizada com o tempo de reprodução (estilo padrão: fundo preto, tamanho médio, embaixo).
- Clicar na legenda pausa e abre a edição: Enter salva, Shift+Enter quebra linha, Esc cancela, clicar fora salva.
- Sem legenda no momento atual: "+ Adicionar legenda aqui" cria uma cue a partir desse ponto e abre a edição.
- Lista de legendas: número (leva ao início da cue), início e fim com ajuste de ±0,1 s, texto editável, destaque da cue ativa, "Seguir vídeo" (rola até a ativa).
- Ações por cue: dividir no cursor, juntar com a próxima, excluir, inserir depois.
- Trocar o idioma da interface não altera o texto das legendas.

### Fora do escopo

- Indicadores de validação (`add-subtitle-validation`), painel de estilo (`add-subtitle-style`), timeline (`add-editor-timeline`), atalhos/desfazer/buscar (`add-editor-shortcuts-and-history`).

## Capabilities

### New Capabilities

- `subtitle-editor`: player, legenda em tempo real, edição inline, lista de cues e ações por cue.

### Modified Capabilities

Nenhuma.

## Impact

- Novos `src/features/editor/` (página, player, overlay, lista, operações puras de cue, store de reprodução); rota `/edit`; traduções.
