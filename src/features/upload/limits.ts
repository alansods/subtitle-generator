const MIB = 1024 * 1024;

// Limites do upload (configuráveis em código). Acima de `warnBytes` o app avisa que a
// transcrição pode ficar lenta; acima de `maxBytes` recusa.
export const UPLOAD_LIMITS = {
  maxBytes: 500 * MIB,
  warnBytes: 200 * MIB,
} as const;

export type UploadLimits = typeof UPLOAD_LIMITS;

export function bytesToMegabytes(bytes: number): number {
  return Math.round(bytes / MIB);
}
