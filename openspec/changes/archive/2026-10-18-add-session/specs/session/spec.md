# Spec Delta

## Purpose

Define a sessão de trabalho em memória (um vídeo por vez, nada persistido), quais etapas ela libera e como o usuário é protegido de perder uma legenda que ainda não baixou.

## ADDED Requirements

### Requirement: Sessão única em memória
A aplicação SHALL manter no máximo um vídeo por vez, com suas cues e o estado de download, apenas em memória; vídeo, cues e metadados MUST NOT ser gravados em `localStorage`, IndexedDB ou OPFS.

#### Scenario: Sessão começa vazia
- **WHEN** a aplicação é carregada
- **THEN** a sessão não tem vídeo, nem cues, nem download

#### Scenario: Nada é persistido
- **WHEN** um vídeo e cues são colocados na sessão
- **THEN** o `localStorage` não ganha nenhuma chave além das preferências de idioma e tema
- **AND** nenhum banco IndexedDB é aberto

#### Scenario: Novo vídeo substitui o anterior
- **WHEN** a sessão já tem um vídeo com cues e um novo vídeo é colocado nela
- **THEN** a sessão passa a ter só o novo vídeo, sem cues e sem download

### Requirement: Disponibilidade das etapas
A etapa Transcrever SHALL estar disponível quando a sessão tem vídeo; as etapas Editar e Exportar SHALL estar disponíveis quando a sessão tem ao menos uma cue.

#### Scenario: Só com vídeo
- **WHEN** a sessão tem vídeo e nenhuma cue
- **THEN** Transcrever está disponível e Editar e Exportar estão indisponíveis

#### Scenario: Com cues
- **WHEN** a sessão tem vídeo e cues
- **THEN** as três etapas estão disponíveis

### Requirement: Guardas de rota
Acessar uma etapa sem o que ela exige SHALL redirecionar: sem vídeo para `/`; com vídeo e sem cues, de `/edit` ou `/export` para `/transcribe`.

#### Scenario: Transcrever sem vídeo
- **WHEN** o usuário abre `/transcribe` sem vídeo na sessão
- **THEN** a aplicação vai para `/`

#### Scenario: Editar sem vídeo
- **WHEN** o usuário abre `/edit` sem vídeo na sessão
- **THEN** a aplicação vai para `/`

#### Scenario: Exportar sem cues
- **WHEN** o usuário abre `/export` com vídeo e sem cues
- **THEN** a aplicação vai para `/transcribe`

### Requirement: Descartar com confirmação
Navegar para o início SHALL descartar a sessão; quando há cues e a legenda não foi baixada desde a última edição, a aplicação MUST pedir confirmação antes, e cancelar MUST manter a sessão e a tela atual.

#### Scenario: Confirmar descarte
- **WHEN** a sessão tem cues não baixadas, o usuário vai para o início e confirma o descarte
- **THEN** a aplicação vai para `/` e a sessão fica vazia

#### Scenario: Cancelar descarte
- **WHEN** a sessão tem cues não baixadas, o usuário vai para o início e cancela
- **THEN** a aplicação continua na tela atual e a sessão mantém vídeo e cues

#### Scenario: Legenda já baixada
- **WHEN** a legenda foi baixada e não foi editada depois, e o usuário vai para o início
- **THEN** não há pedido de confirmação e a sessão fica vazia

#### Scenario: Edição depois do download
- **WHEN** a legenda foi baixada e depois uma cue foi editada
- **THEN** ir para o início volta a pedir confirmação

### Requirement: Aviso ao fechar a aba
Com cues não baixadas, fechar ou recarregar a aba SHALL disparar o aviso nativo de saída do navegador.

#### Scenario: Fechar com legenda não baixada
- **WHEN** a sessão tem cues não baixadas e o evento `beforeunload` ocorre
- **THEN** o evento é cancelado (o navegador mostra o aviso de saída)

#### Scenario: Fechar sem nada a perder
- **WHEN** a sessão não tem cues e o evento `beforeunload` ocorre
- **THEN** o evento não é cancelado
