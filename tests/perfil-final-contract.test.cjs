const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const factory = fs.readFileSync('src/app/createPerfilModule.ts','utf8');
const merge = fs.readFileSync('src/application/perfil/MesclarPerfisUseCase.ts','utf8');
const docs = fs.readFileSync('docs/CLIENTE_FINAL_1.1.0.md','utf8');
assert(factory.includes('pendenciasDashboard'), 'Factory precisa pendenciasDashboard.');
assert(factory.includes('selecionar'), 'Factory precisa selecionar.');
assert(factory.includes('exportar'), 'Factory precisa exportar.');
assert(factory.includes('mesclar'), 'Factory precisa mesclar.');
assert(factory.includes('salvarRegraIdentidade'), 'Factory precisa salvar regra.');
assert(factory.includes('previewRegraIdentidade'), 'Factory precisa preview regra.');
assert(merge.includes("status: 'arquivado'"), 'Mesclagem precisa arquivar secundário.');
assert(docs.includes('Perfil nunca é excluído'), 'Docs finais precisam contrato perfil.');
console.log('perfil-final-contract.test.cjs OK');
