# Proposal

## Why

Todas as telas compartilham o mesmo esqueleto: cabeçalho com marca, idioma e tema, rodapé de privacidade, e um stepper nas etapas Transcrever → Editar → Exportar. Sem ele, cada tela reinventaria navegação e controles globais.

## What Changes

- Layout raiz com cabeçalho (logo + nome levando ao início, toggle PT | EN, botão de tema), conteúdo central com largura máxima e rodapé "Seu vídeo não sai do seu computador e nada fica salvo."
- Layout das etapas (rota sem caminho próprio) com stepper Transcrever → Editar → Exportar, etapa atual destacada e etapas indisponíveis não clicáveis.
- Rotas `/transcribe`, `/edit` e `/export` criadas com o título da etapa (o conteúdo chega nas mudanças de cada etapa).
- Página 404 "Página não encontrada" com link para o início.
- Componente `Button` com as variantes da identidade (principal em pílula violeta, secundário neutro, perigo).

### Fora do escopo

- Regras de disponibilidade das etapas e guardas de rota (dependem da sessão, `add-session`); nesta mudança todas as etapas ficam disponíveis.
- Conteúdo da página inicial (`add-video-upload`) e das etapas.

## Capabilities

### New Capabilities

- `app-shell`: cabeçalho, rodapé, stepper das etapas e página 404.

### Modified Capabilities

Nenhuma.

## Impact

- `src/routes/__root.tsx` (layout e 404), novo `src/routes/_steps.tsx` e rotas filhas, `src/app/` (Header, Footer, Stepper), `src/components/Button.tsx`, chaves novas nos arquivos de tradução.
