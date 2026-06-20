const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const domain = fs.readFileSync('src/domain/perfil/PerfilExportacao.ts','utf8');
const usecase = fs.readFileSync('src/application/perfil/ExportarPerfisUseCase.ts','utf8');
assert(domain.includes('incluirNomeReal'), 'Exportação precisa flag nome real.');
assert(domain.includes("perfil.codigo || 'Sem codigo'"), 'Exportação padrão precisa usar codigo.');
assert(domain.includes('perfisExportacaoParaCsv'), 'Precisa gerar CSV.');
assert(usecase.includes('ExportarPerfisUseCase'), 'Precisa use case exportar.');
console.log('perfil-exportacao.test.cjs OK');
