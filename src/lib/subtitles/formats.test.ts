import { describe, expect, it } from 'vitest';

import { parseSubtitleFile, SubtitleFormatError } from './parse';
import { formatSrt, parseSrt } from './srt';
import { formatTimecode, parseTimecode } from './timecode';
import { formatVtt, parseVtt } from './vtt';

const without = (cues: { start: number; end: number; text: string }[]) =>
  cues.map(({ start, end, text }) => ({ start, end, text }));

describe('timecode', () => {
  it('formata e lê com precisão de milissegundo', () => {
    expect(formatTimecode(3725.5, ',')).toBe('01:02:05,500');
    expect(formatTimecode(0.0004, '.')).toBe('00:00:00.000');
    expect(formatTimecode(1.9996, '.')).toBe('00:00:02.000');
    expect(parseTimecode('00:01.5')).toBe(1.5);
    expect(parseTimecode('1:02:05,5')).toBe(3725.5);
    expect(parseTimecode('xx')).toBeUndefined();
  });
});

describe('Requirement: Gerar SRT', () => {
  it('Scenario: Duas cues em SRT', () => {
    expect(
      formatSrt([
        { start: 0.4, end: 4.2, text: 'Olá!' },
        { start: 3725.5, end: 3727, text: 'Linha 1\nLinha 2' },
      ]),
    ).toBe(
      '1\n00:00:00,400 --> 00:00:04,200\nOlá!\n\n2\n01:02:05,500 --> 01:02:07,000\nLinha 1\nLinha 2\n',
    );
  });
});

describe('Requirement: Gerar VTT', () => {
  it('Scenario: Uma cue em VTT', () => {
    expect(formatVtt([{ start: 0.4, end: 4.2, text: 'Olá!' }])).toBe(
      'WEBVTT\n\n00:00:00.400 --> 00:00:04.200\nOlá!\n',
    );
  });
});

describe('Requirement: Importar SRT tolerante', () => {
  it('Scenario: SRT do Windows com BOM', () => {
    const text =
      '\uFEFF1\r\n00:00:01,000 --> 00:00:02.500\r\n<i>itálico</i>\r\n\r\n\r\n\r\n2\r\n00:00:03,000 --> 00:00:04,000\r\nDuas\r\nlinhas\r\n';
    expect(parseSrt(text)).toEqual([
      { start: 1, end: 2.5, text: 'itálico' },
      { start: 3, end: 4, text: 'Duas\nlinhas' },
    ]);
  });
});

describe('Requirement: Importar VTT tolerante', () => {
  it('Scenario: VTT com nota e configurações', () => {
    const text =
      'WEBVTT - legenda\nKind: captions\n\nNOTE isto é um comentário\nque ocupa duas linhas\n\nSTYLE\n::cue { color: yellow }\n\nintro\n00:01.000 --> 00:02.500 align:start position:10%\nOi\n';
    expect(parseVtt(text)).toEqual([{ start: 1, end: 2.5, text: 'Oi' }]);
  });

  it('Scenario: VTT sem cabeçalho', () => {
    expect(() => parseVtt('00:01.000 --> 00:02.000\nOi\n')).toThrow(SubtitleFormatError);
  });
});

describe('Requirement: Importação validada', () => {
  it('Scenario: Arquivo sem cues', () => {
    expect(() => parseSubtitleFile('vazio.srt', '\n\n')).toThrow(
      expect.objectContaining({ reason: 'empty' }),
    );
  });

  it('Scenario: Extensão não suportada', () => {
    expect(() => parseSubtitleFile('legenda.txt', 'oi')).toThrow(
      expect.objectContaining({ reason: 'unsupported' }),
    );
  });

  it('Scenario: Cues fora de ordem', () => {
    const text =
      '1\n00:00:10,000 --> 00:00:11,000\nDepois\n\n2\n00:00:02,000 --> 00:00:03,000\nAntes\n';
    expect(parseSubtitleFile('fora.SRT', text).map((cue) => cue.text)).toEqual(['Antes', 'Depois']);
  });
});

describe('Requirement: Ida e volta sem perda', () => {
  it('Scenario: Ida e volta em SRT e VTT', () => {
    const cues = [
      { id: 'a', start: 0.4, end: 4.2, text: 'Olá! Neste vídeo vou mostrar\ncomo gerar legendas.' },
      { id: 'b', start: 4.4, end: 7.003, text: 'Primeiro, o upload.' },
      { id: 'c', start: 3600.999, end: 3602.5, text: 'Depois de uma hora' },
    ];
    expect(without(parseSubtitleFile('ida.srt', formatSrt(cues)))).toEqual(without(cues));
    expect(without(parseSubtitleFile('ida.vtt', formatVtt(cues)))).toEqual(without(cues));
  });
});
