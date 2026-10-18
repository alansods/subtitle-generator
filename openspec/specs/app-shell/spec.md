# app-shell Specification

## Purpose
Define o esqueleto comum a todas as telas: cabeçalho com marca, idioma e tema, rodapé de privacidade, stepper das etapas e página de rota inexistente.

## Requirements

### Requirement: Cabeçalho em todas as telas
Toda tela SHALL exibir um cabeçalho com o logo e o nome do app como link para o início, o seletor de idioma e o botão de tema.

#### Scenario: Cabeçalho presente
- **WHEN** qualquer rota é aberta, incluindo uma rota inexistente
- **THEN** o cabeçalho mostra o nome do app, o seletor de idioma e o botão de tema

#### Scenario: Marca leva ao início
- **WHEN** o usuário ativa o link do nome do app
- **THEN** a aplicação navega para `/`

### Requirement: Seletor de idioma no cabeçalho
O seletor de idioma SHALL mostrar as opções PT e EN, indicar a opção ativa com `aria-pressed` e trocar o idioma da interface ao ser ativado.

#### Scenario: Trocar idioma pelo cabeçalho
- **WHEN** a interface está em português e o usuário ativa EN
- **THEN** os textos da interface passam para inglês
- **AND** EN fica com `aria-pressed="true"` e PT com `aria-pressed="false"`

### Requirement: Botão de tema no cabeçalho
O botão de tema SHALL alternar entre claro e escuro e MUST ter um rótulo acessível que descreve a ação disponível.

#### Scenario: Alternar para escuro
- **WHEN** o tema aplicado é claro e o usuário ativa o botão de tema
- **THEN** o tema aplicado passa a ser escuro
- **AND** o rótulo do botão passa a descrever a ativação do tema claro

### Requirement: Rodapé de privacidade
Toda tela SHALL exibir no rodapé a mensagem de que o vídeo não sai do computador e nada fica salvo.

#### Scenario: Rodapé presente
- **WHEN** a página inicial é aberta
- **THEN** o rodapé mostra a mensagem de privacidade no idioma ativo

### Requirement: Stepper das etapas
As telas de transcrição, edição e exportação SHALL exibir um stepper Transcrever → Editar → Exportar com a etapa atual marcada com `aria-current="step"`; etapas indisponíveis MUST aparecer desabilitadas e não navegáveis.

#### Scenario: Etapa atual destacada
- **WHEN** a tela de edição é aberta
- **THEN** o stepper mostra as três etapas na ordem e a etapa Editar tem `aria-current="step"`

#### Scenario: Etapa indisponível
- **WHEN** o stepper é renderizado com a etapa Exportar indisponível
- **THEN** a etapa Exportar está desabilitada e ativá-la não muda a rota

#### Scenario: Navegar por uma etapa disponível
- **WHEN** a tela de edição está aberta e o usuário ativa a etapa Transcrever
- **THEN** a aplicação navega para `/transcribe`

### Requirement: Página não encontrada
Uma rota inexistente SHALL mostrar a mensagem "Página não encontrada" e um link para o início.

#### Scenario: Rota inexistente
- **WHEN** o usuário abre `/rota-inexistente`
- **THEN** a tela mostra "Página não encontrada" e um link que leva a `/`
