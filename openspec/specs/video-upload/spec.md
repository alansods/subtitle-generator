# video-upload Specification

## Purpose
Define a página inicial e como o vídeo entra no app: como o usuário escolhe o arquivo, o que é aceito ou recusado e o que acontece depois de aceito.

## Requirements

### Requirement: Página inicial explica o uso
A página inicial SHALL apresentar um título, os benefícios (grátis, sem conta, o vídeo fica no computador, nada fica salvo) e o passo a passo em 4 etapas (escolher o vídeo, gerar a legenda, revisar assistindo, baixar) com as opções disponíveis em cada uma; ela MUST NOT anunciar opções que o app não oferece, e os nomes de arquivo de exemplo MUST seguir o idioma da interface.

#### Scenario: Passo a passo visível
- **WHEN** a página inicial é aberta
- **THEN** ela mostra os 4 passos na ordem: escolher o vídeo, gerar a legenda, revisar assistindo e baixar

#### Scenario: Só opções que existem
- **WHEN** a página inicial é aberta
- **THEN** ela não menciona "Desfazer e refazer" nem "legenda que liga e desliga"

#### Scenario: Exemplos no idioma da interface
- **WHEN** a interface está em inglês e a página inicial é aberta
- **THEN** os nomes de exemplo são `team-meeting.mp4`, `team-meeting.srt`, `team-meeting.vtt` e `team-meeting-subtitled.mp4`

### Requirement: Seleção do arquivo
O usuário SHALL poder escolher o vídeo pelo botão "Selecionar vídeo" ou arrastando o arquivo para a área de upload.

#### Scenario: Selecionar pelo botão
- **WHEN** o usuário ativa "Selecionar vídeo" e escolhe um arquivo válido
- **THEN** o arquivo é validado e, aceito, a aplicação vai para `/transcribe`

#### Scenario: Arrastar e soltar
- **WHEN** o usuário solta um arquivo de vídeo válido na área de upload
- **THEN** o arquivo é validado e, aceito, a aplicação vai para `/transcribe`

### Requirement: Formatos aceitos
Só arquivos MP4, WebM ou MOV SHALL ser aceitos; outros MUST ser recusados com mensagem de erro, sem alterar a sessão.

#### Scenario: Formato não suportado
- **WHEN** o usuário escolhe `apresentacao.pdf`
- **THEN** aparece um erro dizendo que só MP4, WebM e MOV são aceitos
- **AND** a sessão continua sem vídeo

### Requirement: Limite de tamanho
Arquivos acima de 500 MB SHALL ser recusados com erro; arquivos acima de 200 MB e até 500 MB SHALL mostrar um aviso de lentidão e só seguir se o usuário escolher "Continuar mesmo assim".

#### Scenario: Acima do limite
- **WHEN** o usuário escolhe um vídeo de 742 MB
- **THEN** aparece um erro informando o tamanho e o limite de 500 MB

#### Scenario: Arquivo grande
- **WHEN** o usuário escolhe um vídeo válido de 312 MB
- **THEN** aparece um aviso de que a transcrição pode ficar lenta, com "Continuar mesmo assim"
- **AND** ao escolher continuar, a aplicação vai para `/transcribe`

### Requirement: Vídeo reproduzível
Um arquivo que o navegador não consegue reproduzir SHALL ser recusado com mensagem de erro que sugere converter para MP4 (H.264).

#### Scenario: Codec não suportado
- **WHEN** o navegador não consegue ler os metadados do vídeo escolhido
- **THEN** aparece um erro dizendo que o navegador não reproduz o vídeo e sugerindo converter para MP4 (H.264)
- **AND** a sessão continua sem vídeo

### Requirement: Vídeo aceito inicia a sessão
Um vídeo aceito SHALL ser colocado na sessão com nome (sem extensão), nome do arquivo, tipo, tamanho, duração, largura e altura, e a aplicação SHALL navegar para `/transcribe`.

#### Scenario: Dados do vídeo na sessão
- **WHEN** o vídeo `reuniao-equipe.webm` de 3 s e 320×180 é aceito
- **THEN** a sessão tem o vídeo com nome `reuniao-equipe`, duração de cerca de 3 s, largura 320 e altura 180
