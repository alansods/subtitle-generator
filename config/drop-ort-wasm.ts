import type { Plugin } from 'vite';

// O ONNX Runtime (Whisper) referencia o próprio .wasm (~26 MB) e o Vite o copia para o
// build, mas o Transformers.js define `wasmPaths` para o jsDelivr na versão exata do
// onnxruntime-web instalado, e é de lá que o navegador baixa. A cópia nunca é usada e passa
// do limite de 25 MiB por arquivo da Cloudflare, então sai do build.
export function dropOrtWasm(): Plugin {
  return {
    name: 'drop-ort-wasm',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        if (/ort-wasm.*\.wasm$/.test(fileName)) Reflect.deleteProperty(bundle, fileName);
      }
    },
  };
}
