import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          test: {
            name: 'unit',
            environment: 'jsdom',
            include: ['src/**/*.test.{ts,tsx}'],
            setupFiles: ['./src/test/setup.ts'],
          },
        },
        {
          // Testes da própria infraestrutura: executam tsc, eslint, prettier e build.
          test: {
            name: 'tooling',
            environment: 'node',
            include: ['tests/tooling/**/*.test.ts'],
            testTimeout: 120_000,
            hookTimeout: 120_000,
          },
        },
      ],
    },
  }),
);
