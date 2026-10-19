## MODIFIED Requirements

### Requirement: Tela de transcrição sem escolhas técnicas
A tela de transcrição SHALL mostrar o vídeo da sessão, a lista de seleção "Idioma falado no vídeo" (Português, Inglês, Detectar automaticamente), o botão "Gerar legenda" e o link para importar uma legenda existente; ela MUST NOT mostrar nome de modelo, tamanho de download, cache ou precisão de tempo.

#### Scenario: Idioma padrão
- **WHEN** a interface está em português e a tela de transcrição é aberta
- **THEN** a lista "Idioma falado no vídeo" está com "Português" selecionado

#### Scenario: Nada técnico na tela
- **WHEN** a tela de transcrição é aberta
- **THEN** nenhum texto menciona "whisper", "modelo", "MB" ou "cache"
