# Proposal

## Why

O app precisa de um endereço público, sem custo e com os headers COOP/COEP.

## What Changes

- Cloudflare Pages (plano Free), projeto `subtitle-generator`, publicado em `https://subtitle-generator-cdi.pages.dev` (`subtitle-generator.pages.dev` já pertence a outra conta).
- `wrangler.jsonc` com `pages_build_output_dir: "./dist"`, sem código de servidor. O `dist/_headers` aplica COOP/COEP e, sem `404.html`, o Pages devolve o `index.html` para rotas como `/edit`.
- Script `npm run deploy` (build + `wrangler pages deploy --branch main`), com o Wrangler por `npx` em versão fixa (4.151.2): fora das devDependencies, o CI não baixa o binário do workerd (~100 MB) a cada execução.
- O `.wasm` do ONNX Runtime (~26 MB, acima do limite de 25 MiB por arquivo) sai do build por um plugin do Vite: o Transformers.js já o baixa do jsDelivr na versão exata do `onnxruntime-web` instalado, como o core do ffmpeg.
- README e contexto do OpenSpec com a hospedagem.

Por que Pages e não Workers com assets estáticos (o caminho que a Cloudflare sugere hoje): o Hugging Face responde 404 sem CORS quando o `Referer` é `*.workers.dev`, então os modelos do Whisper não baixam de lá. Além disso, o subdomínio `*.workers.dev` é um só por conta e já é usado por outro projeto do usuário.

### Fora do escopo

- Domínio próprio e deploy automático a cada push (podem vir depois).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `project-tooling`: novo requisito "Publicação na Cloudflare".

## Impact

- `wrangler.jsonc`, `config/drop-ort-wasm.ts`, `vite.config.ts`, `tests/tooling/build.test.ts`, `tests/tooling/deploy.test.ts`, `package.json`, `README.md`, `openspec/config.yaml`.
