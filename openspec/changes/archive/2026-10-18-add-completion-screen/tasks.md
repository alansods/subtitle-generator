# Tasks

## 1. Tela de finalização

- [x] 1.1 Criar a guarda `requireDownload`, a rota `/done` e `DonePage`; testes "Scenario: Confirmação do download", "Scenario: Sem download", "Scenario: Segundo download", "Scenario: Voltar ao editor" e "Scenario: Começar outra".
- [x] 1.2 Exportação navega para `/done` depois de baixar; atualizar o teste "Scenario: Baixar SRT" e o e2e do fluxo completo (upload → gerar → editar → exportar → pronto → nova legenda).

## 2. Verificação

- [x] 2.1 `openspec validate add-completion-screen --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; textos nos dois idiomas.
