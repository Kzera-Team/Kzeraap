const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const domain = fs.readFileSync('src/domain/perfil/PerfilImportacaoErro.ts','utf8');
const usecase = fs.readFileSync('src/application/perfil/ExportarErrosImportacaoPerfilUseCase.ts','utf8');
const factory = fs.readFileSync('src/app/createPerfilModule.ts','utf8');
assert(domain.includes('PerfilImportacaoErro'), 'Precisa modelar erro de importação.');
assert(domain.includes('exportarErrosImportacaoCsv'), 'Precisa exportar erros CSV.');
assert(usecase.includes('ExportarErrosImportacaoPerfilUseCase'), 'Precisa use case exportar erros.');
assert(factory.includes('exportarErrosImportacao'), 'Factory precisa expor exportar erros.');
console.log('perfil-importacao-erros.test.cjs OK');
