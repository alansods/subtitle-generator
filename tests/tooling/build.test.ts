import { existsSync, mkdtempSync, rmSync } from 'node:fs';
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
