import { UPLOAD_LIMITS, type UploadLimits } from './limits';

export const ACCEPTED_EXTENSIONS = ['.mp4', '.webm', '.mov'] as const;
export const ACCEPTED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'] as const;
export const ACCEPT_ATTRIBUTE = [...ACCEPTED_MIME_TYPES, ...ACCEPTED_EXTENSIONS].join(',');

export type FileCheck =
  { status: 'ok' } | { status: 'warn-large' } | { status: 'error'; reason: 'format' | 'too-large' };

function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot).toLowerCase() : '';
}

export function isAcceptedFormat(file: Pick<File, 'name' | 'type'>): boolean {
  return (
    (ACCEPTED_EXTENSIONS as readonly string[]).includes(extensionOf(file.name)) ||
    (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type)
  );
}

// Formato e tamanho; a reprodutibilidade é verificada depois, lendo os metadados.
export function validateVideoFile(
  file: Pick<File, 'name' | 'type' | 'size'>,
  limits: UploadLimits = UPLOAD_LIMITS,
): FileCheck {
  if (!isAcceptedFormat(file)) return { status: 'error', reason: 'format' };
  if (file.size > limits.maxBytes) return { status: 'error', reason: 'too-large' };
  if (file.size > limits.warnBytes) return { status: 'warn-large' };
  return { status: 'ok' };
}

export function baseName(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot > 0 ? fileName.slice(0, dot) : fileName;
}

// O tipo informado pelo sistema às vezes vem vazio (comum em .mov); deduz pela extensão.
export function mimeTypeOf(file: Pick<File, 'name' | 'type'>): string {
  if (file.type) return file.type;
  const byExtension: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
  };
  return byExtension[extensionOf(file.name)] ?? '';
}
