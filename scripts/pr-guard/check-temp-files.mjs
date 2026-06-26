import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const pr = event.pull_request;

if (!pr) {
  console.log('Evento não é pull_request. Ignorando check de arquivos temporários.');
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

const changedFiles = git(['diff', '--name-only', '--diff-filter=ACMRT', `${baseSha}..${headSha}`])
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const forbiddenNames = new Set([
  '__noop__',
  '__dummy__',
  '__dummy2__',
  '__test__',
  '__pr_test__',
  '__stop__',
  '__no_more__'
]);

const forbiddenPatterns = [/^__.*__$/];

const blocked = changedFiles.filter((file) => {
  const name = path.basename(file);
  return forbiddenNames.has(name) || forbiddenPatterns.some((pattern) => pattern.test(name));
});

if (blocked.length > 0) {
  console.error('Arquivos temporários proibidos encontrados no PR:');
  for (const file of blocked) console.error(`- ${file}`);
  process.exit(1);
}

console.log('Nenhum arquivo temporário proibido encontrado.');
