import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

export interface RunResult {
  status: number | null;
  output: string;
}

// Executa um binário de node_modules/.bin (ou npm) na raiz do repositório.
export function run(command: string, args: string[]): RunResult {
  const bin = command === 'npm' ? 'npm' : `${repoRoot}node_modules/.bin/${command}`;
  const result = spawnSync(bin, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0', CI: '1' },
  });
  // Remove códigos ANSI de cor, que algumas ferramentas emitem mesmo fora de um TTY.
  // eslint-disable-next-line no-control-regex
  const output = `${result.stdout}${result.stderr}`.replace(/\u001b\[[0-9;]*m/g, '');
  return { status: result.status, output };
}
