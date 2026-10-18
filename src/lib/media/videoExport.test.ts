import { describe, expect, it } from 'vitest';

import { DEFAULT_STYLE, styleToAss } from '@/lib/subtitles/style';

import { buildBurnInArgs, extensionOf } from './videoExport';

describe('Requirement: Legenda gravada no vídeo', () => {
  it('Scenario: Comando de gravação', () => {
    const input = `input${extensionOf('reuniao.mp4')}`;
    const args = buildBurnInArgs(input, DEFAULT_STYLE, 1080);

    expect(args.slice(0, 2)).toEqual(['-i', 'input.mp4']);
    const filter = args[args.indexOf('-vf') + 1];
    expect(filter).toBe(
      `subtitles=subs.ass:fontsdir=/fonts:force_style='${styleToAss(DEFAULT_STYLE, 1080)}'`,
    );
    expect(filter).toContain('FontName=Inter Medium');
    expect(args[args.indexOf('-c:v') + 1]).toBe('libx264');
    expect(args[args.indexOf('-c:a') + 1]).toBe('aac');
    expect(args.at(-1)).toBe('output.mp4');
  });
});
