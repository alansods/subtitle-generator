import { beforeEach, describe, expect, it, vi } from 'vitest';

const load = vi.fn<(config: Record<string, string>) => Promise<void>>();

vi.mock('@ffmpeg/ffmpeg', () => ({
  FFmpeg: class {
    load = load;
    terminate = vi.fn();
  },
}));
vi.mock('@ffmpeg/util', () => ({
  fetchFile: vi.fn(),
  toBlobURL: (url: string) => Promise.resolve(`blob:${url}`),
}));

const { loadFfmpeg, terminateFfmpeg } = await import('./ffmpeg');

describe('Requirement: Legenda gravada no vídeo', () => {
  beforeEach(async () => {
    load.mockReset().mockResolvedValue(undefined);
    await terminateFfmpeg();
  });

  it('Scenario: Core multi-thread', async () => {
    vi.stubGlobal('crossOriginIsolated', true);
    await loadFfmpeg();

    const config = load.mock.calls[0]?.[0];
    expect(config?.coreURL).toMatch(/@ffmpeg\/core-mt@0\.12\.10\/dist\/esm\/ffmpeg-core\.js$/);
    expect(config?.wasmURL).toMatch(/core-mt@0\.12\.10\/dist\/esm\/ffmpeg-core\.wasm$/);
    expect(config?.workerURL).toMatch(/core-mt@0\.12\.10\/dist\/esm\/ffmpeg-core\.worker\.js$/);
  });

  it('usa o core single-thread sem isolamento', async () => {
    vi.stubGlobal('crossOriginIsolated', false);
    await loadFfmpeg();

    const config = load.mock.calls[0]?.[0];
    expect(config?.coreURL).toMatch(/@ffmpeg\/core@0\.12\.10\//);
    expect(config).not.toHaveProperty('workerURL');
  });
});
