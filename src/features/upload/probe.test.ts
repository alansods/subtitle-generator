import { afterEach, describe, expect, it, vi } from 'vitest';

import { probeVideo, UnplayableVideoError } from './probe';

// Captura o <video> que o probe cria (via canPlayType, a primeira chamada) para
// simular os eventos do navegador.
function captureVideoElement(answer: CanPlayTypeResult) {
  const canPlayType = vi.spyOn(HTMLMediaElement.prototype, 'canPlayType').mockReturnValue(answer);
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
  return () => {
    const video = canPlayType.mock.contexts[0] as HTMLMediaElement | undefined;
    if (!video) throw new Error('vídeo não criado');
    return video;
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('probeVideo', () => {
  it('recusa quando o navegador não suporta o tipo', async () => {
    vi.spyOn(HTMLMediaElement.prototype, 'canPlayType').mockReturnValue('');
    await expect(probeVideo('blob:x', 'video/quicktime')).rejects.toBeInstanceOf(
      UnplayableVideoError,
    );
  });

  it('recusa quando a leitura dos metadados falha', async () => {
    const video = captureVideoElement('maybe');
    const promise = probeVideo('blob:x', 'video/mp4');
    video().dispatchEvent(new Event('error'));
    await expect(promise).rejects.toBeInstanceOf(UnplayableVideoError);
  });

  it('lê duração e dimensões dos metadados', async () => {
    const video = captureVideoElement('probably');
    const promise = probeVideo('blob:x', 'video/webm');
    Object.defineProperties(video(), {
      duration: { value: 3 },
      videoWidth: { value: 320 },
      videoHeight: { value: 180 },
    });
    video().dispatchEvent(new Event('loadedmetadata'));
    await expect(promise).resolves.toEqual({ durationSec: 3, width: 320, height: 180 });
  });
});
