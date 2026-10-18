# Spec Delta

## MODIFIED Requirements

### Requirement: Baixar de novo
"Baixar de novo" SHALL baixar outra vez o mesmo arquivo: para legenda, gerado a partir das cues atuais no mesmo formato; para vídeo, o mesmo MP4 já gerado, sem processar o vídeo de novo.

#### Scenario: Segundo download
- **WHEN** o usuário baixou `reuniao.vtt` e ativa "Baixar de novo"
- **THEN** o navegador recebe de novo o arquivo `reuniao.vtt` no formato VTT

#### Scenario: Baixar o vídeo de novo
- **WHEN** o usuário baixou `reuniao-legendado.mp4` e ativa "Baixar de novo"
- **THEN** o navegador recebe de novo o mesmo arquivo de vídeo, sem nova geração
