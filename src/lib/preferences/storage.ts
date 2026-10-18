import type { z } from 'zod';

// Preferências do usuário (idioma, tema) no localStorage. Nunca lança: em janela
// privada ou com armazenamento bloqueado, a preferência só não é lembrada.
export function readPreference<T>(key: string, schema: z.ZodType<T>): T | undefined {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return undefined;
    const parsed = schema.safeParse(raw);
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

export function writePreference(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Sem armazenamento disponível: a escolha vale só para esta sessão.
  }
}
