import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

import { i18n } from '@/i18n';

// O jsdom não implementa scrollTo, e o router o chama ao navegar.
vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

// O jsdom não implementa object URLs.
URL.createObjectURL = vi.fn(() => 'blob:test');
URL.revokeObjectURL = vi.fn();

// O Blob do jsdom não tem text()/arrayBuffer() (presentes em todos os navegadores atuais).
function readBlob(blob: Blob, as: 'text' | 'buffer') {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result ?? '');
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error('falha ao ler o arquivo'));
    };
    if (as === 'text') reader.readAsText(blob);
    else reader.readAsArrayBuffer(blob);
  });
}
const blobProto = Blob.prototype as Partial<Pick<Blob, 'text' | 'arrayBuffer'>>;
if (typeof blobProto.text !== 'function') {
  Object.defineProperty(Blob.prototype, 'text', {
    value(this: Blob) {
      return readBlob(this, 'text');
    },
  });
}
if (typeof blobProto.arrayBuffer !== 'function') {
  Object.defineProperty(Blob.prototype, 'arrayBuffer', {
    value(this: Blob) {
      return readBlob(this, 'buffer');
    },
  });
}

// Os testes partem sempre do português, independente do idioma do jsdom (en-US).
beforeEach(async () => {
  window.localStorage.clear();
  await i18n.changeLanguage('pt-BR');
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
