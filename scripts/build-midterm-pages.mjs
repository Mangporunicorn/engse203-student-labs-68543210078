import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { ROOT } from './common.mjs';

// Build the submitted exam without merging or editing its protected coursework source.
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'engse203-midterm-pages-'));
try {
  let ref = 'midterm';
  try { execFileSync('git', ['rev-parse', '--verify', ref], { cwd: ROOT, stdio: 'ignore' }); }
  catch { ref = 'origin/midterm'; }
  const archive = path.join(temp, 'midterm.tar');
  execFileSync('git', ['archive', '--format=tar', `--output=${archive}`, ref, 'midterm'], { cwd: ROOT });
  execFileSync('tar', ['-xf', archive, '-C', temp]);
  const dependencies = path.join(ROOT, 'labs/week-07/source/frontend/node_modules');
  await fs.symlink(dependencies, path.join(temp, 'midterm/node_modules'), 'dir');
  const require = createRequire(path.join(ROOT, 'labs/week-07/source/frontend/package.json'));
  const viteCli = path.join(path.dirname(require.resolve('vite/package.json')), 'bin/vite.js');
  execFileSync(process.execPath, [viteCli, 'build', '--outDir', path.join(ROOT, 'labs/week-08/publish'), '--emptyOutDir'],
    { cwd: path.join(temp, 'midterm'), stdio: 'inherit' });
  console.log('Midterm Pages build: PASS');
} finally {
  await fs.rm(temp, { recursive: true, force: true });
}
