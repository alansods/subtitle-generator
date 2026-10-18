# Spec Delta

## Purpose

Define as garantias de infraestrutura do projeto: isolamento cross-origin em todos os ambientes, inicialização da aplicação sem erros e os comandos de qualidade que toda mudança precisa passar antes de ser arquivada.

## ADDED Requirements

### Requirement: Isolamento cross-origin em todos os ambientes
Toda resposta servida pela aplicação SHALL incluir `Cross-Origin-Opener-Policy: same-origin` e `Cross-Origin-Embedder-Policy: credentialless` no servidor de desenvolvimento, no servidor de preview do build e na configuração de hospedagem estática, de modo que `crossOriginIsolated` seja `true` no navegador.

#### Scenario: Servidor de desenvolvimento isolado
- **WHEN** a aplicação é aberta no navegador a partir do servidor de desenvolvimento
- **THEN** as respostas incluem os headers `Cross-Origin-Opener-Policy: same-origin` e `Cross-Origin-Embedder-Policy: credentialless`
- **AND** `window.crossOriginIsolated` é `true`

#### Scenario: Build de produção isolado
- **WHEN** o build de produção é servido pelo servidor de preview e aberto no navegador
- **THEN** `window.crossOriginIsolated` é `true`

#### Scenario: Configuração de hospedagem declara os headers
- **WHEN** o arquivo de headers da hospedagem estática é lido
- **THEN** ele aplica `Cross-Origin-Opener-Policy: same-origin` e `Cross-Origin-Embedder-Policy: credentialless` a todos os caminhos (`/*`)

### Requirement: Aplicação inicializa sem erros
A aplicação SHALL montar a rota raiz no elemento raiz do documento sem gerar erros no console do navegador.

#### Scenario: Carga inicial limpa
- **WHEN** a página inicial é carregada no navegador
- **THEN** o elemento raiz contém a árvore renderizada pela rota raiz
- **AND** nenhuma mensagem de erro é registrada no console

### Requirement: Tipagem estrita sem erros
O código-fonte SHALL ser verificado pelo compilador TypeScript em modo estrito, e o comando de verificação de tipos MUST terminar sem erros.

#### Scenario: Verificação de tipos passa
- **WHEN** o comando de verificação de tipos é executado
- **THEN** ele termina com código de saída 0

#### Scenario: Erro de tipo é detectado
- **WHEN** um arquivo de `src/` contém uma atribuição de tipo incompatível
- **THEN** o comando de verificação de tipos termina com código de saída diferente de 0

### Requirement: Lint e formatação consistentes
O projeto SHALL ter comandos de lint e de checagem de formatação, e ambos MUST terminar sem erros no código versionado.

#### Scenario: Lint passa
- **WHEN** o comando de lint é executado
- **THEN** ele termina com código de saída 0

#### Scenario: Formatação conferida
- **WHEN** o comando de checagem de formatação é executado
- **THEN** ele termina com código de saída 0

### Requirement: Suítes de teste executáveis
O projeto SHALL ter um comando para testes unitários e de componentes e outro para testes end-to-end no navegador, e ambos MUST terminar sem falhas.

#### Scenario: Testes unitários e de componentes
- **WHEN** o comando de testes unitários é executado
- **THEN** todos os testes passam e ele termina com código de saída 0

#### Scenario: Testes end-to-end
- **WHEN** o comando de testes end-to-end é executado
- **THEN** o navegador é iniciado contra a aplicação, todos os testes passam e ele termina com código de saída 0

### Requirement: Comando agregado de qualidade
O projeto SHALL ter um único comando de qualidade que roda verificação de tipos, lint, checagem de formatação e testes unitários, e que falha se qualquer um deles falhar.

#### Scenario: Qualidade agregada passa
- **WHEN** o comando agregado de qualidade é executado num repositório sem problemas
- **THEN** ele termina com código de saída 0

#### Scenario: Qualidade agregada falha com qualquer etapa
- **WHEN** qualquer uma das etapas (tipos, lint, formatação ou testes) falha
- **THEN** o comando agregado termina com código de saída diferente de 0

### Requirement: Build estático de produção
O projeto SHALL gerar um build estático de produção que inclui o arquivo de headers da hospedagem na raiz da saída.

#### Scenario: Build gera artefatos estáticos
- **WHEN** o comando de build é executado
- **THEN** ele termina com código de saída 0
- **AND** a pasta de saída contém `index.html` e o arquivo `_headers`

### Requirement: Catálogo de componentes
O projeto SHALL ter um catálogo de componentes que compila como site estático, com suporte aos temas claro e escuro desde o início.

#### Scenario: Catálogo compila
- **WHEN** o comando de build do catálogo de componentes é executado
- **THEN** ele termina com código de saída 0

### Requirement: Integração contínua
Todo push e pull request SHALL disparar uma pipeline que roda o comando agregado de qualidade, o build de produção e os testes end-to-end, falhando se qualquer um deles falhar.

#### Scenario: Pipeline executa as verificações
- **WHEN** a definição da pipeline de CI é lida
- **THEN** ela é disparada em `push` e `pull_request`
- **AND** executa o comando agregado de qualidade, o build e os testes end-to-end
