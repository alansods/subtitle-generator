import { describe, expect, it } from 'vitest';

import { run } from './run';

describe('Requirement: Lint e formatação consistentes', () => {
  it('Scenario: Lint passa', () => {
    const result = run('eslint', ['.']);

    expect(result.output).toBe('');
    expect(result.status).toBe(0);
  });

  it('Scenario: Formatação conferida', () => {
    const result = run('prettier', ['--check', '.']);

    expect(result.status, result.output).toBe(0);
  });
});
