# subtitle-style Specification

## Purpose
Define as opções de aparência da legenda no vídeo e garante que a prévia no editor e a legenda gravada na imagem saiam da mesma configuração.

## Requirements

### Requirement: Opções de estilo
O estilo da legenda SHALL ter fundo (preto, branco ou transparente), tamanho (P, M ou G) e posição (inferior ou superior), com padrão fundo preto, tamanho M e posição inferior.

#### Scenario: Estilo padrão
- **WHEN** um vídeo novo entra na sessão
- **THEN** o estilo é fundo preto, tamanho M e posição inferior

#### Scenario: Novo vídeo volta ao padrão
- **WHEN** o estilo foi mudado para fundo branco e um novo vídeo entra na sessão
- **THEN** o estilo volta a fundo preto, tamanho M e posição inferior

### Requirement: Painel de estilo no editor
O editor SHALL ter o painel "Estilo da legenda" com as três escolhas; mudar uma opção MUST atualizar na hora a legenda sobre o vídeo.

#### Scenario: Escolher fundo branco
- **WHEN** o usuário escolhe "Branco" em Fundo
- **THEN** a legenda sobre o vídeo passa a ter fundo branco e texto preto

#### Scenario: Legenda em cima
- **WHEN** o usuário escolhe "Superior" em Posição
- **THEN** a legenda sobre o vídeo passa para a parte de cima do vídeo

### Requirement: Aparência na prévia
A legenda sobre o vídeo SHALL usar a fonte Inter com tamanho de 4,5%, 5,5% ou 6,5% da altura do vídeo (P, M, G) e margem vertical de 6% da altura; fundo preto é caixa preta com texto branco, fundo branco é caixa branca com texto preto, e transparente é texto branco com contorno preto.

#### Scenario: Tamanho proporcional
- **WHEN** o tamanho é G
- **THEN** o texto da legenda tem 6,5% da altura do vídeo

#### Scenario: Transparente com contorno
- **WHEN** o fundo é transparente
- **THEN** a legenda não tem caixa de fundo e o texto branco tem contorno preto

### Requirement: Equivalência com o vídeo gravado
O estilo SHALL gerar o `force_style` do libass equivalente à prévia, com `FontName=Inter`, `Fontsize` igual à porcentagem da altura do vídeo, `MarginV` de 6% da altura, `Alignment=2` (inferior) ou `Alignment=8` (superior) e, por fundo: preto `BorderStyle=3,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000`; branco `BorderStyle=3,PrimaryColour=&H00000000,OutlineColour=&H00FFFFFF`; transparente `BorderStyle=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Shadow=1`.

#### Scenario: Preto, M, inferior em 1080p
- **WHEN** o estilo é fundo preto, tamanho M, posição inferior e o vídeo tem 1080 px de altura
- **THEN** o `force_style` contém `FontName=Inter`, `Fontsize=59`, `MarginV=65`, `Alignment=2`, `BorderStyle=3`, `PrimaryColour=&H00FFFFFF` e `OutlineColour=&H00000000`

#### Scenario: Branco em cima
- **WHEN** o estilo é fundo branco, posição superior
- **THEN** o `force_style` contém `Alignment=8`, `BorderStyle=3`, `PrimaryColour=&H00000000` e `OutlineColour=&H00FFFFFF`

#### Scenario: Transparente
- **WHEN** o estilo é fundo transparente
- **THEN** o `force_style` contém `BorderStyle=1`, `Outline=2` e `Shadow=1`

### Requirement: Independente do tema da interface
O estilo da legenda sobre o vídeo MUST NOT mudar com o tema claro ou escuro da interface.

#### Scenario: Tema escuro
- **WHEN** a interface está no tema escuro e o fundo da legenda é preto
- **THEN** a legenda continua com caixa preta e texto branco
