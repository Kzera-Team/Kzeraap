const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const template = fs.readFileSync('src/domain/perfil/PerfilImportacaoTemplate.ts', 'utf8');
const domain = fs.readFileSync('src/domain/perfil/PerfilImportacao.ts', 'utf8');
const parser = fs.readFileSync('src/domain/perfil/PerfilImportacaoParser.ts', 'utf8');
const binder = fs.readFileSync('src/presentation/perfil/binders/PerfilImportacaoBinder.ts', 'utf8');
const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
const css = fs.readFileSync('public/styles.css', 'utf8');

assert(template.includes("campo: 'telefone',\n    obrigatorio: true"), 'Telefone deve ser obrigatório no template.');
assert(domain.includes("Telefone é obrigatório."), 'Preview deve mostrar telefone obrigatório.');
assert(parser.includes('if (value.trim())'), 'Parser deve preservar celular preenchido.');
assert(parser.includes('if (current === undefined)'), 'Telefone vazio posterior não pode apagar celular.');
assert(!binder.includes("input.addEventListener('input', async ()"), 'Input da importação não pode rerenderizar a cada tecla.');
assert(binder.includes("input.addEventListener('blur', async ()"), 'Nome/telefone devem atualizar no blur.');
assert(app.includes('function isTextEntryActive()'), 'App deve detectar campo ativo.');
assert(app.includes('if (autoFaceIdTried || isTextEntryActive()) return;'), 'Face ID automático não deve disputar com senha focada.');
assert(app.includes('function bindSwipeNavigation()'), 'Gesto de navegação deve existir.');
assert(app.includes("closest('input, textarea, select, [contenteditable=\"true\"]')"), 'Gesto deve ignorar campos editáveis.');
assert(css.includes('grid-template-columns: 64px minmax(0, 1fr) !important;'), 'Card de upload não deve ter coluna externa para o botão.');
assert(css.includes('"icon action"'), 'Botão Trocar deve ficar dentro da grade do card.');
assert(css.includes('overflow: hidden !important;'), 'Card deve impedir conteúdo para fora.');

console.log('perfil-importacao-senhora-cansada-11925.test.cjs OK');
