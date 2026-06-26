import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const baseRef = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'origin/desenvolvimento';

function changedFiles() {
  try {
    execSync(`git fetch origin ${process.env.GITHUB_BASE_REF || 'desenvolvimento'} --depth=1`, { stdio: 'ignore' });
  } catch {
    // Local/offline run: use available refs.
  }

  const output = execSync(`git diff --name-only ${baseRef}...HEAD`, { encoding: 'utf8' }).trim();
  return output ? output.split('\n').filter(Boolean) : [];
}

function isRelevantPath(file) {
  if (file.startsWith('.qa-evidence/')) return false;
  if (file.startsWith('.pr-check/')) return false;
  if (file === 'package.json') return false;
  if (file.startsWith('public/')) return true;
  if (file.startsWith('src/app/')) return true;
  if (file.startsWith('src/presentation/')) return true;
  if (file.startsWith('src/application/')) return true;
  return false;
}

function evidenceFiles() {
  if (!existsSync('.qa-evidence')) return [];
  return readdirSync('.qa-evidence')
    .filter((name) => name.endsWith('.md'))
    .map((name) => join('.qa-evidence', name));
}

const requiredTokens = [
  'Branch:',
  'Commit:',
  'Comando:',
  'URL local:',
  'Tela testada:',
  'Elemento testado:',
  'Resultado observado:',
  'Print antes:',
  'Print depois:',
  'Limitacao:'
];

const files = changedFiles();
const relevant = files.filter(isRelevantPath);

if (relevant.length === 0) {
  console.log('QA evidence guard: nenhuma alteracao funcional/UI exige evidencia real.');
  process.exit(0);
}

const evidences = evidenceFiles();

if (evidences.length === 0) {
  console.error('QA evidence guard: alteracoes em app/UI/public exigem evidencia real em .qa-evidence/*.md');
  console.error('Arquivos que acionaram o bloqueio:');
  for (const file of relevant) console.error(`- ${file}`);
  process.exit(1);
}

let ok = false;
const failures = [];

for (const file of evidences) {
  const content = readFileSync(file, 'utf8');
  const missing = requiredTokens.filter((token) => !content.includes(token));
  if (missing.length === 0) {
    ok = true;
    break;
  }
  failures.push({ file, missing });
}

if (!ok) {
  console.error('QA evidence guard: evidencia encontrada, mas incompleta.');
  for (const failure of failures) {
    console.error(`\n${failure.file}`);
    for (const token of failure.missing) console.error(`- faltando ${token}`);
  }
  process.exit(1);
}

console.log('QA evidence guard: evidencia real obrigatoria encontrada.');
