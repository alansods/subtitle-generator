# Spec Delta

## MODIFIED Requirements

### Requirement: Progresso em etapas
Durante o processamento, a tela SHALL mostrar as etapas Preparando, Extraindo áudio, Transcrevendo e Separando em legendas, com a porcentagem da etapa atual e uma barra geral, e MUST anunciar o andamento numa região `aria-live`. Os rótulos MUST NOT mencionar primeira vez, download ou cache.

#### Scenario: Andamento visível
- **WHEN** a transcrição já processou metade dos trechos do áudio
- **THEN** a etapa Transcrevendo mostra 50%
- **AND** as etapas Preparando e Extraindo áudio aparecem como concluídas
