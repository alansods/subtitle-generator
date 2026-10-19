import { existsSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { run } from './run';

const outDir = mkdtempSync(join(tmpdir(), 'gdl-build-'));

afterAll(() => {
  rmSync(outDir, { recursive: true, force: true });
});

describe('Requirement: Build estático de produção', () => {
  it('Scenario: Build gera artefatos estáticos', () => {
    const result = run('npm', ['run', 'build', '--', '--outDir', outDir, '--emptyOutDir']);

    expect(result.status, result.output).toBe(0);
    expect(existsSync(join(outDir, 'index.html'))).toBe(true);
    expect(existsSync(join(outDir, '_headers'))).toBe(true);
  });
});

// Roda depois do build acima (mesma pasta de saída).
describe('Requirement: Publicação na Cloudflare', () => {
  it('Scenario: Nenhum arquivo acima do limite', () => {
    const limit = 25 * 1024 * 1024;
    const tooLarge = readdirSync(outDir, { recursive: true, encoding: 'utf8' })
      .map((file) => join(outDir, file))
      .filter((path) => statSync(path).isFile() && statSync(path).size > limit);
    expect(tooLarge).toEqual([]);
  });
});
