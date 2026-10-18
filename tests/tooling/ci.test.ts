import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import { repoRoot } from './run';

interface Workflow {
  on: Record<string, unknown>;
  jobs: Record<string, { steps: { run?: string }[] }>;
}

const workflow = parse(readFileSync(`${repoRoot}.github/workflows/ci.yml`, 'utf8')) as Workflow;
const commands = Object.values(workflow.jobs).flatMap((job) =>
  job.steps.flatMap((step) => (step.run ? [step.run.trim()] : [])),
);

describe('Requirement: Integração contínua', () => {
  it('Scenario: Pipeline executa as verificações', () => {
    expect(Object.keys(workflow.on)).toEqual(expect.arrayContaining(['push', 'pull_request']));
    expect(commands).toEqual(
      expect.arrayContaining(['npm run check', 'npm run build', 'npm run test:e2e']),
    );
  });
});
