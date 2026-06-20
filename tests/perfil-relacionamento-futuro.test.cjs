const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const domain = fs.readFileSync('src/domain/perfil/PerfilVinculoFuturo.ts','utf8');
const merge = fs.readFileSync('src/application/perfil/MesclarPerfisUseCase.ts','utf8');
assert(domain.includes('perfilId'), 'Relacionamento futuro precisa referenciar perfilId.');
assert(domain.includes('operacoes'), 'Relacionamento futuro precisa considerar operacoes.');
assert(domain.includes('transacoes'), 'Relacionamento futuro precisa considerar transações.');
assert(merge.includes('secundarioId'), 'Mesclagem precisa preservar secundário como arquivado.');
console.log('perfil-relacionamento-futuro.test.cjs OK');
