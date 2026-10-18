# Spec Delta

## MODIFIED Requirements

### Requirement: Baixar a legenda
"Baixar legenda" SHALL gerar o arquivo no formato escolhido, em UTF-8, com as cues da sessão, iniciar o download com o nome mostrado, marcar a sessão como baixada e navegar para a tela de finalização `/done`.

#### Scenario: Baixar SRT
- **WHEN** a sessão tem 2 cues e o usuário baixa em SRT
- **THEN** o navegador recebe o arquivo `reuniao.srt` com as 2 cues no formato SRT
- **AND** a sessão fica marcada como baixada
- **AND** a aplicação vai para `/done`

#### Scenario: Início depois de baixar
- **WHEN** o usuário baixou a legenda e vai para o início
- **THEN** não há pedido de confirmação de descarte
