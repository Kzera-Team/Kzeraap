#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const bodyPath = process.argv[2];
const body = (bodyPath ? fs.readFileSync(bodyPath, 'utf8') : process.env.PR_BODY || '').replace(/\r\n/g, '\n');

const baseSha = process.env.BASE_SHA;
const headSha = process.env.HEAD_SHA;
const changedFilesEnv = process.env.CHANGED_FILES || '';

const visualFilePatterns = [
  /^src\/presentation\//,
  /^src\/app\//,
  /^public\/.*\.html$/,
  /^public\/styles\//,
  /^public\/static\//,
  /^src\/.*\.(css|html|svg)$/i,
  /\.(css|scss|sass|less)$/i
];

function fail(message) {
  console.error(`Evidência visual obrigatória inválida: ${message}`);
  process.exitCode = 1;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasCheckedItem(label) {
  const escaped = escapeRegExp(label);
  return new RegExp(`^- \\[[xX]\\]\\s+${escaped}\\s*$`, 'm').test(body);
}

function getFieldValue(label) {
  const escaped = escapeRegExp(label);
  const pattern = new RegExp(`${escaped}:\\s*\\n([\\s\\S]*?)(?=\\n(?:[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^\\n]{0,120}:|## |# |- \\[[ xX]\\] )|$)`, 'm');
  const match = body.match(pattern);
  return match ? match[1].trim() : '';
}

function normalize(value) {
  return value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function isPlaceholder(value) {
  const normalized = normalize(value);
  return !normalized || normalized === '-' || normalized === 'n/a' || normalized === 'na' || normalized === 'não se aplica' || normalized === 'nao se aplica';
}

function isYes(value) {
  const normalized = normalize(value);
  return /\b(sim|yes|aplicado|anexado|declarado)\b/.test(normalized);
}

function isNo(value) {
  const normalized = normalize(value);
  return /\b(não|nao|no)\b/.test(normalized);
}


function hasCompleteImpedimentException() {
  const impedimentAnswer = getFieldValue('Há impedimento? \\(sim/não\\)') || getFieldValue('Há impedimento? (sim/não)');
  if (!isYes(impedimentAnswer)) return false;

  const hasAcceptedClassification = hasCheckedItem('Bloqueante aceito por exceção') || hasCheckedItem('Não bloqueante') || hasCheckedItem('Pendente para tarefa separada');
  if (!hasAcceptedClassification) return false;

  const requiredFields = [
    'Impedimento',
    'Impacto',
    'Garantia limitada',
    'Não garantido',
    'Decisão',
    'Responsável pela decisão/exceção',
    'Ação posterior ou prazo'
  ];

  return requiredFields.every(label => !isPlaceholder(getFieldValue(label)));
}

function hasVisualEvidenceException() {
  if (!hasCompleteImpedimentException()) return false;

  const impediment = normalize(getFieldValue('Impedimento'));
  const notGuaranteed = normalize(getFieldValue('Não garantido'));
  const decision = normalize(getFieldValue('Decisão'));

  const mentionsVisualEvidence = /(visual|mockup|print|screenshot|99|runtime|navegador)/.test(`${impediment} ${notGuaranteed}`);
  const hasDecision = /(aprovad|seguir|exceç|excec|aceit)/.test(decision);

  return mentionsVisualEvidence && hasDecision;
}

function getChangedFiles() {
  if (changedFilesEnv.trim()) {
    return changedFilesEnv.split('\n').map(file => file.trim()).filter(Boolean);
  }

  if (!baseSha || !headSha) {
    return [];
  }

  try {
    return execSync(`git diff --name-only ${baseSha} ${headSha}`, { encoding: 'utf8' })
      .split('\n')
      .map(file => file.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

const changedFiles = getChangedFiles();
const visualFiles = changedFiles.filter(file => visualFilePatterns.some(pattern => pattern.test(file)));

const visualAnswer = getFieldValue('Houve alteração visual de tela/componente? \\(sim/não\\)') || getFieldValue('Houve alteração visual de tela/componente? (sim/não)');
const declaredVisualChange = isYes(visualAnswer);
const declaredNoVisualChange = isNo(visualAnswer);

if (!body.trim()) {
  fail('corpo do PR vazio. Preencha o template obrigatório.');
}

if (!declaredVisualChange && !declaredNoVisualChange) {
  fail('responda "Houve alteração visual de tela/componente? (sim/não)".');
}

if (visualFiles.length && declaredNoVisualChange) {
  fail(`arquivos com possível impacto visual foram alterados, mas o PR declarou que não houve alteração visual:\n${visualFiles.join('\n')}`);
}

if (!visualFiles.length && declaredNoVisualChange) {
  if (!hasCheckedItem('Não houve alteração visual de tela, componente, layout, CSS, HTML ou fluxo com impacto visual')) {
    fail('marque o item "Não houve alteração visual..." quando declarar que não houve alteração visual.');
  }
}

if (declaredVisualChange || visualFiles.length) {
  const visualException = hasVisualEvidenceException();

  if (!hasCheckedItem('Houve alteração visual e checklist visual por mockup foi aplicado') && !visualException) {
    fail('marque o item "Houve alteração visual e checklist visual por mockup foi aplicado".');
  }

  const requiredFields = [
    'Mockup/documentação usada',
    'Print real da tela renderizada anexado no PR? \\(sim/não \\+ link/nome do anexo\\)',
    'Declaro que o print é exclusivamente da tela real do sistema renderizada após o desenvolvimento e não foi editado, manipulado, montado ou simulado',
    'Declaro fidelidade mínima de 99% ao mockup aprovado',
    'Diferenças visuais conhecidas',
    'Escopo da garantia visual'
  ];

  for (const label of requiredFields) {
    const unescapedLabel = label.replace(/\\/g, '');
    const value = getFieldValue(label) || getFieldValue(unescapedLabel);
    if (isPlaceholder(value) && !visualException) {
      fail(`preencha a evidência visual: "${unescapedLabel}".`);
    }
  }

  const printEvidence = getFieldValue('Print real da tela renderizada anexado no PR? \\(sim/não \\+ link/nome do anexo\\)') || getFieldValue('Print real da tela renderizada anexado no PR? (sim/não + link/nome do anexo)');
  if (!isYes(printEvidence) && !visualException) {
    fail('declare que o print real foi anexado e informe link/nome do anexo.');
  }

  const realPrintDeclaration = getFieldValue('Declaro que o print é exclusivamente da tela real do sistema renderizada após o desenvolvimento e não foi editado, manipulado, montado ou simulado');
  if (!isYes(realPrintDeclaration) && !visualException) {
    fail('declare explicitamente que o print é real e não foi editado, manipulado, montado ou simulado.');
  }

  const fidelityDeclaration = getFieldValue('Declaro fidelidade mínima de 99% ao mockup aprovado');
  if ((!isYes(fidelityDeclaration) || !normalize(fidelityDeclaration).includes('99')) && !visualException) {
    fail('declare explicitamente a fidelidade mínima de 99% ao mockup aprovado.');
  }

  if (visualException) {
    console.log('Evidência visual ausente aceita por impedimento/exceção registrado no PR.');
  }
}

if (process.exitCode) {
  console.error('\nPreencha a seção de evidência visual do PR antes de solicitar merge.');
  process.exit(process.exitCode);
}

console.log('Evidência visual obrigatória validada.');
