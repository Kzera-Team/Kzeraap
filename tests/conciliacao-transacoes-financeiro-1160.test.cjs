const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = fs.readFileSync(path.join(root, 'src/app/appVersion.ts'), 'utf8');
const useCase = fs.readFileSync(path.join(root, 'src/application/importacao/ConciliarTransacoesFinanceiroUseCase.ts'), 'utf8');
const view = fs.readFileSync(path.join(root, 'src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src/app/createKzeraAuthenticatedApp.ts'), 'utf8');
const doc = fs.readFileSync(path.join(root, 'docs/importacao/CONCILIACAO_TRANSACOES_FINANCEIRO_1.16.0.md'), 'utf8');

assert.strictEqual(pkg.version, '1.19.5');
assert(version.includes("APP_VERSION = '1.19.5'"));
assert(useCase.includes('ConciliarTransacoesFinanceiroUseCase'));
assert(useCase.includes('pagamento_posterior_provavel'));
assert(useCase.includes('pendente_sem_financeiro'));
assert(useCase.includes('pendente_sem_transacao'));
assert(useCase.includes('divergencia_valor'));
assert(useCase.includes('normalizarTextoBusca'));
assert(!useCase.includes('Repository<ResultadoConciliacao'), 'Conciliação não deve criar tabela persistente nova com dados sensíveis.');
assert(view.includes('data-conciliar-importacao'));
assert(view.includes('Conferência dos pagamentos')); // UI humana; regra interna continua conciliação
assert(app.includes('new ConciliarTransacoesFinanceiroUseCase'));
assert(doc.includes('Não cria tabela nova') || doc.includes('não cria tabela nova'));
console.log('conciliacao-transacoes-financeiro-1160 ok');
