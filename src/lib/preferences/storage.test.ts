import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { readPreference, writePreference } from './storage';

const schema = z.enum(['a', 'b']);

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('preferences storage', () => {
  it('lê um valor salvo válido', () => {
    window.localStorage.setItem('gdl:test', 'a');
    expect(readPreference('gdl:test', schema)).toBe('a');
  });

  it('ignora um valor salvo inválido', () => {
    window.localStorage.setItem('gdl:test', 'z');
    expect(readPreference('gdl:test', schema)).toBeUndefined();
  });

  it('não lança quando o localStorage falha', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(readPreference('gdl:test', schema)).toBeUndefined();
    expect(() => {
      writePreference('gdl:test', 'a');
    }).not.toThrow();
  });
});
