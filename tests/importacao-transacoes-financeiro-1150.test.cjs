const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

const domain = read('src/domain/importacao/ImportacaoTransacoesFinanceiro.ts');
const prepTransações = read('src/application/importacao/PrepararImportacaoTransacoesUseCase.ts');
const prepFin = read('src/application/importacao/PrepararImportacaoFinanceiraUseCase.ts');
const view = read('src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts');
const app = read('src/app/createKzeraAuthenticatedApp.ts');
const backup = read('src/application/backup/BackupExportUseCase.ts');
const docs = read('docs/importacao/STAGING_TRANSACOES_FINANCEIRO_1.15.1.md');
const pkg = JSON.parse(read('package.json'));

assert.strictEqual(pkg.version, '1.19.27', 'package deve estar na versão 1.15.1');
assert(read('src/app/appVersion.ts').includes("1.19.27"), 'appVersion deve estar em 1.15.1');

[
  'LoteImportacaoTransacoes',
  'RegistroImportacaoTransacao',
  'LoteImportacaoFinanceira',
  'RegistroImportacaoFinanceira',
  'parseTabelaDelimitada',
  'normalizarTransacaoImportada',
  'normalizarMovimentoImportado',
  'extrairNumeroTransacaoDaDescricaoFinanceira',
  'cliente_nao_encontrado',
  'item_nao_encontrado',
  'transacao_nao_encontrada'
].forEach(token => assert(domain.includes(token), `domínio de staging deve conter ${token}`));

assert(prepTransações.includes('perfilIdResolvido'), 'importação de transações deve tentar resolver Perfil');
assert(prepTransações.includes('cliente_nao_encontrado'), 'cliente inexistente deve virar pendência');
assert(prepTransações.includes('item_nao_encontrado'), 'item inexistente deve virar pendência');
assert(prepTransações.includes('await this.registros.save'), 'registros de transação devem ser persistidos em staging');

assert(prepFin.includes('numeroTransacaoReferenciado'), 'financeiro deve extrair referência de transação');
assert(prepFin.includes('transacao_nao_encontrada'), 'movimento sem transação correspondente deve ficar pendente');
assert(prepFin.includes('await this.registros.save'), 'registros financeiros devem ser persistidos em staging');

assert(view.includes('data-testid="importacao-transacoes-financeiro"'), 'UI de staging de transações/financeiro deve existir');
assert(view.includes('Nada vira registro definitivo') && view.includes('nada baixa estoque'), 'UI deve deixar claro em linguagem humana que nada confirma nem baixa estoque');
assert(app.includes('💰 Transações/Financeiro'), 'hub de importação deve ter aba de transações/financeiro');
assert(app.includes('lotesImportacaoTransacoes'), 'app deve criar repositórios de staging de transações');
assert(app.includes('registrosImportacaoFinanceira'), 'app deve criar repositórios de staging financeiro');
assert(backup.includes('lotesImportacaoTransacoes'), 'backup deve incluir lotes de importação de transações');
assert(backup.includes('registrosImportacaoFinanceira'), 'backup deve incluir staging financeiro');

assert(docs.includes('CSV → staging persistente'), 'documentação deve registrar fluxo de staging');
assert(docs.includes('não baixa estoque') || docs.includes('baixa estoque'), 'documentação deve tratar a regra de não baixar estoque nesta etapa');
assert(docs.includes('pendente_cliente'), 'documentação deve registrar pendência de cliente');

console.log('importacao-transacoes-financeiro-1150 ok');
