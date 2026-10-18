import { describe, expect, it } from 'vitest';

import { baseName, mimeTypeOf, validateVideoFile } from './validate';

const MB = 1024 * 1024;
const file = (name: string, sizeMb: number, type = '') => ({ name, type, size: sizeMb * MB });

describe('Requirement: Formatos aceitos', () => {
  it('Scenario: Formato não suportado', () => {
    expect(validateVideoFile(file('apresentacao.pdf', 1, 'application/pdf'))).toEqual({
      status: 'error',
      reason: 'format',
    });
  });

  it('aceita MP4, WebM e MOV pela extensão mesmo sem tipo', () => {
    for (const name of ['a.mp4', 'b.WEBM', 'c.mov']) {
      expect(validateVideoFile(file(name, 10)).status).toBe('ok');
    }
  });
});

describe('Requirement: Limite de tamanho', () => {
  it('Scenario: Acima do limite', () => {
    expect(validateVideoFile(file('grande.mp4', 742, 'video/mp4'))).toEqual({
      status: 'error',
      reason: 'too-large',
    });
  });

  it('Scenario: Arquivo grande (aviso entre 200 e 500 MB)', () => {
    expect(validateVideoFile(file('medio.mp4', 312, 'video/mp4'))).toEqual({
      status: 'warn-large',
    });
  });
});

describe('nome e tipo', () => {
  it('tira a extensão do nome e deduz o tipo do .mov', () => {
    expect(baseName('reuniao-equipe.webm')).toBe('reuniao-equipe');
    expect(mimeTypeOf({ name: 'clip.mov', type: '' })).toBe('video/quicktime');
  });
});
