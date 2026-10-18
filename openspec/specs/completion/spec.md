# completion Specification

## Purpose
Define a tela de finalização depois do download: confirmação do que foi baixado e os caminhos para continuar editando o mesmo vídeo ou começar uma nova legenda.

## Requirements

### Requirement: Tela de finalização
A tela `/done` SHALL confirmar o download com o nome do arquivo baixado e oferecer "Baixar de novo", "Voltar a editar este vídeo" e "Fazer nova legenda", com a lembrança de que nada foi guardado no navegador.

#### Scenario: Confirmação do download
- **WHEN** o usuário baixou `reuniao.srt` e está em `/done`
- **THEN** a tela mostra "Pronto! Sua legenda foi baixada." e o nome `reuniao.srt`

### Requirement: Só depois de baixar
Acessar `/done` sem um download feito desde a última edição SHALL redirecionar para `/export` (ou, sem vídeo, para `/`; sem cues, para `/transcribe`).

#### Scenario: Sem download
- **WHEN** a sessão tem cues não baixadas e o usuário abre `/done`
- **THEN** a aplicação vai para `/export`

### Requirement: Baixar de novo
"Baixar de novo" SHALL baixar outra vez o mesmo arquivo: para legenda, gerado a partir das cues atuais no mesmo formato; para vídeo, o mesmo MP4 já gerado, sem processar o vídeo de novo.

#### Scenario: Segundo download
- **WHEN** o usuário baixou `reuniao.vtt` e ativa "Baixar de novo"
- **THEN** o navegador recebe de novo o arquivo `reuniao.vtt` no formato VTT

#### Scenario: Baixar o vídeo de novo
- **WHEN** o usuário baixou `reuniao-legendado.mp4` e ativa "Baixar de novo"
- **THEN** o navegador recebe de novo o mesmo arquivo de vídeo, sem nova geração

### Requirement: Voltar a editar este vídeo
"Voltar a editar este vídeo" SHALL levar para `/edit` mantendo o vídeo e as cues da sessão.

#### Scenario: Voltar ao editor
- **WHEN** o usuário ativa "Voltar a editar este vídeo"
- **THEN** a aplicação vai para `/edit` e as cues continuam as mesmas

### Requirement: Fazer nova legenda
"Fazer nova legenda" SHALL ir para o início sem pedir confirmação e descartar a sessão.

#### Scenario: Começar outra
- **WHEN** o usuário ativa "Fazer nova legenda"
- **THEN** a aplicação vai para `/` sem diálogo de confirmação e a sessão fica vazia
