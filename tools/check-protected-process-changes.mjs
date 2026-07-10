#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const body = (process.env.PR_BODY || '').replace(/\r\n/g, '\n');
const baseSha = process.env.BASE_SHA;
const headSha = process.env.HEAD_SHA;

// Caminhos canônicos pós-integração (PR #132: docs/aprovados-lider/processo/).
// Os padrões legados (docs/aprovado-lider/, singular) permanecem protegidos de
// propósito durante a transição — proteção dupla nunca afrouxa nada; remover os
// legados somente quando o caminho singular deixar de existir em todas as bases.
const protectedPatterns = [
  /^docs\/aprovados-lider\/processo\/dev\//,
  /^docs\/aprovados-lider\/processo\/checklist-bloqueio-obrigatorio\.md$/,
  /^docs\/aprovado-lider\/dev\//,
  /^docs\/aprovado-lider\/checklist-bloqueio-obrigatorio\.md$/,
  /^\.github\/workflows\//,
  /^\.github\/pull_request_template\.md$/,
  /^\.github\/CODEOWNERS$/,
  /^tools\/check-pr-checklist-evidence\.mjs$/,
  /^tools\/check-visual-mockup-evidence\.mjs$/,
  /^tools\/check-protected-process-changes\.mjs$/,
  /^tools\/check-dev-readme-versioning\.mjs$/
];

function fail(message) {
  console.error(`Alteração de processo bloqueada: ${message}`);
  process.exit(1);
}

if (!baseSha || !headSha) {
  fail('BASE_SHA ou HEAD_SHA ausente.');
}

const changed = execSync(`git diff --name-only ${baseSha} ${headSha}`, { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

const protectedChanges = changed.filter(file => protectedPatterns.some(pattern => pattern.test(file)));

if (!protectedChanges.length) {
  console.log('Nenhuma alteração em arquivos de processo protegidos.');
  process.exit(0);
}

const devDocPrefixes = ['docs/aprovados-lider/processo/dev/', 'docs/aprovado-lider/dev/'];
const devReadmePaths = ['docs/aprovados-lider/processo/dev/README.md', 'docs/aprovado-lider/dev/README.md'];

const devDocChanges = protectedChanges.filter(file => devDocPrefixes.some(prefix => file.startsWith(prefix)));
const changedDevReadme = devReadmePaths.some(path => changed.includes(path));

if (devDocChanges.length && !changedDevReadme) {
  fail(`documentos de processo dev (docs/aprovados-lider/processo/dev ou legado docs/aprovado-lider/dev) foram alterados sem atualizar o README de versionamento:\n${devDocChanges.join('\n')}`);
}

const readmeVersioning = body.match(/Versionamento\/alterações no README de processo atualizados\? \(sim\/não\/não aplicável \+ motivo\):\s*\n([\s\S]*?)(?=\n[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^\n]{0,90}:|\n## |$)/);
const readmeVersioningValue = readmeVersioning?.[1]?.trim().toLowerCase() || '';

if (devDocChanges.length && !readmeVersioningValue.includes('sim')) {
  fail('alteração em documentos de processo dev (docs/aprovados-lider/processo/dev ou legado) exige declaração de versionamento/alterações do README como "sim".');
}


const approval = body.match(/Aprovação do líder para alterar docs\/aprovado-lider\/dev, workflows, hooks ou templates:\s*\n([\s\S]*?)(?=\n[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^\n]{0,90}:|\n## |$)/);
const justification = body.match(/Justificativa para alterar processo\/bloqueios:\s*\n([\s\S]*?)(?=\n[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^\n]{0,90}:|\n## |$)/);

const approvalValue = approval?.[1]?.trim().toLowerCase() || '';
const justificationValue = justification?.[1]?.trim() || '';

if (!approvalValue.includes('sim') && !approvalValue.includes('aprovado')) {
  fail(`arquivos protegidos alterados sem aprovação declarada no PR:\n${protectedChanges.join('\n')}`);
}

if (!justificationValue || justificationValue === '-' || justificationValue.length < 20) {
  fail('justificativa para alterar processo/bloqueios ausente ou insuficiente.');
}

console.log('Alteração de processo protegida com aprovação e justificativa declaradas.');
