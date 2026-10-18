import { describe, expect, it } from 'vitest';

import { DEFAULT_STYLE, styleToAss, styleToCss } from './style';

const parts = (forceStyle: string) => forceStyle.split(',');

describe('Requirement: Aparência na prévia', () => {
  it('Scenario: Tamanho proporcional', () => {
    expect(styleToCss({ ...DEFAULT_STYLE, fontSize: 'lg' }).text.fontSize).toBe('6.5cqh');
    expect(styleToCss({ ...DEFAULT_STYLE, fontSize: 'sm' }).text.fontSize).toBe('4.5cqh');
    expect(styleToCss(DEFAULT_STYLE).wrap).toMatchObject({ bottom: '6cqh' });
  });

  it('Scenario: Transparente com contorno', () => {
    const { text } = styleToCss({ ...DEFAULT_STYLE, background: 'transparent' });
    expect(text).toMatchObject({ background: 'transparent', color: '#fff' });
    expect(text).toHaveProperty('textShadow', expect.stringContaining('#000'));
  });
});

describe('Requirement: Equivalência com o vídeo gravado', () => {
  it('Scenario: Preto, M, inferior em 1080p', () => {
    expect(parts(styleToAss(DEFAULT_STYLE, 1080))).toEqual(
      expect.arrayContaining([
        'FontName=Inter Medium',
        'Fontsize=59',
        'MarginV=65',
        'Alignment=2',
        'BorderStyle=3',
        'PrimaryColour=&H00FFFFFF',
        'OutlineColour=&H00000000',
      ]),
    );
  });

  it('Scenario: Branco em cima', () => {
    expect(
      parts(styleToAss({ ...DEFAULT_STYLE, background: 'white', position: 'top' }, 720)),
    ).toEqual(
      expect.arrayContaining([
        'Alignment=8',
        'BorderStyle=3',
        'PrimaryColour=&H00000000',
        'OutlineColour=&H00FFFFFF',
      ]),
    );
  });

  it('Scenario: Transparente', () => {
    expect(parts(styleToAss({ ...DEFAULT_STYLE, background: 'transparent' }, 720))).toEqual(
      expect.arrayContaining(['BorderStyle=1', 'Outline=2', 'Shadow=1']),
    );
  });

  it('usa os mesmos números da prévia', () => {
    // 6,5% de 720 px = 46,8 → 47; margem de 6% de 720 = 43,2 → 43.
    expect(parts(styleToAss({ ...DEFAULT_STYLE, fontSize: 'lg' }, 720))).toEqual(
      expect.arrayContaining(['Fontsize=47', 'MarginV=43']),
    );
  });
});
