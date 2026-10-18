import { fetchFile } from '@ffmpeg/util';

import { formatAss } from '@/lib/subtitles/ass';
import { styleToAss, type SubtitleStyle } from '@/lib/subtitles/style';
import type { Cue } from '@/lib/subtitles/types';

import { loadFfmpeg, terminateFfmpeg } from './ffmpeg';

export const FONT_URL = '/fonts/Inter-Medium.ttf';
export const FONT_FILE = 'Inter-Medium.ttf';

export interface BurnInInput {
  video: File;
  cues: readonly Cue[];
  style: SubtitleStyle;
  width: number;
  height: number;
}

export type ExportProgress = { stage: 'prepare' } | { stage: 'encode'; ratio: number };

export class VideoExportCancelled extends Error {
  constructor() {
    super('Exportação cancelada');
    this.name = 'VideoExportCancelled';
  }
}

export interface VideoExporter {
  run: (input: BurnInInput, onProgress: (progress: ExportProgress) => void) => Promise<Blob>;
  cancel: () => void;
}

export function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot > 0 ? fileName.slice(dot).toLowerCase() : '';
}

// Argumentos do ffmpeg para gravar a legenda na imagem (H.264 + AAC em MP4).
export function buildBurnInArgs(input: string, style: SubtitleStyle, height: number): string[] {
  const forceStyle = styleToAss(style, height);
  return [
    '-i',
    input,
    '-vf',
    `subtitles=subs.ass:fontsdir=/fonts:force_style='${forceStyle}'`,
    // Mantém os tempos originais dos quadros (vídeos de celular/gravação de tela têm
    // taxa variável; sem isso o MP4 sai com milhares de quadros duplicados).
    '-fps_mode',
    'passthrough',
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-crf',
    '23',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '160k',
    // Com o número automático de threads o core multi-thread do ffmpeg.wasm 0.12 trava no
    // primeiro quadro; 4 threads funciona e é mais rápido que o single-thread.
    '-threads',
    '4',
    '-movflags',
    '+faststart',
    'output.mp4',
  ];
}

// Exportador real: ffmpeg.wasm (core multi-thread quando a página está isolada).
export function createFfmpegExporter(): VideoExporter {
  let cancelled = false;
  let rejectRunning: ((reason: unknown) => void) | null = null;

  const run: VideoExporter['run'] = (input, onProgress) =>
    new Promise<Blob>((resolve, reject) => {
      rejectRunning = reject;
      void (async () => {
        onProgress({ stage: 'prepare' });
        const ffmpeg = await loadFfmpeg();
        if (cancelled) throw new VideoExportCancelled();
        const inputName = `input${extensionOf(input.video.name) || '.mp4'}`;
        const onFfmpegProgress = ({ progress }: { progress: number }) => {
          onProgress({ stage: 'encode', ratio: Math.min(1, Math.max(0, progress)) });
        };
        ffmpeg.on('progress', onFfmpegProgress);
        try {
          await ffmpeg.createDir('/fonts').catch(() => undefined);
          await ffmpeg.writeFile(`/fonts/${FONT_FILE}`, await fetchFile(FONT_URL));
          await ffmpeg.writeFile('subs.ass', formatAss(input.cues, input));
          await ffmpeg.writeFile(inputName, await fetchFile(input.video));
          onProgress({ stage: 'encode', ratio: 0 });
          const code = await ffmpeg.exec(buildBurnInArgs(inputName, input.style, input.height));
          if (code !== 0) throw new Error(`ffmpeg terminou com código ${String(code)}`);
          const data = await ffmpeg.readFile('output.mp4');
          if (typeof data === 'string') throw new Error('saída inesperada do ffmpeg');
          resolve(new Blob([data.slice().buffer], { type: 'video/mp4' }));
        } finally {
          ffmpeg.off('progress', onFfmpegProgress);
          for (const file of [inputName, 'subs.ass', 'output.mp4']) {
            await ffmpeg.deleteFile(file).catch(() => undefined);
          }
        }
      })().catch(reject);
    }).finally(() => {
      rejectRunning = null;
    });

  return {
    run,
    cancel: () => {
      cancelled = true;
      void terminateFfmpeg();
      rejectRunning?.(new VideoExportCancelled());
    },
  };
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

// Exportador falso (VITE_VIDEO_EXPORTER=fake) para os testes e2e.
export function createFakeExporter(): VideoExporter {
  let cancelled = false;
  return {
    run: async (_input, onProgress) => {
      onProgress({ stage: 'prepare' });
      for (const ratio of [0, 0.25, 0.5, 0.75, 1]) {
        await wait(60);
        if (cancelled) throw new VideoExportCancelled();
        onProgress({ stage: 'encode', ratio });
      }
      return new Blob(['fake mp4'], { type: 'video/mp4' });
    },
    cancel: () => {
      cancelled = true;
    },
  };
}

export function createVideoExporter(): VideoExporter {
  return import.meta.env.VITE_VIDEO_EXPORTER === 'fake'
    ? createFakeExporter()
    : createFfmpegExporter();
}
