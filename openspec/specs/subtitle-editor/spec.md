# subtitle-editor Specification

## Purpose
Define a revisão da legenda assistindo ao vídeo: o player, a legenda sobreposta em tempo real, a edição com um clique e a lista de legendas com suas ações.

## Requirements

### Requirement: Player com controles
O editor SHALL mostrar o vídeo da sessão com controles de reproduzir/pausar, posição, tempo atual e total, velocidade de 0,5× a 2×, volume e tela cheia.

#### Scenario: Reproduzir e pausar
- **WHEN** o vídeo está pausado e o usuário ativa "Reproduzir"
- **THEN** o vídeo começa a tocar e o controle passa a ser "Pausar"

#### Scenario: Mudar a velocidade
- **WHEN** o usuário escolhe a velocidade 1,5×
- **THEN** a velocidade de reprodução do vídeo passa a 1,5

### Requirement: Legenda sobre o vídeo em tempo real
Sobre o vídeo SHALL aparecer o texto da cue cujo intervalo contém o tempo atual de reprodução; sem cue no tempo atual, nenhuma legenda aparece.

#### Scenario: Cue ativa
- **WHEN** o tempo atual é 5 s e existe uma cue de 4,4 s a 7 s
- **THEN** o texto dessa cue aparece sobre o vídeo

#### Scenario: Entre cues
- **WHEN** o tempo atual não está dentro de nenhuma cue
- **THEN** nenhuma legenda aparece sobre o vídeo

### Requirement: Editar na própria legenda
Clicar na legenda sobre o vídeo SHALL pausar o vídeo e transformar a legenda num campo de texto; Enter salva, Shift+Enter insere quebra de linha, Esc cancela sem alterar e tirar o foco do campo salva.

#### Scenario: Corrigir e salvar com Enter
- **WHEN** o usuário clica na legenda, troca o texto e aperta Enter
- **THEN** o vídeo está pausado e a cue passa a ter o novo texto

#### Scenario: Quebra de linha
- **WHEN** durante a edição o usuário aperta Shift+Enter
- **THEN** o campo continua aberto com uma quebra de linha no texto

#### Scenario: Cancelar com Esc
- **WHEN** durante a edição o usuário troca o texto e aperta Esc
- **THEN** a cue mantém o texto original

#### Scenario: Salvar ao sair do campo
- **WHEN** durante a edição o usuário troca o texto e clica fora
- **THEN** a cue passa a ter o novo texto

### Requirement: Adicionar legenda no ponto atual
Com o vídeo pausado e sem cue no tempo atual, o editor SHALL oferecer "+ Adicionar legenda aqui", que cria uma cue começando no tempo atual com 2 s de duração (ou até 0,08 s antes da próxima cue) e abre a edição dela.

#### Scenario: Adicionar entre cues
- **WHEN** o vídeo está pausado em 8 s, a próxima cue começa em 9 s e o usuário ativa "+ Adicionar legenda aqui"
- **THEN** surge uma cue de 8 s a 8,92 s em edição sobre o vídeo

### Requirement: Lista de legendas
O editor SHALL listar as cues em ordem com número, início e fim (`mm:ss.mmm`) e texto; a cue ativa MUST ficar destacada, e ativar o número de uma cue MUST levar o vídeo ao início dela.

#### Scenario: Ir para uma cue
- **WHEN** o usuário ativa o número da cue 2, que começa em 4,4 s
- **THEN** o tempo atual do vídeo passa a 4,4 s e a cue 2 fica destacada

### Requirement: Seguir vídeo
Com "Seguir vídeo" ligado, a lista SHALL rolar até a cue ativa quando ela muda; desligado, a lista não rola sozinha.

#### Scenario: Lista acompanha o vídeo
- **WHEN** "Seguir vídeo" está ligado e a cue ativa muda para a cue 5
- **THEN** a lista rola até a cue 5

#### Scenario: Seguir desligado
- **WHEN** "Seguir vídeo" está desligado e a cue ativa muda
- **THEN** a lista não rola

### Requirement: Editar texto e tempos na lista
O texto de cada cue SHALL ser editável na lista, e início e fim SHALL ter botões que ajustam 0,1 s para trás ou para frente, sem sair de 0 nem passar da duração do vídeo.

#### Scenario: Ajustar o início
- **WHEN** a cue começa em 4,4 s e o usuário ativa "+" do início
- **THEN** a cue passa a começar em 4,5 s

#### Scenario: Editar o texto na lista
- **WHEN** o usuário troca o texto de uma cue na lista
- **THEN** a cue passa a ter o novo texto e ele aparece sobre o vídeo quando ela estiver ativa

### Requirement: Ações por legenda
Cada cue SHALL oferecer dividir no cursor do texto (o tempo é dividido na proporção do texto), juntar com a próxima, excluir e inserir uma nova depois.

#### Scenario: Dividir no cursor
- **WHEN** a cue de 0 s a 4 s com texto "abcd efgh" é dividida com o cursor depois de "abcd"
- **THEN** ficam duas cues, "abcd" de 0 s a 1,738 s e "efgh" de 1,818 s a 4 s (corte em 4/9 da duração, com 0,08 s de lacuna)

#### Scenario: Juntar com a próxima
- **WHEN** a cue 1 (0–2 s, "Olá") é juntada com a cue 2 (2,1–4 s, "mundo")
- **THEN** fica uma cue de 0 s a 4 s com o texto "Olá mundo"

#### Scenario: Excluir
- **WHEN** o usuário exclui a cue 2 de 3
- **THEN** restam 2 cues, sem a excluída

#### Scenario: Inserir depois
- **WHEN** o usuário insere uma cue depois da cue 1, que termina em 4,2 s, e a cue 2 começa em 7 s
- **THEN** surge uma cue vazia de 4,28 s a 6,28 s entre as duas

### Requirement: Idioma da interface não muda a legenda
Trocar o idioma da interface SHALL mudar só os textos do app; o texto das cues MUST permanecer igual.

#### Scenario: Trocar para inglês no editor
- **WHEN** o usuário troca a interface para inglês no editor
- **THEN** os controles aparecem em inglês e o texto das cues não muda

### Requirement: Ir para a exportação
O editor SHALL ter o botão principal "Exportar", que leva para `/export`.

#### Scenario: Exportar
- **WHEN** o usuário ativa "Exportar"
- **THEN** a aplicação vai para `/export`
