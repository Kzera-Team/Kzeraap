#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const processDocsRoot = 'docs/aprovados-lider/processo';

function fail(message) {
  console.error(`Versionamento do README inválido: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(processDocsRoot)) {
  fail(`diretório vigente não encontrado: ${processDocsRoot}`);
}

const markdownFiles = fs
  .readdirSync(processDocsRoot, { recursive: true, withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
  .map(entry => path.join(entry.parentPath ?? entry.path, entry.name));

const candidates = markdownFiles
  .map(filePath => ({
    filePath,
    text: fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n'),
  }))
  .filter(({ text }) =>
    text.includes('## Versionamento do processo') &&
    text.includes('## Alterações desta versão'),
  );

if (candidates.length === 0) {
  fail(`nenhum README de processo versionado foi encontrado em ${processDocsRoot}.`);
}

if (candidates.length > 1) {
  fail(`mais de um documento versionado foi encontrado: ${candidates.map(item => item.filePath).join(', ')}.`);
}

const [{ filePath: readmePath, text }] = candidates;

function section(title) {
  const heading = `## ${title}`;
  const start = text.indexOf(`${heading}\n`);
  if (start === -1) return '';

  const contentStart = start + heading.length + 1;
  const nextHeading = text.indexOf('\n## ', contentStart);
  const contentEnd = nextHeading === -1 ? text.length : nextHeading;

  return text.slice(contentStart, contentEnd).trim();
}

const versioning = section('Versionamento do processo');
const changes = section('Alterações desta versão');

if (!versioning) {
  fail('seção "Versionamento do processo" ausente.');
}

if (!changes) {
  fail('seção "Alterações desta versão" ausente.');
}

const versionMatch = versioning.match(/Versão atual:\s*`?([0-9]+\.[0-9]+\.[0-9]+)`?/);
if (!versionMatch) {
  fail('campo "Versão atual" ausente ou fora do padrão semver X.Y.Z.');
}

const dateMatch = versioning.match(/Data:\s*`?(\d{4}-\d{2}-\d{2})`?/);
if (!dateMatch) {
  fail('campo "Data" ausente ou fora do padrão YYYY-MM-DD.');
}

if (!/Dono:\s*.+/i.test(versioning)) {
  fail('campo "Dono" ausente.');
}

const changeBullets = changes
  .split('\n')
  .map(line => line.trim())
  .filter(line => /^-\s+\S/.test(line));

if (!changeBullets.length) {
  fail('seção "Alterações desta versão" precisa ter pelo menos um item.');
}

if (changeBullets.some(line => line === '-' || line.length < 20)) {
  fail('há item de alteração vazio ou insuficiente.');
}

console.log(
  `README de processo versionado corretamente: ${readmePath} — ${versionMatch[1]} (${dateMatch[1]}).`,
);