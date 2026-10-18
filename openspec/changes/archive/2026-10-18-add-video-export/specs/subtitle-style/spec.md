## MODIFIED Requirements

### Requirement: Equivalência com o vídeo gravado
O estilo SHALL gerar o `force_style` do libass equivalente à prévia, com `FontName=Inter Medium` (o nome de família do arquivo `Inter-Medium.ttf`; sem provedor de fontes no ffmpeg.wasm não há substituição, então o nome MUST bater com o arquivo), `Fontsize` igual à porcentagem da altura do vídeo, `MarginV` de 6% da altura, `Alignment=2` (inferior) ou `Alignment=8` (superior) e, por fundo: preto `BorderStyle=3,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000`; branco `BorderStyle=3,PrimaryColour=&H00000000,OutlineColour=&H00FFFFFF`; transparente `BorderStyle=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Shadow=1`.

#### Scenario: Preto, M, inferior em 1080p
- **WHEN** o estilo é fundo preto, tamanho M, posição inferior e o vídeo tem 1080 px de altura
- **THEN** o `force_style` contém `FontName=Inter Medium`, `Fontsize=59`, `MarginV=65`, `Alignment=2`, `BorderStyle=3`, `PrimaryColour=&H00FFFFFF` e `OutlineColour=&H00000000`

#### Scenario: Branco em cima
- **WHEN** o estilo é fundo branco, posição superior
- **THEN** o `force_style` contém `Alignment=8`, `BorderStyle=3`, `PrimaryColour=&H00000000` e `OutlineColour=&H00FFFFFF`

#### Scenario: Transparente
- **WHEN** o estilo é fundo transparente
- **THEN** o `force_style` contém `BorderStyle=1`, `Outline=2` e `Shadow=1`
