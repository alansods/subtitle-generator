import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { crossOriginHeaders } from './config/cross-origin-headers.ts';

export default defineConfig({
  plugins: [
    // O plugin do router precisa vir antes do plugin do React.
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      // Testes ao lado das rotas não são rotas.
      routeFileIgnorePattern: '\\.test\\.tsx?$',
    }),
    react(),
    tailwindcss(),
  ],
  // Worker em módulo (o worker de transcrição importa dependências ESM).
  worker: { format: 'es' },
  // O ffmpeg.wasm cria o próprio worker; o pré-empacotamento do Vite quebra esse caminho.
  // As dependências do worker entram já na subida do dev server; descobri-las depois faz o
  // Vite recarregar a página, e a sessão (só em memória) se perde no meio da transcrição.
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    include: ['@huggingface/transformers', 'comlink'],
  },
  server: { headers: crossOriginHeaders },
  preview: { headers: crossOriginHeaders },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
