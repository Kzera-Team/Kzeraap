const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const domain = fs.readFileSync('src/domain/perfil/PerfilSelecao.ts','utf8');
const usecase = fs.readFileSync('src/application/perfil/SelecionarPerfilUseCase.ts','utf8');
assert(domain.includes('PerfilSelecaoItem'), 'Precisa item de seleção.');
assert(domain.includes("status === 'ativo'"), 'Seleção padrão precisa filtrar ativos.');
assert(domain.includes('perfil.codigo || perfil.nome'), 'Seleção precisa usar codigo ou nome.');
assert(usecase.includes('SelecionarPerfilUseCase'), 'Precisa use case selecionar.');
console.log('perfil-selecao.test.cjs OK');
