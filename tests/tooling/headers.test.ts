import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { crossOriginHeaders } from '../../config/cross-origin-headers';
import { repoRoot } from './run';

// Lê o formato `_headers` do Cloudflare Pages: um caminho por bloco, headers indentados abaixo.
function parseHeadersFile(text: string): Map<string, Record<string, string>> {
  const blocks = new Map<string, Record<string, string>>();
  let current: Record<string, string> | undefined;
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      current = {};
      blocks.set(line.trim(), current);
      continue;
    }
    const separator = line.indexOf(':');
    if (current && separator > 0) {
      current[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
    }
  }
  return blocks;
}

describe('Requirement: Isolamento cross-origin em todos os ambientes', () => {
  it('Scenario: Configuração de hospedagem declara os headers', () => {
    const blocks = parseHeadersFile(readFileSync(`${repoRoot}public/_headers`, 'utf8'));

    expect(blocks.get('/*')).toEqual(crossOriginHeaders);
  });
});
