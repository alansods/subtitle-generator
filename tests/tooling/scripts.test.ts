import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { repoRoot, run } from './run';

const { scripts } = JSON.parse(readFileSync(`${repoRoot}package.json`, 'utf8')) as {
  scripts: Record<string, string>;
};

describe('Requirement: Suítes de teste executáveis', () => {
  it('Scenario: Testes unitários e de componentes', () => {
    const result = run('vitest', ['run', '--project', 'unit']);

    expect(result.status, result.output).toBe(0);
    expect(result.output).toMatch(/Tests\s+\d+ passed/);
  });
});

describe('Requirement: Comando agregado de qualidade', () => {
  it('Scenario: Qualidade agregada falha com qualquer etapa', () => {
    const check = scripts.check ?? '';
    const steps = check.split('&&').map((step) => step.trim());

    // Encadeado só com &&: qualquer etapa com saída diferente de 0 interrompe e falha o comando.
    expect(check).not.toMatch(/\|\||;/);
    expect(steps).toEqual([
      'npm run typecheck',
      'npm run lint',
      'npm run format:check',
      'npm test',
    ]);
  });
});
