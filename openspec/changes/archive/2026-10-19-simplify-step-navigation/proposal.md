# Proposal

## Why

O botão "Exportar" do editor ficava colado no stepper e tinha o mesmo nome da etapa Exportar, embora só abrisse a próxima tela. A navegação entre as etapas não era clara: cada tela tinha um botão diferente, em lugares diferentes. Proposta aprovada no protótipo navegável.

## What Changes

- Etapas renomeadas: "Gerar legenda → Revisar → Baixar" (en: "Generate subtitles → Review → Download"); títulos "Revisar legenda" e "Baixar".
- Stepper na mesma linha do título, à direita (no celular, acima do título); etapas concluídas com ✓.
- Navegação tradicional no fim de cada etapa, depois de uma linha divisória: "← Voltar" à esquerda e "Avançar →" à direita. Sem Voltar na primeira etapa; sem Avançar na última (ela termina no download). Avançar fica desabilitado enquanto a próxima etapa não está disponível.
- Saem o botão "Exportar" do topo do editor e "Voltar ao editor" do topo da exportação.
- Idioma falado no vídeo passa a ser uma lista de seleção.

### Fora do escopo

- Rotas, guardas, confirmação ao sair, tela Pronto e validação.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `app-shell`: stepper com os novos nomes e ✓; novo requisito "Voltar e Avançar".
- `transcription`: idioma como lista de seleção.
- `subtitle-editor`: remove "Ir para a exportação" (coberto por "Voltar e Avançar").
- `subtitle-export`: remove "Voltar ao editor" (coberto por "Voltar e Avançar").

## Impact

- `src/routes/_steps.tsx`, `src/app/Stepper.tsx`, novo `src/app/StepNav.tsx`, `src/features/{transcription,editor,export}/*Page.tsx`, `src/i18n/locales/*.json`, testes de unidade e e2e que usam os nomes antigos.
