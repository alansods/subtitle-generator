export interface VideoMetadata {
  durationSec: number;
  width: number;
  height: number;
}

export class UnplayableVideoError extends Error {
  constructor(message = 'O navegador não consegue reproduzir este vídeo') {
    super(message);
    this.name = 'UnplayableVideoError';
  }
}

const PROBE_TIMEOUT_MS = 10_000;

// Lê duração e dimensões com um <video> fora da tela. Se o navegador não consegue
// ler os metadados (codec não suportado, arquivo corrompido), o vídeo é recusado.
export function probeVideo(url: string, mimeType: string): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    if (mimeType && video.canPlayType(mimeType) === '') {
      reject(new UnplayableVideoError());
      return;
    }

    const cleanup = () => {
      window.clearTimeout(timer);
      video.removeAttribute('src');
      video.load();
    };
    const fail = () => {
      cleanup();
      reject(new UnplayableVideoError());
    };
    const done = () => {
      const metadata = {
        durationSec: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      };
      cleanup();
      if (!metadata.width || !metadata.height || !Number.isFinite(metadata.durationSec)) {
        reject(new UnplayableVideoError());
        return;
      }
      resolve(metadata);
    };

    const timer = window.setTimeout(fail, PROBE_TIMEOUT_MS);
    video.preload = 'metadata';
    video.muted = true;
    video.addEventListener('error', fail, { once: true });
    video.addEventListener(
      'loadedmetadata',
      () => {
        // WebM gravado por MediaRecorder não traz a duração: buscar o fim força o cálculo.
        if (!Number.isFinite(video.duration)) {
          video.addEventListener('durationchange', () => {
            if (Number.isFinite(video.duration)) done();
          });
          video.currentTime = 1e101;
          return;
        }
        done();
      },
      { once: true },
    );
    video.src = url;
  });
}
