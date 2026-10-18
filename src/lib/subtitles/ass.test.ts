import { describe, expect, it } from 'vitest';

import { formatAss } from './ass';

describe('Requirement: Legenda gravada no vídeo', () => {
  it('Scenario: Arquivo ASS na resolução do vídeo', () => {
    const ass = formatAss(
      [
        { id: 'a', start: 0.5, end: 2.25, text: 'Primeira linha\nsegunda linha' },
        { id: 'b', start: 3661.04, end: 3662, text: 'Com {chaves}' },
      ],
      { width: 1280, height: 720 },
    );
    const lines = ass.split('\n');

    expect(lines).toContain('PlayResX: 1280');
    expect(lines).toContain('PlayResY: 720');
    const dialogues = lines.filter((line) => line.startsWith('Dialogue:'));
    expect(dialogues).toEqual([
      'Dialogue: 0,0:00:00.50,0:00:02.25,Default,,0,0,0,,Primeira linha\\Nsegunda linha',
      'Dialogue: 0,1:01:01.04,1:01:02.00,Default,,0,0,0,,Com (chaves)',
    ]);
  });
});
