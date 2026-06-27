import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const pr = event.pull_request;

if (!pr) {
  console.log('Evento não é pull_request. Ignorando check de versão.');
  process.exit(0);
}

const baseSha = pr.base.sha;
const headSha = pr.head.sha;

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

try {
  git(['fetch', '--no-tags', 'origin', baseSha, headSha]);
} catch {
  // O checkout com fetch-depth 0 geralmente já contém os SHAs.
}

const changedFiles = git(['diff', '--name-only', `${baseSha}..${headSha}`])
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const requiresVersionBump = changedFiles.some((file) => {
  if (file === 'package.json') return false;
  if (file.startsWith('.pr-check/')) return false;
  if (file.startsWith('src/')) return true;
  if (file.startsWith('public/')) return true;
  if (file.startsWith('scripts/')) return true;
  if (file.startsWith('.github/workflows/')) return true;
  return false;
});

if (!requiresVersionBump) {
  console.log('Nenhum arquivo que exige incremento de versão foi alterado.');
  process.exit(0);
}

if (!changedFiles.includes('package.json')) {
  console.error('Alteração exige incremento de versão, mas package.json não foi alterado.');
  process.exit(1);
}

function readPackageVersion(ref) {
  const content = git(['show', `${ref}:package.json`]);
  return JSON.parse(content).version;
}

const baseVersion = readPackageVersion(baseSha);
const headVersion = readPackageVersion(headSha);

if (!baseVersion || !headVersion || baseVersion === headVersion) {
  console.error(`Versão não incrementada. base=${baseVersion} head=${headVersion}`);
  process.exit(1);
}

console.log(`Versão incrementada: ${baseVersion} -> ${headVersion}`);
