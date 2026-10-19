## MODIFIED Requirements

### Requirement: Lista de legendas
O editor SHALL listar as cues em ordem com número, início e fim (`mm:ss.mmm`) e texto; a cue ativa MUST ficar destacada com o rótulo visível "Tocando agora", sem borda colorida (borda colorida é reservada ao erro), e ativar o número de uma cue MUST levar o vídeo ao início dela.

#### Scenario: Ir para uma cue
- **WHEN** o usuário ativa o número da cue 2, que começa em 4,4 s
- **THEN** o tempo atual do vídeo passa a 4,4 s e a cue 2 fica destacada com "Tocando agora", e nenhuma outra cue mostra esse rótulo
