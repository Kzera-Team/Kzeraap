import { execSync } from 'node:child_process';

const protectedFile = 'public/index.html';
const eventName = process.env.GITHUB_EVENT_NAME || '';

if (eventName === 'pull_request' || eventName === 'pull_request_target') {
  process.exit(0);
}

function changedFiles() {
  const before = process.env.GITHUB_EVENT_BEFORE || process.env.GITHUB_BEFORE;
  const sha = process.env.GITHUB_SHA;

  if (before && sha && !/^0+$/.test(before)) {
    return execSync(`git diff --name-only ${before} ${sha}`, { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
  }

  return execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

const files = changedFiles();

if (files.includes(protectedFile)) {
  console.error('Falha bloqueante: public/index.html só pode ser alterado via pull request.');
  process.exit(1);
}
