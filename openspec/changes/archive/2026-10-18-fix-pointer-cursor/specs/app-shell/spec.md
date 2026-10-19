## ADDED Requirements

### Requirement: Cursor de elemento clicável
Botões, links e controles habilitados (`select`, checkbox, controle deslizante) SHALL mostrar o cursor de mão (`pointer`) ao passar o mouse; controles desabilitados MUST NOT mostrá-lo.

#### Scenario: Botão habilitado
- **WHEN** o mouse passa sobre o botão de tema do cabeçalho
- **THEN** o cursor é `pointer`

#### Scenario: Botão desabilitado
- **WHEN** o mouse passa sobre um botão desabilitado
- **THEN** o cursor não é `pointer`
