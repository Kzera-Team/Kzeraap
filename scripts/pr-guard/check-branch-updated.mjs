import fs from 'node:fs';

const eventPath = process.env.GITHUB_EVENT_PATH;
const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;

if (!eventPath || !fs.existsSync(eventPath)) {
  console.log('Sem evento de PR. Ignorando check de branch atualizado.');
  process.exit(0);
}

const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
const pr = event.pull_request;

if (!pr) {
  console.log('Evento não é pull_request. Ignorando check de branch atualizado.');
  process.exit(0);
}

if (!token || !repo) {
  console.error('GITHUB_TOKEN ou GITHUB_REPOSITORY indisponível.');
  process.exit(1);
}

const baseSha = pr.base?.sha;
const headSha = pr.head?.sha;

if (!baseSha || !headSha) {
  console.error('Não foi possível identificar base/head do PR.');
  process.exit(1);
}

const response = await fetch(`https://api.github.com/repos/${repo}/compare/${headSha}...${baseSha}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

if (!response.ok) {
  console.error(`Falha ao consultar compare head...base: ${response.status}`);
  console.error(await response.text());
  process.exit(1);
}

const comparison = await response.json();
const baseCommitsMissingInHead = Number(comparison.ahead_by || 0);

if (baseCommitsMissingInHead > 0) {
  console.error(`Branch desatualizado: faltam ${baseCommitsMissingInHead} commit(s) da base no head do PR.`);
  console.error('Atualize o branch com desenvolvimento antes de continuar.');
  process.exit(1);
}

console.log('Branch atualizado com a base do PR.');
