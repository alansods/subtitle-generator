import { describe, expect, it } from 'vitest';

import { run } from './run';

describe('Requirement: Tipagem estrita sem erros', () => {
  it('Scenario: Verificação de tipos passa', () => {
    const result = run('tsc', ['-b']);

    expect(result.output).toBe('');
    expect(result.status).toBe(0);
  });

  it('Scenario: Erro de tipo é detectado', () => {
    const result = run('tsc', ['-p', 'tests/tooling/fixtures/type-error/tsconfig.json']);

    expect(result.status).not.toBe(0);
    expect(result.output).toContain('TS2322');
  });
});
