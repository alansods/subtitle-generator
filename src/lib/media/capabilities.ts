export type InferenceDevice = 'webgpu' | 'wasm';

interface NavigatorWithGpu {
  gpu?: { requestAdapter: () => Promise<unknown> };
  deviceMemory?: number;
}

// WebGPU só conta se o navegador entregar um adaptador de verdade.
export async function detectDevice(nav: NavigatorWithGpu = navigator): Promise<InferenceDevice> {
  if (!nav.gpu) return 'wasm';
  try {
    return (await nav.gpu.requestAdapter()) ? 'webgpu' : 'wasm';
  } catch {
    return 'wasm';
  }
}

// Memória aproximada em GB (só Chrome/Edge expõem); usada para liberar modelos maiores.
export function deviceMemoryGb(nav: NavigatorWithGpu = navigator) {
  return nav.deviceMemory;
}
