import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const pr = event.pull_request;

if (!pr) {
  console.log('Evento não é pull_request. Ignorando check visual.');
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

const visualChange = changedFiles.some((file) => {
  if (file.startsWith('public/')) return true;
  if (file.startsWith('src/presentation/')) return true;
  if (file === 'src/app/createKzeraAuthenticatedApp.ts') return true;
  if (file.endsWith('.css')) return true;
  if (file.endsWith('.html')) return true;
  return false;
});

if (!visualChange) {
  console.log('Nenhuma alteração visual detectada.');
  process.exit(0);
}

const evidenceFiles = changedFiles.filter((file) =>
  file.startsWith('.pr-check/') &&
  file.endsWith('.md') &&
  !file.endsWith('escopo.template.md')
);

if (evidenceFiles.length === 0) {
  console.error('Alteração visual sem arquivo de evidência em .pr-check/.');
  process.exit(1);
}

const requiredFields = [
  'Base atualizada:',
  'Arquivos alterados:',
  'Regra/storage/cripto tocados:',
  'Versão incrementada:',
  'Print antes/depois:',
  'Teste executado:'
];

for (const file of evidenceFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const missing = requiredFields.filter((field) => !content.includes(field));
  if (missing.length > 0) {
    console.error(`Arquivo de evidência incompleto: ${file}`);
    for (const field of missing) console.error(`- faltando ${field}`);
    process.exit(1);
  }
}

console.log(`Evidência visual encontrada: ${evidenceFiles.join(', ')}`);
