import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { run, type RunResult } from './run';

const outDir = mkdtempSync(join(tmpdir(), 'gdl-storybook-'));
let build: RunResult;

beforeAll(() => {
  build = run('storybook', ['build', '--output-dir', outDir, '--quiet']);
});

afterAll(() => {
  rmSync(outDir, { recursive: true, force: true });
});

describe('Requirement: Catálogo de componentes', () => {
  it('Scenario: Catálogo compila', () => {
    expect(build.status, build.output).toBe(0);
    expect(existsSync(join(outDir, 'index.html'))).toBe(true);
  });

  it('Scenario: Catálogo exibe os dois temas', () => {
    const index = JSON.parse(readFileSync(join(outDir, 'index.json'), 'utf8')) as {
      entries: Record<string, { title: string; name: string }>;
    };
    const rootStories = Object.values(index.entries)
      .filter((entry) => entry.title === 'App/RootLayout')
      .map((entry) => entry.name);

    expect(rootStories).toEqual(expect.arrayContaining(['Claro', 'Escuro']));
  });
});
