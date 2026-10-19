# video-export Specification

## Purpose
Define a exportação do vídeo com a legenda gravada na imagem, gerada no próprio navegador, no estilo escolhido: opção na tela de exportação, prévia, geração, progresso, cancelamento e download.

## Requirements

### Requirement: Opção de vídeo com legenda
A tela de exportação SHALL oferecer "Vídeo com legenda" ao lado de "Somente legenda"; escolhida, ela MUST mostrar o painel de estilo, uma prévia num quadro do vídeo, o nome do arquivo `<nome do vídeo>-legendado.mp4` (em inglês, `<nome do vídeo>-subtitled.mp4`) e o botão "Gerar vídeo".

#### Scenario: Escolher vídeo com legenda
- **WHEN** o vídeo da sessão é `reuniao.mp4` e o usuário escolhe "Vídeo com legenda"
- **THEN** a tela mostra o painel de estilo, a prévia, o nome `reuniao-legendado.mp4` e o botão "Gerar vídeo"

#### Scenario: Nome em inglês
- **WHEN** a interface está em inglês, o vídeo da sessão é `meeting.mp4` e o usuário escolhe "Video with subtitles"
- **THEN** o nome do arquivo é `meeting-subtitled.mp4`

### Requirement: Prévia no estilo escolhido
A prévia SHALL mostrar um quadro do vídeo no início da primeira legenda, com essa legenda desenhada no estilo atual; mudar o estilo MUST atualizar a prévia.

#### Scenario: Prévia acompanha o estilo
- **WHEN** o usuário escolhe fundo branco no painel da exportação
- **THEN** a legenda da prévia passa a ter fundo branco e texto preto

### Requirement: Legenda gravada no vídeo
O vídeo SHALL ser gerado no navegador com ffmpeg.wasm, desenhando a legenda a partir de um arquivo ASS com `PlayResX`/`PlayResY` iguais às dimensões do vídeo e o `force_style` do estilo atual, com a fonte Inter disponível ao ffmpeg, vídeo H.264 e áudio AAC num MP4; o core multi-thread MUST ser usado quando a página está isolada (`crossOriginIsolated`).

#### Scenario: Comando de gravação
- **WHEN** o vídeo `reuniao.mp4` de 1920×1080 é exportado com fundo preto, tamanho M, embaixo
- **THEN** o ffmpeg recebe o filtro `subtitles` com o arquivo ASS, `fontsdir` com a Inter e o `force_style` desse estilo, e gera `libx264` com `aac` em MP4

#### Scenario: Arquivo ASS na resolução do vídeo
- **WHEN** as cues são convertidas em ASS para um vídeo de 1280×720
- **THEN** o arquivo tem `PlayResX: 1280`, `PlayResY: 720` e uma linha `Dialogue` por cue, com quebras de linha como `\N`

#### Scenario: Core multi-thread
- **WHEN** a página está isolada (`crossOriginIsolated` verdadeiro)
- **THEN** o ffmpeg é carregado com o core multi-thread

### Requirement: Progresso e cancelamento
Durante a geração, a tela SHALL mostrar "Preparando" e depois "Gerando vídeo" com porcentagem e tempo restante estimado, e um botão "Cancelar" que interrompe a geração e volta à tela anterior; sair da tela durante a geração MUST pedir confirmação e cancelar.

#### Scenario: Andamento
- **WHEN** a geração chegou a 40%
- **THEN** a tela mostra "Gerando vídeo" com 40% e a barra de progresso em 40

#### Scenario: Cancelar a geração
- **WHEN** o usuário cancela no meio da geração
- **THEN** a geração é interrompida e a tela volta a mostrar "Gerar vídeo"

#### Scenario: Sair durante a geração
- **WHEN** a geração está em andamento e o usuário tenta ir para o editor
- **THEN** a aplicação pede confirmação; confirmando, cancela e vai para `/edit`

### Requirement: Conclusão do vídeo
Ao terminar, o app SHALL baixar o MP4 com o nome mostrado, marcar a sessão como baixada (vídeo) e ir para a tela Pronto.

#### Scenario: Vídeo pronto
- **WHEN** a geração termina
- **THEN** o navegador recebe `reuniao-legendado.mp4` e a aplicação vai para `/done` com "Pronto! Seu vídeo foi baixado."

### Requirement: Erros bloqueiam a geração
Com erros de validação nas cues, "Gerar vídeo" SHALL ficar desabilitado, como o download da legenda.

#### Scenario: Legenda com erro
- **WHEN** uma das cues tem texto vazio e a opção é "Vídeo com legenda"
- **THEN** "Gerar vídeo" está desabilitado

### Requirement: Falha na geração
Se a geração falhar, a tela SHALL mostrar uma mensagem de erro e permitir tentar de novo.

#### Scenario: Erro do ffmpeg
- **WHEN** o ffmpeg termina com erro
- **THEN** a tela mostra que não foi possível gerar o vídeo e o botão "Tentar de novo"
