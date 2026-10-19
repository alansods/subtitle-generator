## MODIFIED Requirements

### Requirement: Stepper das etapas
As telas de transcrição, edição e exportação SHALL exibir, na linha do título, um stepper Gerar legenda → Revisar → Baixar com a etapa atual marcada com `aria-current="step"` e as etapas anteriores marcadas como concluídas (✓); etapas indisponíveis MUST aparecer desabilitadas e não navegáveis.

#### Scenario: Etapa atual destacada
- **WHEN** a tela de edição é aberta
- **THEN** o stepper mostra as três etapas na ordem, a etapa Revisar tem `aria-current="step"` e a etapa Gerar legenda aparece como concluída

#### Scenario: Etapa indisponível
- **WHEN** o stepper é renderizado com a etapa Baixar indisponível
- **THEN** a etapa Baixar está desabilitada e ativá-la não muda a rota

#### Scenario: Navegar por uma etapa disponível
- **WHEN** a tela de edição está aberta e o usuário ativa a etapa Gerar legenda
- **THEN** a aplicação navega para `/transcribe`

## ADDED Requirements

### Requirement: Voltar e Avançar
Cada etapa SHALL terminar com a navegação "← Voltar" (etapa anterior) e "Avançar →" (próxima etapa), separada do conteúdo por uma linha; a primeira etapa MUST NOT ter Voltar, a última MUST NOT ter Avançar, e Avançar MUST ficar desabilitado enquanto a próxima etapa não estiver disponível.

#### Scenario: Avançar da revisão
- **WHEN** o usuário ativa "Avançar" na tela de edição
- **THEN** a aplicação vai para `/export`

#### Scenario: Voltar da exportação
- **WHEN** o usuário ativa "Voltar" na tela de exportação
- **THEN** a aplicação vai para `/edit` e não há "Avançar" na tela

#### Scenario: Avançar sem legenda
- **WHEN** a tela de transcrição é aberta e a sessão ainda não tem cues
- **THEN** não há "Voltar" e "Avançar" está desabilitado
