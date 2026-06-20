const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

const docs = [
  'docs/seguranca/TRAVAS_DADOS_SENSIVEIS_1.15.3.md',
  'docs/importacao/STAGING_PROTEGIDO_1.15.1.md',
  'docs/governanca/01_LEIA_ANTES_DE_ALTERAR_CODIGO.md',
  'docs/governanca/05_LICOES_APRENDIDAS.md',
  'docs/governanca/06_CHECKLIST_ENTREGA_OBRIGATORIO.md',
];

docs.forEach(file => assert.ok(fs.existsSync(path.join(root, file)), `Documento obrigatório ausente: ${file}`));

const seguranca = read('docs/seguranca/TRAVAS_DADOS_SENSIVEIS_1.15.3.md');
assert.match(seguranca, /nem provisoriamente por alguns milissegundos/i, 'Regra de milissegundos precisa estar explícita.');
assert.match(seguranca, /criminoso curioso/i, 'Persona criminoso curioso precisa estar explícita.');
assert.match(seguranca, /hacker/i, 'Persona hacker precisa estar explícita.');
assert.match(seguranca, /invasor/i, 'Persona invasor precisa estar explícita.');

const governanca = read('src/domain/governanca/OperacaoKzera.ts');
assert.match(governanca, /POLITICA_DADOS_SENSIVEIS_PERSISTENCIA/, 'Política de persistência sensível precisa estar no domínio de governança.');
assert.match(governanca, /PERSONAS_SEGURANCA_ADVERSARIA/, 'Personas adversárias precisam estar no domínio de governança.');
assert.match(governanca, /criminoso curioso/, 'Governança deve usar criminoso curioso.');
assert.match(governanca, /hacker/, 'Governança deve usar hacker.');
assert.match(governanca, /invasor/, 'Governança deve usar invasor.');

const importacaoDomain = read('src/domain/importacao/ImportacaoTransacoesFinanceiro.ts');
function interfaceBody(name) {
  const marker = `export interface ${name}`;
  const start = importacaoDomain.indexOf(marker);
  assert.ok(start >= 0, `Interface ${name} não encontrada.`);
  const braceStart = importacaoDomain.indexOf('{', start);
  const end = importacaoDomain.indexOf('\n}', braceStart);
  assert.ok(braceStart >= 0 && end > braceStart, `Corpo da interface ${name} não encontrado.`);
  return importacaoDomain.slice(braceStart + 1, end);
}

const transaçãoRecord = interfaceBody('RegistroImportacaoTransacaoRecord');
const financeiroRecord = interfaceBody('RegistroImportacaoFinanceiraRecord');
const forbiddenOpenFields = [
  'dadosBrutos',
  'dadosNormalizados',
  'clienteNomeImportado',
  'descricao',
  'observacao',
  'valorPago',
  'custo',
  'lucro',
  'pagamentos',
  'valor:',
  'taxa',
  'metodoPagamento',
];
for (const field of forbiddenOpenFields) {
  assert.ok(!transaçãoRecord.includes(field), `RegistroImportacaoTransacaoRecord não pode persistir aberto: ${field}`);
  assert.ok(!financeiroRecord.includes(field), `RegistroImportacaoFinanceiraRecord não pode persistir aberto: ${field}`);
}
assert.ok(transaçãoRecord.includes('payloadProtegido'), 'Registro de transação importada precisa usar payloadProtegido.');
assert.ok(financeiroRecord.includes('payloadProtegido'), 'Registro financeiro importado precisa usar payloadProtegido.');

const transaçãoPayload = interfaceBody('RegistroImportacaoTransacaoPayloadProtegido');
const financeiroPayload = interfaceBody('RegistroImportacaoFinanceiraPayloadProtegido');
['dadosBrutos', 'dadosNormalizados', 'clienteNomeImportado', 'pendencias'].forEach(field => {
  assert.ok(transaçãoPayload.includes(field), `Payload protegido de transação deve conter ${field}.`);
  assert.ok(financeiroPayload.includes(field), `Payload protegido financeiro deve conter ${field}.`);
});

const repo = read('src/infrastructure/repositories/ImportacaoStagingRepository.ts');
assert.match(repo, /packJson\(payload/, 'Staging precisa proteger payload antes de salvar.');
assert.match(repo, /records\.save\(toTransacaoRecord\(registro, payloadProtegido\)\)/, 'Transação staging deve salvar apenas record protegido.');
assert.match(repo, /records\.save\(toFinanceiroRecord\(registro, payloadProtegido\)\)/, 'Financeiro staging deve salvar apenas record protegido.');


console.log('✅ Travas 1.15.3 validadas: dados sensíveis protegidos antes do primeiro write e persona adversária correta.');
