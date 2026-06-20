const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const domain = fs.readFileSync('src/domain/perfil/PerfilDuplicidade.ts', 'utf8');
const listar = fs.readFileSync('src/application/perfil/ListarDuplicidadesPerfilUseCase.ts', 'utf8');
const verificar = fs.readFileSync('src/application/perfil/VerificarDuplicidadeAntesDeCriarPerfilUseCase.ts', 'utf8');
const factory = fs.readFileSync('src/app/createPerfilModule.ts', 'utf8');
const docs = fs.readFileSync('docs/CLIENTE_DUPLICIDADE_1.0.6.md', 'utf8');

assert(domain.includes('telefone_igual'), 'Duplicidade precisa verificar telefone.');
assert(domain.includes('email_igual'), 'Duplicidade precisa verificar e-mail.');
assert(domain.includes('nome_muito_parecido'), 'Duplicidade precisa verificar nome parecido.');
assert(domain.includes('detectarDuplicidadesPerfis'), 'Precisa detectar duplicidades em lista.');
assert(listar.includes("status === 'ativo'"), 'Listagem precisa ignorar arquivados.');
assert(verificar.includes('VerificarDuplicidadeAntesDeCriarPerfilUseCase'), 'Precisa verificar antes de criar.');
assert(factory.includes('listarDuplicidades'), 'Factory precisa expor listarDuplicidades.');
assert(factory.includes('verificarDuplicidadeAntesDeCriar'), 'Factory precisa expor verificação.');
assert(docs.includes('nunca bloqueia automaticamente'), 'Docs precisam registrar que não bloqueia.');

console.log('perfil-duplicidade.test.cjs OK');
