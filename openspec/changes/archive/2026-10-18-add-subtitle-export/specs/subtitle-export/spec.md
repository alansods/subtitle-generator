# Spec Delta

## ADDED Requirements

### Requirement: Tela de download da legenda
A tela de exportação SHALL oferecer "Somente legenda" com escolha de formato SRT (padrão) ou VTT e mostrar o nome do arquivo `<nome do vídeo>.<extensão>`.

#### Scenario: Nome do arquivo
- **WHEN** o vídeo da sessão é `reuniao.mp4` e o formato escolhido é VTT
- **THEN** a tela mostra o nome de arquivo `reuniao.vtt`

### Requirement: Baixar a legenda
"Baixar legenda" SHALL gerar o arquivo no formato escolhido, em UTF-8, com as cues da sessão, iniciar o download com o nome mostrado e marcar a sessão como baixada.

#### Scenario: Baixar SRT
- **WHEN** a sessão tem 2 cues e o usuário baixa em SRT
- **THEN** o navegador recebe o arquivo `reuniao.srt` com as 2 cues no formato SRT
- **AND** a sessão fica marcada como baixada

#### Scenario: Início depois de baixar
- **WHEN** o usuário baixou a legenda e vai para o início
- **THEN** não há pedido de confirmação de descarte

### Requirement: Erros bloqueiam o download
Com ao menos um erro de validação nas cues, o download SHALL ficar desabilitado e a tela MUST mostrar quantas legendas têm erro, com um atalho "Corrigir no editor"; avisos MUST NOT bloquear.

#### Scenario: Legenda com erro
- **WHEN** uma das cues tem texto vazio
- **THEN** "Baixar legenda" está desabilitado e a tela informa que 1 legenda tem erro

#### Scenario: Só avisos
- **WHEN** as cues têm apenas avisos
- **THEN** "Baixar legenda" está habilitado

### Requirement: Voltar ao editor
A tela de exportação SHALL ter "Voltar ao editor", que leva para `/edit`.

#### Scenario: Voltar
- **WHEN** o usuário ativa "Voltar ao editor"
- **THEN** a aplicação vai para `/edit`
