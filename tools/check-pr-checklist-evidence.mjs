#!/usr/bin/env node
import fs from 'node:fs';

const bodyPath = process.argv[2];
const body = (bodyPath ? fs.readFileSync(bodyPath, 'utf8') : process.env.PR_BODY || '').replace(/\r\n/g, '\n');

const requiredChecks = [
  'Processo dev aplicado antes de codar',
  'Checklist dev aplicado antes de codar',
  'Checklist dev aplicado depois de codar',
  'Pedido classificado',
  'Escopo permitido/proibido declarado',
  'Plano técnico antes de codar registrado',
  'Reutilização comprovada',
  'Responsabilidade correta comprovada',
  'Ausência de duplicação revisada',
  'Local correto confirmado',
  'Evidência/prova diferenciadas',
  'Escopo da garantia declarado',
  'Versionamento do README atualizado quando aplicável',
];

const requiredFields = [
  'Tipo da alteração',
  'Pedido recebido',
  'O que alterei',
  'O que não alterei',
  'Arquivos/camadas permitidos',
  'Arquivos/camadas proibidos',
  'Comportamento que não podia mudar',
  'A alteração mistura feature, refatoração, visual, mockup ou processo? (sim/não + justificativa se sim)',
  'Problema',
  'Comportamento atual',
  'Arquivos previstos',
  'Responsabilidade de cada arquivo',
  'Reutilização encontrada',
  'O que era proibido tocar',
  'Critério de bloqueio',
  'Evidência final esperada',
  'Arquivos/pastas verificados antes de codar',
  'Onde procurei reutilização',
  'Dono da responsabilidade definido',
  'Risco de duplicação identificado',
  'Arquivos alterados',
  'O que reaproveitei',
  'O que extraí/removi por duplicação',
  'Riscos bloqueados',
  'Tipo de validação feita',
  'O que é evidência',
  'O que é prova técnica',
  'Escopo da garantia',
  'Limites / não validado',
  'Novo controle/trava/checklist/workflow foi adicionado? (sim/não + se sim, por que entra agora e não como controle futuro)',
  'Versionamento/alterações no README de processo atualizados? (sim/não/não aplicável + motivo)',
  'Há impedimento? (sim/não)'
];

function fail(message) {
  console.error(`Checklist obrigatório inválido: ${message}`);
  process.exitCode = 1;
}

function hasCheckedItem(label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^- \\[[xX]\\]\\s+${escaped}\\s*$`, 'm').test(body);
}

function getFieldValue(label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`${escaped}:\\s*\\n([\\s\\S]*?)(?=\\n(?:[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^\\n]{0,90}:|## |# |- \\[[ xX]\\] )|$)`, 'm');
  const match = body.match(pattern);
  return match ? match[1].trim() : '';
}

function isPlaceholder(value) {
  const normalized = value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return !normalized || normalized === '-' || normalized === 'n/a' || normalized === 'na' || normalized === 'não se aplica' || normalized === 'nao se aplica';
}

if (!body.trim()) {
  fail('corpo do PR vazio. Preencha o template obrigatório.');
}

for (const label of requiredChecks) {
  if (!hasCheckedItem(label)) {
    fail(`marque o item obrigatório: "${label}".`);
  }
}

for (const label of requiredFields) {
  const value = getFieldValue(label);
  if (isPlaceholder(value)) {
    fail(`preencha a evidência: "${label}".`);
  }
}


const impedimentValue = getFieldValue('Há impedimento? (sim/não)').toLowerCase();
const hasImpediment = /^sim\b/.test(impedimentValue);
const hasNoImpediment = /^n[aã]o\b/.test(impedimentValue);

if (!hasImpediment && !hasNoImpediment) {
  fail('informe "sim" ou "não" em "Há impedimento? (sim/não)".');
}

function hasCheckedAny(labels) {
  return labels.some(label => hasCheckedItem(label));
}

if (hasImpediment) {
  const requiredImpedimentFields = [
    'Impedimento',
    'Impacto',
    'Garantia limitada',
    'Não garantido',
    'Decisão',
    'Responsável pela decisão/exceção',
    'Ação posterior ou prazo'
  ];

  for (const label of requiredImpedimentFields) {
    const value = getFieldValue(label);
    if (isPlaceholder(value)) {
      fail(`impedimento declarado exige preenchimento de: "${label}".`);
    }
  }

  if (!hasCheckedAny(['Não bloqueante', 'Bloqueante aceito por exceção', 'Pendente para tarefa separada'])) {
    fail('impedimento declarado exige classificação marcada.');
  }

  if (hasCheckedItem('Bloqueante aceito por exceção')) {
    const exceptionApproval = getFieldValue('Aprovação do dono');
    const exceptionResponsible = getFieldValue('Responsável pela exceção');
    const exceptionDeadline = getFieldValue('Prazo de revisão da exceção');

    if (isPlaceholder(exceptionApproval)) {
      fail('impedimento bloqueante aceito por exceção exige "Aprovação do dono".');
    }

    if (isPlaceholder(exceptionResponsible)) {
      fail('impedimento bloqueante aceito por exceção exige "Responsável pela exceção".');
    }

    if (isPlaceholder(exceptionDeadline)) {
      fail('impedimento bloqueante aceito por exceção exige "Prazo de revisão da exceção".');
    }
  }
}

if (!hasImpediment && !hasCheckedItem('Não há impedimento')) {
  fail('quando não houver impedimento, marque "Não há impedimento".');
}


if (process.exitCode) {
  console.error('\nPreencha .github/pull_request_template.md com evidência real antes de solicitar merge.');
  process.exit(process.exitCode);
}

console.log('Checklist obrigatório preenchido com evidência mínima.');
