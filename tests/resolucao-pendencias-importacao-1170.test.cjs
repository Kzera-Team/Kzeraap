const fs = require('fs');
function read(path) { return fs.readFileSync(path, 'utf8'); }
function assert(condition, message) { if (!condition) throw new Error(message); }
const pkg = JSON.parse(read('package.json'));
const version = read('src/app/appVersion.ts');
const useCase = read('src/application/importacao/ResolverPendenciaImportacaoUseCase.ts');
const view = read('src/presentation/importacao/ImportacaoTransacoesFinanceiroView.ts');
const repo = read('src/infrastructure/repositories/ImportacaoStagingRepository.ts');
const doc = read('docs/aprovado-lider/desenvolvimento/transacoes-financeiras/importacao/regras/RESOLUCAO_PENDENCIAS_IMPORTACAO_1.17.2.md');
assert(pkg.version === '1.19.5', 'package deve estar em 1.19.3');
assert(version.includes("APP_VERSION = '1.19.5'"), 'APP_VERSION deve estar em 1.19.3');
assert(useCase.includes('vincular_financeiro'), 'Deve permitir vínculo financeiro guiado.');
assert(useCase.includes('marcar_revisao'), 'Deve permitir revisão manual.');
assert(useCase.includes('ignorar'), 'Deve permitir ignorar registro no staging.');
assert(view.includes('data-resolver-vinculo'), 'UI deve ter ação de vincular sugestão.');
assert(view.includes('data-resolver-revisao'), 'UI deve ter ação de revisão.');
assert(view.includes('data-resolver-ignorar'), 'UI deve ter ação de ignorar.');
assert(repo.includes('payloadProtegido'), 'Staging continua protegido.');
assert(doc.includes('não cria transação definitiva'), 'Documento deve manter limite da etapa.');
assert(doc.includes('não baixa estoque'), 'Documento deve manter bloqueio de baixa.');
console.log('resolucao-pendencias-importacao-1170.test.cjs OK');
