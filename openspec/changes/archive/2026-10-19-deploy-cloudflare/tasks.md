# Tasks

## 1. Publicação

- [x] 1.0 Tirar o `.wasm` do ONNX Runtime do build (plugin `dropOrtWasm`); teste "Scenario: Nenhum arquivo acima do limite".
- [x] 1.1 `wrangler.jsonc` (Pages) e script `deploy` (Wrangler por `npx`, versão fixa); testes "Scenario: Configuração de publicação" e "Scenario: Script de publicação".
- [x] 1.2 Publicar com `npm run deploy` e conferir "Scenario: Endereço publicado isolado" no navegador.
  - Resultado (2026-10-19, Chromium headless, `https://subtitle-generator-cdi.pages.dev`): COOP/COEP presentes; `/edit` direto responde 200 e, sem sessão, volta ao início; `crossOriginIsolated` verdadeiro; transcrição real do `sample-speech.webm` em 8 s com o texto correto ("Olá, neste vídeo vou mostrar como gerar legendas no navegador." …); vídeo com legenda exportado em 2 s (MP4 válido) e tela Pronto. ONNX Runtime e core do ffmpeg (multi-thread) vieram do jsDelivr.
  - Tentativa anterior em Workers (`*.workers.dev`) descartada: o Hugging Face recusa (404 sem CORS) requisições com `Referer` desse domínio. O Worker criado foi apagado.

## 2. Documentação e verificação

- [x] 2.1 README e `openspec/config.yaml` com a hospedagem no Cloudflare Pages.
- [x] 2.2 `openspec validate deploy-cloudflare --strict`, `npm run check`, `npm run test:tooling` e `npm run test:e2e` passando; CI verde.
