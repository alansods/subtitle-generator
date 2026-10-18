# theming Specification

## Purpose
Define como a interface escolhe, aplica e lembra o tema claro ou escuro, sem flash na carga, com contraste acessível e sem interferir na aparência da legenda sobre o vídeo.

## Requirements

### Requirement: Modos de tema
A interface SHALL suportar os modos `light`, `dark` e `system`; no modo `system`, o tema aplicado MUST seguir a preferência de cor do sistema operacional.

#### Scenario: Sistema escuro sem escolha salva
- **WHEN** não há tema salvo e o sistema prefere cores escuras
- **THEN** a interface abre no tema escuro

#### Scenario: Escolha salva vence o sistema
- **WHEN** o tema salvo é `light` e o sistema prefere cores escuras
- **THEN** a interface abre no tema claro

#### Scenario: Valor salvo inválido
- **WHEN** o valor salvo em `gdl:theme` não é um modo válido
- **THEN** a interface usa o modo `system`

### Requirement: Alternância e persistência
Alternar o tema SHALL trocar entre claro e escuro a partir do tema aplicado no momento e MUST salvar o modo escolhido na chave `gdl:theme` do `localStorage`.

#### Scenario: Alternar a partir do sistema escuro
- **WHEN** o modo é `system`, o sistema prefere escuro e o usuário alterna o tema
- **THEN** o tema aplicado passa a ser claro
- **AND** `gdl:theme` vale `light`

### Requirement: Sem flash de tema errado
O tema SHALL ser aplicado ao elemento `<html>` (classe `dark`) por um script executado antes da renderização da aplicação.

#### Scenario: Classe aplicada antes do app
- **WHEN** o script de tema do `index.html` é executado com `gdl:theme` igual a `dark`
- **THEN** o elemento `<html>` já tem a classe `dark` antes de a aplicação montar

#### Scenario: Armazenamento bloqueado
- **WHEN** o script de tema é executado e o `localStorage` lança erro
- **THEN** o script não lança erro e aplica o tema do sistema

### Requirement: Acompanhar o sistema
No modo `system`, uma mudança na preferência de cor do sistema SHALL atualizar o tema aplicado sem recarregar a página.

#### Scenario: Sistema muda para escuro
- **WHEN** o modo é `system` e o sistema passa de claro para escuro
- **THEN** o elemento `<html>` ganha a classe `dark`

### Requirement: Contraste acessível
Os pares de texto e fundo dos dois temas SHALL ter contraste de pelo menos 4,5:1 (nível AA para texto normal).

#### Scenario: Contraste dos tokens
- **WHEN** os pares texto/fundo dos tokens claro e escuro são avaliados
- **THEN** todos têm razão de contraste maior ou igual a 4,5
