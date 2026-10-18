import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

// Vitest roda na raiz do projeto; o CSS é a fonte única dos tokens.
const css = readFileSync('src/styles/globals.css', 'utf8');

function tokens(selector: ':root' | '.dark'): Record<string, string> {
  const block = new RegExp(`(?:^|\\n)${selector.replace('.', '\\.')} \\{([^}]*)\\}`).exec(css)?.[1];
  if (!block) throw new Error(`bloco ${selector} não encontrado`);
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map((m) => [m[1], m[2]]),
  ) as Record<string, string>;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// Pares texto/fundo usados pela interface.
const PAIRS: [string, string][] = [
  ['foreground', 'background'],
  ['foreground', 'card'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'card'],
  ['muted-foreground', 'muted'],
  ['primary-foreground', 'primary'],
  ['secondary-foreground', 'secondary'],
  ['accent-foreground', 'accent'],
  ['ink-foreground', 'ink'],
  ['destructive', 'card'],
  ['destructive', 'danger-soft'],
  ['warning', 'warning-soft'],
  ['warning', 'card'],
  ['success', 'success-soft'],
  ['success', 'card'],
  ['primary', 'card'],
];

describe('Requirement: Contraste acessível', () => {
  it('Scenario: Contraste dos tokens', () => {
    for (const theme of [':root', '.dark'] as const) {
      const t = tokens(theme);
      for (const [text, bg] of PAIRS) {
        const ratio = contrast(t[text] ?? '', t[bg] ?? '');
        expect(ratio, `${theme} ${text} sobre ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
