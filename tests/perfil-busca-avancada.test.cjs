const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const domain = fs.readFileSync('src/domain/perfil/PerfilBusca.ts','utf8');
const usecase = fs.readFileSync('src/application/perfil/BuscarPerfisUseCase.ts','utf8');
const factory = fs.readFileSync('src/app/createPerfilModule.ts','utf8');
assert(domain.includes('conhecePessoalmente'), 'Busca precisa filtrar conhece pessoalmente.');
assert(domain.includes('normalizarTelefone'), 'Busca precisa suportar telefone.');
assert(domain.includes('bairro'), 'Busca precisa suportar bairro.');
assert(domain.includes('municipio'), 'Busca precisa suportar cidade/município.');
assert(usecase.includes('Repository<Perfil>'), 'Busca precisa usar repositório.');
assert(factory.includes('buscar'), 'Factory precisa expor busca.');
console.log('perfil-busca-avancada.test.cjs OK');
