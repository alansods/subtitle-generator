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
      // Testes e stories ao lado das rotas não são rotas.
      routeFileIgnorePattern: '\\.(test|stories)\\.tsx?$',
    }),
    react(),
    tailwindcss(),
  ],
  server: { headers: crossOriginHeaders },
  preview: { headers: crossOriginHeaders },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
