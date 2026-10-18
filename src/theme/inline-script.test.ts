import { readFileSync } from 'node:fs';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mockMatchMedia } from '@/test/matchMedia';

const html = readFileSync('index.html', 'utf8');
const script = /<script id="theme-init">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? '';

function runInlineScript() {
  // Executa o script exatamente como está no index.html (é o que está sendo testado).
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const fn = new Function(script) as () => void;
  fn();
}

beforeEach(() => {
  document.documentElement.classList.remove('dark');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Requirement: Sem flash de tema errado', () => {
  it('Scenario: Classe aplicada antes do app', () => {
    expect(script).not.toBe('');
    mockMatchMedia(false);
    window.localStorage.setItem('gdl:theme', 'dark');
    runInlineScript();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('Scenario: Armazenamento bloqueado', () => {
    mockMatchMedia(true);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(runInlineScript).not.toThrow();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
