## MODIFIED Requirements

### Requirement: Opção de vídeo com legenda
A tela de exportação SHALL oferecer "Vídeo com legenda" ao lado de "Somente legenda"; escolhida, ela MUST mostrar o painel de estilo, uma prévia num quadro do vídeo, o nome do arquivo `<nome do vídeo>-legendado.mp4` (em inglês, `<nome do vídeo>-subtitled.mp4`) e o botão "Gerar vídeo".

#### Scenario: Escolher vídeo com legenda
- **WHEN** o vídeo da sessão é `reuniao.mp4` e o usuário escolhe "Vídeo com legenda"
- **THEN** a tela mostra o painel de estilo, a prévia, o nome `reuniao-legendado.mp4` e o botão "Gerar vídeo"

#### Scenario: Nome em inglês
- **WHEN** a interface está em inglês, o vídeo da sessão é `meeting.mp4` e o usuário escolhe "Video with subtitles"
- **THEN** o nome do arquivo é `meeting-subtitled.mp4`
