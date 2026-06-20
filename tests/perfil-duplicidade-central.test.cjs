const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const domain = fs.readFileSync('src/domain/perfil/PerfilDuplicidadeResolucao.ts','utf8');
const usecase = fs.readFileSync('src/application/perfil/IgnorarDuplicidadePerfilUseCase.ts','utf8');
const factory = fs.readFileSync('src/app/createPerfilModule.ts','utf8');
assert(domain.includes('ignorada'), 'Resolução precisa permitir ignorada.');
assert(domain.includes('mesclada'), 'Resolução precisa permitir mesclada.');
assert(usecase.includes('IgnorarDuplicidadePerfilUseCase'), 'Precisa use case ignorar duplicidade.');
assert(factory.includes('ignorarDuplicidade'), 'Factory precisa expor ignorar duplicidade.');
console.log('perfil-duplicidade-central.test.cjs OK');
