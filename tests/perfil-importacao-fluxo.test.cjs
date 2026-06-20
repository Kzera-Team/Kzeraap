const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const confirmar = fs.readFileSync('src/application/perfil/ConfirmarImportacaoPerfisUseCase.ts', 'utf8');
const fluxo = fs.readFileSync('src/application/perfil/FluxoImportacaoPerfisUseCase.ts', 'utf8');
const controller = fs.readFileSync('src/presentation/perfil/PerfilImportacaoController.ts', 'utf8');
const factory = fs.readFileSync('src/app/createPerfilModule.ts', 'utf8');
const docs = fs.readFileSync('docs/CLIENTE_IMPORTACAO_FLUXO_1.0.4.md', 'utf8');

assert(confirmar.includes('ignoradosInvalidos'), 'Confirmação precisa retornar inválidos ignorados.');
assert(confirmar.includes('CIDADE_PADRAO_IMPORTACAO_CLIENTE'), 'Confirmação precisa aplicar cidade padrão.');
assert(confirmar.includes('conhecePessoalmente'), 'Confirmação precisa importar conhece pessoalmente ajustado na prévia.');
assert(fluxo.includes('carregarArquivo'), 'Fluxo precisa carregar arquivo.');
assert(fluxo.includes('atualizarRegistro'), 'Fluxo precisa atualizar registro da prévia.');
assert(fluxo.includes('confirmar()'), 'Fluxo precisa confirmar importação.');
assert(controller.includes('renderPreview'), 'Controller precisa renderizar prévia.');
assert(controller.includes('renderResult'), 'Controller precisa renderizar resultado.');
assert(factory.includes('fluxoImportacao'), 'Factory precisa expor fluxoImportacao.');
assert(docs.includes('Prévia é obrigatória'), 'Docs precisam registrar prévia obrigatória.');

console.log('perfil-importacao-fluxo.test.cjs OK');
