const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const domain = fs.readFileSync('src/domain/perfil/PerfilImportacao.ts', 'utf8');
const preparar = fs.readFileSync('src/application/perfil/PrepararImportacaoPerfisUseCase.ts', 'utf8');
const importar = fs.readFileSync('src/application/perfil/ImportarPerfisSemBairroUseCase.ts', 'utf8');
const view = fs.readFileSync('src/presentation/perfil/PerfilImportacaoPreviewView.ts', 'utf8');
const docs = fs.readFileSync('docs/CLIENTE_IMPORTACAO_1.0.1.md', 'utf8');

assert(domain.includes("CIDADE_PADRAO_IMPORTACAO_CLIENTE = 'Brasília'"), 'Cidade padrão precisa ser Brasília.');
assert(domain.includes('conhecePessoalmente: false'), 'Preview precisa iniciar conhece pessoalmente como false.');
assert(domain.includes('bairro'), 'Preview precisa incluir bairro.');
assert(preparar.includes('PrepararImportacaoPerfisUseCase'), 'Precisa ter use case de preparar importação.');
assert(importar.includes('municipio: input.cidade || CIDADE_PADRAO_IMPORTACAO_CLIENTE'), 'Importação precisa aplicar cidade padrão.');
assert(importar.includes('bairro: input.bairro'), 'Importação precisa persistir bairro quando preenchido.');
assert(view.includes('podeEditarConhecePessoalmente: true'), 'Tela/VM precisa permitir editar conhece pessoalmente.');
assert(view.includes('podeEditarBairro: true'), 'Tela/VM precisa permitir editar bairro.');
assert(docs.includes('checkbox `Conhece Pessoalmente`'), 'Docs precisam registrar checkbox por registro.');

console.log('perfil-importacao-preview.test.cjs OK');
