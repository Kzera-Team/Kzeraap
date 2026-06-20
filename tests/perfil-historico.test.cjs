const fs = require('fs');
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const domain = fs.readFileSync('src/domain/perfil/PerfilHistorico.ts','utf8');
const reg = fs.readFileSync('src/application/perfil/RegistrarHistoricoPerfilUseCase.ts','utf8');
const list = fs.readFileSync('src/application/perfil/ListarHistoricoPerfilUseCase.ts','utf8');
const factory = fs.readFileSync('src/app/createPerfilModule.ts','utf8');
assert(domain.includes('PerfilHistoricoEvento'), 'Precisa evento de histórico.');
assert(domain.includes('codigo_definido'), 'Histórico precisa incluir código definido.');
assert(reg.includes('RegistrarHistoricoPerfilUseCase'), 'Precisa registrar histórico.');
assert(list.includes('ListarHistoricoPerfilUseCase'), 'Precisa listar histórico.');
assert(factory.includes('registrarHistorico'), 'Factory precisa registrar histórico.');
assert(factory.includes('listarHistorico'), 'Factory precisa listar histórico.');
console.log('perfil-historico.test.cjs OK');
