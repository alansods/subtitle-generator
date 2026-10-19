# transcription Specification

## Purpose
Define como a legenda é gerada a partir do áudio do vídeo no próprio computador: o que o usuário escolhe, o que o app decide sozinho, como o progresso é mostrado, como cancelar e o que acontece ao terminar ou ao importar uma legenda pronta.

## Requirements

### Requirement: Tela de transcrição sem escolhas técnicas
A tela de transcrição SHALL mostrar o vídeo da sessão, a lista de seleção "Idioma falado no vídeo" (Português, Inglês, Detectar automaticamente), o botão "Gerar legenda" e o link para importar uma legenda existente; ela MUST NOT mostrar nome de modelo, tamanho de download, cache ou precisão de tempo.

#### Scenario: Idioma padrão
- **WHEN** a interface está em português e a tela de transcrição é aberta
- **THEN** a lista "Idioma falado no vídeo" está com "Português" selecionado

#### Scenario: Nada técnico na tela
- **WHEN** a tela de transcrição é aberta
- **THEN** nenhum texto menciona "whisper", "modelo", "MB" ou "cache"

### Requirement: Escolha automática do modelo
O app SHALL escolher o modelo sozinho: `whisper-small` quando o navegador tem WebGPU e `whisper-base` quando não tem; sem WebGPU, a tela MUST avisar que neste navegador a legenda demora mais.

#### Scenario: Com WebGPU
- **WHEN** o navegador tem um adaptador WebGPU
- **THEN** o modelo escolhido é `whisper-small` executado em WebGPU

#### Scenario: Sem WebGPU
- **WHEN** o navegador não tem WebGPU
- **THEN** o modelo escolhido é `whisper-base` executado em WASM
- **AND** a tela mostra o aviso "Neste navegador a legenda demora mais para ficar pronta."

### Requirement: Extração do áudio
O áudio SHALL ser extraído do vídeo em 16 kHz mono com a decodificação de áudio do navegador; se ela falhar, o app MUST extrair o áudio com ffmpeg.wasm.

#### Scenario: Mixagem para mono
- **WHEN** o áudio do vídeo tem dois canais
- **THEN** o áudio entregue à transcrição tem um canal, com a média dos dois

#### Scenario: Navegador não decodifica o áudio
- **WHEN** a decodificação de áudio do navegador falha
- **THEN** o áudio é extraído com ffmpeg.wasm e a transcrição continua

### Requirement: Transcrição fora da tela principal
A transcrição SHALL rodar num Web Worker, com tempos por palavra, no idioma escolhido (ou com detecção automática), sem bloquear a interface.

#### Scenario: Idioma enviado ao modelo
- **WHEN** o usuário escolhe "Inglês" e gera a legenda
- **THEN** a transcrição é pedida com o idioma `en` e tempos por palavra

#### Scenario: Detecção automática
- **WHEN** o usuário escolhe "Detectar automaticamente" e gera a legenda
- **THEN** a transcrição é pedida sem idioma definido

### Requirement: Progresso em etapas
Durante o processamento, a tela SHALL mostrar as etapas Preparando, Extraindo áudio, Transcrevendo e Separando em legendas, com a porcentagem da etapa atual e uma barra geral, e MUST anunciar o andamento numa região `aria-live`. Os rótulos MUST NOT mencionar primeira vez, download ou cache.

#### Scenario: Andamento visível
- **WHEN** a transcrição já processou metade dos trechos do áudio
- **THEN** a etapa Transcrevendo mostra 50%
- **AND** as etapas Preparando e Extraindo áudio aparecem como concluídas

### Requirement: Cancelar
O botão "Cancelar" SHALL encerrar o worker de transcrição e voltar a tela ao estado inicial, sem cues na sessão.

#### Scenario: Cancelar no meio
- **WHEN** a transcrição está em andamento e o usuário cancela
- **THEN** o worker é encerrado, a tela volta a mostrar "Gerar legenda" e a sessão continua sem cues

### Requirement: Sair durante o processamento
Sair da tela de transcrição durante o processamento SHALL pedir confirmação; confirmar MUST cancelar a transcrição e seguir a navegação, e desistir MUST manter a transcrição em andamento.

#### Scenario: Confirmar saída
- **WHEN** a transcrição está em andamento, o usuário tenta ir para o início e confirma
- **THEN** a transcrição é cancelada e a aplicação vai para `/`

#### Scenario: Desistir de sair
- **WHEN** a transcrição está em andamento, o usuário tenta ir para o início e escolhe ficar
- **THEN** a aplicação continua em `/transcribe` com a transcrição em andamento

### Requirement: Conclusão
Ao terminar, as palavras SHALL ser segmentadas em cues, as cues colocadas na sessão e a aplicação SHALL navegar para `/edit`.

#### Scenario: Legenda gerada
- **WHEN** a transcrição devolve palavras com tempos
- **THEN** a sessão passa a ter as cues segmentadas e a aplicação vai para `/edit`

### Requirement: Falha na transcrição
Se a extração ou a transcrição falhar, a tela SHALL mostrar uma mensagem de erro e permitir tentar de novo.

#### Scenario: Erro no worker
- **WHEN** a transcrição falha com um erro
- **THEN** a tela mostra a mensagem de falha e o botão "Tentar de novo"

### Requirement: Importar legenda existente
O link "Importar legenda existente (.srt/.vtt)" SHALL ler o arquivo escolhido, colocar as cues na sessão e navegar para `/edit`; um arquivo inválido MUST mostrar um erro e manter a tela.

#### Scenario: Importar SRT
- **WHEN** o usuário importa um `.srt` válido com 3 cues
- **THEN** a sessão tem 3 cues e a aplicação vai para `/edit`

#### Scenario: Importar arquivo inválido
- **WHEN** o usuário importa um `.vtt` sem o cabeçalho `WEBVTT`
- **THEN** a tela mostra um erro de arquivo de legenda inválido e continua em `/transcribe`
