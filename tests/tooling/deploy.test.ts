import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { repoRoot } from './run';

// JSONC: remove comentários de linha e vírgulas finais antes de ler.
function readJsonc(path: string): Record<string, unknown> {
  const text = readFileSync(`${repoRoot}${path}`, 'utf8')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/,(\s*[}\]])/g, '$1');
  return JSON.parse(text) as Record<string, unknown>;
}

describe('Requirement: Publicação na Cloudflare', () => {
  it('Scenario: Configuração de publicação', () => {
    const config = readJsonc('wrangler.jsonc');
    expect(config).not.toHaveProperty('main');
    expect(config.pages_build_output_dir).toBe('./dist');
  });

  it('Scenario: Script de publicação', () => {
    const pkg = readJsonc('package.json') as { scripts: Record<string, string> };
    expect(pkg.scripts.deploy).toMatch(
      /^npm run build && npx -y wrangler@\d+\.\d+\.\d+ pages deploy --branch main$/,
    );
  });
});
