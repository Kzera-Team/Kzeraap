const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const perfil = fs.readFileSync('src/domain/perfil/Perfil.ts', 'utf8');
const filters = fs.readFileSync('src/domain/perfil/PerfilFilters.ts', 'utf8');
const pendencia = fs.readFileSync('src/domain/perfil/PerfilPendencia.ts', 'utf8');
const listar = fs.readFileSync('src/application/perfil/ListarPerfisUseCase.ts', 'utf8');
const arquivar = fs.readFileSync('src/application/perfil/ArquivarPerfilUseCase.ts', 'utf8');
const reativar = fs.readFileSync('src/application/perfil/ReativarPerfilUseCase.ts', 'utf8');
const importar = fs.readFileSync('src/application/perfil/ImportarPerfisSemBairroUseCase.ts', 'utf8');
const bairro = fs.readFileSync('src/application/perfil/AtualizarBairroPerfilUseCase.ts', 'utf8');
const codigo = fs.readFileSync('src/application/perfil/DefinirCodigoUseCase.ts', 'utf8');
const moduleFactory = fs.readFileSync('src/app/createPerfilModule.ts', 'utf8');
const docs = fs.readFileSync('docs/CLIENTE_MODULE_1.0.0.md', 'utf8');

assert(perfil.includes("PerfilStatus = 'ativo' | 'arquivado'"), 'Perfil precisa ter ativo/arquivado.');
assert(filters.includes('perfilEstaAptoParaCodigo'), 'Precisa detectar perfil apto para codigo.');
assert(pendencia.includes('apto_para_codigo'), 'Pendências precisam incluir apto para codigo.');
assert(listar.includes('filtrarPerfis'), 'Listagem precisa filtrar perfis.');
assert(arquivar.includes("status: 'arquivado'"), 'Arquivar precisa marcar status arquivado.');
assert(reativar.includes("status: 'ativo'"), 'Reativar precisa marcar status ativo.');
assert(importar.includes('ImportarPerfisSemBairroUseCase'), 'Precisa importar perfis sem bairro.');
assert(bairro.includes('Bairro não pode ser vazio'), 'Atualização de bairro precisa validar vazio.');
assert(codigo.includes('Codigo é imutável'), 'Codigo precisa ser imutável.');
assert(codigo.includes('Perfil precisa ter bairro'), 'Definir codigo precisa exigir bairro.');
assert(codigo.includes('Codigo gerado já existe'), 'Codigo precisa ser único.');
assert(moduleFactory.includes('createPerfilModule'), 'Precisa ter factory do módulo Perfil.');
assert(docs.includes('Perfil nunca é excluído'), 'Docs precisam registrar regra de não exclusão.');

console.log('perfil-module.test.cjs OK');
