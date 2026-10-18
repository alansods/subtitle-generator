# i18n Specification

## Purpose
Garante que a interface esteja disponível em português do Brasil e inglês, com o idioma detectado, trocável e lembrado entre visitas, e com números e datas formatados no padrão do idioma.

## Requirements

### Requirement: Idiomas suportados
A interface SHALL oferecer os idiomas `pt-BR` e `en`, e qualquer outro valor de idioma MUST ser tratado como não suportado.

#### Scenario: Idiomas disponíveis
- **WHEN** a lista de idiomas suportados é consultada
- **THEN** ela contém exatamente `pt-BR` e `en`

### Requirement: Idioma inicial
Ao carregar, a aplicação SHALL usar o idioma salvo pelo usuário; sem idioma salvo válido, SHALL usar `pt-BR` quando o idioma do navegador começar com `pt` e `en` nos demais casos.

#### Scenario: Idioma salvo tem prioridade
- **WHEN** o idioma salvo é `en` e o navegador está em `pt-BR`
- **THEN** a interface abre em `en`

#### Scenario: Navegador em português de Portugal
- **WHEN** não há idioma salvo e o navegador está em `pt-PT`
- **THEN** a interface abre em `pt-BR`

#### Scenario: Navegador em outro idioma
- **WHEN** não há idioma salvo e o navegador está em `fr-FR`
- **THEN** a interface abre em `en`

#### Scenario: Valor salvo inválido
- **WHEN** o valor salvo é `es` e o navegador está em `en-US`
- **THEN** a interface abre em `en`

### Requirement: Troca e persistência do idioma
Ao trocar o idioma, a interface SHALL re-renderizar os textos no novo idioma, MUST salvar a escolha na chave `gdl:locale` do `localStorage` e MUST atualizar o atributo `lang` do elemento `<html>`.

#### Scenario: Trocar para inglês
- **WHEN** o usuário troca o idioma de `pt-BR` para `en`
- **THEN** os textos passam a aparecer em inglês
- **AND** `gdl:locale` vale `en`
- **AND** `<html lang>` vale `en`

#### Scenario: Armazenamento indisponível
- **WHEN** o `localStorage` lança erro ao gravar
- **THEN** a troca de idioma ainda acontece na sessão atual sem erro na interface

### Requirement: Textos vindos dos arquivos de tradução
Todo texto de interface SHALL vir dos arquivos `src/i18n/locales/pt-BR.json` e `src/i18n/locales/en.json`, e os dois arquivos MUST ter exatamente o mesmo conjunto de chaves.

#### Scenario: Paridade de chaves
- **WHEN** as chaves dos dois arquivos de tradução são comparadas
- **THEN** não há chave presente em um arquivo e ausente no outro

### Requirement: Formatação conforme o idioma
Números e datas exibidos SHALL ser formatados com `Intl` no padrão do idioma ativo.

#### Scenario: Número em português
- **WHEN** o número 1234,5 é formatado com o idioma `pt-BR`
- **THEN** o resultado é `1.234,5`

#### Scenario: Número em inglês
- **WHEN** o número 1234,5 é formatado com o idioma `en`
- **THEN** o resultado é `1,234.5`
