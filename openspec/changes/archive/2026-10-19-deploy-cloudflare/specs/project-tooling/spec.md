## ADDED Requirements

### Requirement: Publicação na Cloudflare
O projeto SHALL ter uma configuração de publicação no Cloudflare Pages (`wrangler.jsonc`) que serve o build estático de `dist/` sem código de servidor, devolvendo o `index.html` para rotas da aplicação, e um script `npm run deploy` que gera o build e publica; nenhum arquivo do build MUST passar de 25 MiB (limite por arquivo da Cloudflare); no endereço publicado, `crossOriginIsolated` MUST ser `true` e a transcrição MUST conseguir baixar os modelos.

#### Scenario: Configuração de publicação
- **WHEN** o `wrangler.jsonc` é lido
- **THEN** ele publica `./dist` como Pages (`pages_build_output_dir`), sem `main`

#### Scenario: Nenhum arquivo acima do limite
- **WHEN** o build de produção é gerado
- **THEN** nenhum arquivo da saída tem mais de 25 MiB

#### Scenario: Script de publicação
- **WHEN** o `package.json` é lido
- **THEN** o script `deploy` gera o build e executa `wrangler pages deploy --branch main`

#### Scenario: Endereço publicado isolado
- **WHEN** o endereço publicado é aberto no navegador, inclusive direto em `/edit`, e um vídeo é transcrito e exportado
- **THEN** a página carrega, `window.crossOriginIsolated` é `true`, a legenda é gerada e o MP4 é baixado
