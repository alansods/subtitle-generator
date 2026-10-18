import { describe, expect, it } from 'vitest';

import { segmentWords, wrapLines, type TimedWord } from './segmentation';

// Palavras faladas em sequência, `step` segundos cada, sem pausas.
function speak(text: string, startAt = 0, step = 0.4): TimedWord[] {
  return text.split(' ').map((word, i) => ({
    text: word,
    start: startAt + i * step,
    end: startAt + (i + 1) * step,
  }));
}

const lines = (text: string) => text.split('\n');

describe('Requirement: Tamanho máximo da cue', () => {
  it('Scenario: Frase longa sem pontuação', () => {
    const words = speak(
      Array.from({ length: 30 }, (_, i) => `palavra${String(i)}`).join(' '),
      0,
      0.2,
    );
    expect(words.map((w) => w.text).join(' ').length).toBeGreaterThan(150);
    for (const cue of segmentWords(words)) {
      expect(lines(cue.text).length).toBeLessThanOrEqual(2);
      for (const line of lines(cue.text)) expect(line.length).toBeLessThanOrEqual(42);
    }
  });

  it('Scenario: Duas linhas balanceadas', () => {
    const words = 'Você também pode ajustar os tempos arrastando as regiões'.split(' ');
    expect(words.join(' ').length).toBeGreaterThan(42);
    const [first = '', second = ''] = wrapLines(words) ?? [];
    expect(first.length).toBeLessThanOrEqual(42);
    expect(second.length).toBeLessThanOrEqual(42);
    for (let i = 1; i < words.length; i++) {
      const a = words.slice(0, i).join(' ');
      const b = words.slice(i).join(' ');
      if (a.length <= 42 && b.length <= 42) {
        expect(Math.abs(first.length - second.length)).toBeLessThanOrEqual(
          Math.abs(a.length - b.length),
        );
      }
    }
  });
});

describe('Requirement: Limites de duração', () => {
  it('Scenario: Fala contínua de 12 segundos', () => {
    const words = speak(Array.from({ length: 20 }, () => 'ab').join(' '), 0, 0.6);
    const cues = segmentWords(words);
    expect(cues.length).toBeGreaterThan(1);
    for (const cue of cues) expect(cue.end - cue.start).toBeLessThanOrEqual(7);
  });

  it('Scenario: Resposta curta', () => {
    const cues = segmentWords([
      { text: 'Sim.', start: 1, end: 1.3 },
      ...speak('Vamos começar agora.', 4.3),
    ]);
    expect(cues[0]?.text).toBe('Sim.');
    expect((cues[0]?.end ?? 0) - (cues[0]?.start ?? 0)).toBeCloseTo(1, 3);
  });
});

describe('Requirement: Onde cortar', () => {
  it('Scenario: Pontuação final', () => {
    const cues = segmentWords(speak('Olá, pessoal. Hoje vamos falar de legendas.', 0, 0.6));
    expect(cues.map((c) => c.text.replace('\n', ' '))).toEqual([
      'Olá, pessoal.',
      'Hoje vamos falar de legendas.',
    ]);
  });

  it('Scenario: Vírgula antes do limite', () => {
    const sentence =
      'Quando você escolhe o vídeo e clica para gerar, o navegador baixa o modelo e começa a transcrever tudo sem enviar nada';
    const cues = segmentWords(speak(sentence, 0, 0.25));
    expect(cues[0]?.text.replace('\n', ' ')).toBe(
      'Quando você escolhe o vídeo e clica para gerar,',
    );
  });

  it('Scenario: Pausa entre palavras', () => {
    const first = speak('agora vamos ver o editor', 0);
    const second = speak('que mostra a legenda', (first.at(-1)?.end ?? 0) + 0.8);
    const cues = segmentWords([...first, ...second]);
    expect(cues.map((c) => c.text)).toEqual(['agora vamos ver o editor', 'que mostra a legenda']);
  });
});

describe('Requirement: Palavras inteiras', () => {
  it('Scenario: Texto preservado', () => {
    const text =
      'A transcrição acontece no seu computador, sem enviar nada para a internet. Depois é só revisar o texto e clicar na legenda para corrigir qualquer palavra que estiver errada no meio do caminho';
    const cues = segmentWords(speak(text, 0, 0.3));
    expect(cues.map((c) => c.text.replace(/\n/g, ' ')).join(' ')).toBe(text);
  });
});

describe('Requirement: Sem sobreposição', () => {
  it('Scenario: Palavras coladas entre cues', () => {
    const cues = segmentWords([
      ...speak('Primeira frase aqui.', 1, 1),
      { text: 'Segunda', start: 4.02, end: 4.6 },
      { text: 'frase.', start: 4.6, end: 5.4 },
    ]);
    expect(cues).toHaveLength(2);
    expect(cues[0]?.end).toBeLessThanOrEqual(3.94);
    for (let i = 1; i < cues.length; i++) {
      expect((cues[i]?.start ?? 0) - (cues[i - 1]?.end ?? 0)).toBeGreaterThanOrEqual(0.08 - 1e-9);
    }
  });
});
