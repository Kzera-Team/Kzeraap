const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const pkg = JSON.parse(read('package.json'));
const version = read('src/app/appVersion.ts');
assert.strictEqual(pkg.version, '1.19.5', 'package deve estar em 1.15.1');
assert(version.includes("APP_VERSION = '1.19.5'"), 'APP_VERSION deve estar em 1.15.1');

const domain = read('src/domain/importacao/ImportacaoTransacoesFinanceiro.ts');
[
  'RegistroImportacaoTransacaoPayloadProtegido',
  'RegistroImportacaoFinanceiraPayloadProtegido',
  'RegistroImportacaoTransacaoRecord',
  'RegistroImportacaoFinanceiraRecord',
  'payloadProtegido',
  'tiposPendencia'
].forEach(term => assert(domain.includes(term), `domínio deve separar índice e payload protegido: ${term}`));

const repo = read('src/infrastructure/repositories/ImportacaoStagingRepository.ts');
[
  'PayloadProvider',
  'packJson(payload',
  'unpackJson<RegistroImportacaoTransacaoPayloadProtegido>',
  'unpackJson<RegistroImportacaoFinanceiraPayloadProtegido>',
  'toTransacaoRecord',
  'toFinanceiroRecord',
  'payloadProtegido'
].forEach(term => assert(repo.includes(term), `repositório seguro de staging deve conter ${term}`));

const app = read('src/app/createKzeraAuthenticatedApp.ts');
assert(app.includes('RegistroImportacaoTransacaoRepository'), 'app deve usar repositório protegido para staging de transações');
assert(app.includes('RegistroImportacaoFinanceiraRepository'), 'app deve usar repositório protegido para staging financeiro');
assert(app.includes('RegistroImportacaoTransacaoRecord'), 'app deve persistir record protegido de transação no IndexedDB');
assert(app.includes('RegistroImportacaoFinanceiraRecord'), 'app deve persistir record protegido financeiro no IndexedDB');

const recordTransacaoBlock = domain.match(/export interface RegistroImportacaoTransacaoRecord[\s\S]*?}\n/)[0];
const recordFinBlock = domain.match(/export interface RegistroImportacaoFinanceiraRecord[\s\S]*?}\n/)[0];
[
  'dadosBrutos',
  'dadosNormalizados',
  'clienteNomeImportado',
  'descricao',
  'observacao',
  'valorPago',
  'lucro',
  'custo',
  'pendencias:'
].forEach(term => {
  assert(!recordTransacaoBlock.includes(term), `record persistente de transações não pode guardar sensível em claro: ${term}`);
  assert(!recordFinBlock.includes(term), `record persistente financeiro não pode guardar sensível em claro: ${term}`);
});

const doc = read('docs/importacao/STAGING_PROTEGIDO_1.15.1.md');
[
  'dado sensível nunca deve ser gravado',
  'Ler CSV/TSV em memória',
  'Criptografar o payload sensível',
  'Não salvar `dadosBrutos` diretamente',
  'não recebe planilha aberta'
].forEach(term => assert(doc.includes(term), `doc de staging protegido incompleto: ${term}`));

const governanca = read('src/domain/governanca/OperacaoKzera.ts');
[
  'POLITICA_STAGING_IMPORTACAO_PROTEGIDO',
  'dadoSensivelNuncaPersistirAberto: true',
  'protegerAntesDoPrimeiroWrite: true',
  'payloadSensivelCriptografado: true',
  'docs/importacao/STAGING_PROTEGIDO_1.15.1.md'
].forEach(term => assert(governanca.includes(term), `governança deve registrar staging protegido: ${term}`));

console.log('staging-protegido-1151 ok');
