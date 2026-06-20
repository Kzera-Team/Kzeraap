const fs = require('fs');
const assert = require('assert');
const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
const itemTemplate = fs.readFileSync('src/presentation/item/templates/ItemCatalogoTemplate.ts', 'utf8');
const itemEdit = fs.readFileSync('src/presentation/item/renderers/ItemEditCardRenderer.ts', 'utf8');

assert(app.includes('kzera-drawer'), 'Menu lateral deve existir.');
assert(app.includes("['itens', 'Itens']"), 'Menu deve ter Itens.');
assert(!app.includes("['estoque', 'Estoque']"), 'Estoque não deve ficar como item separado do menu.');
assert(!app.includes('data-nav="estoque"'), 'Não deve haver navegação direta para Estoque.');
assert(itemTemplate.includes('data-item-form-tab="variacoes"'), 'Variações deve ser aba dentro do cadastro do item.');
assert(itemEdit.includes('data-item-edit-tab="variacoes"'), 'Variações deve ser aba dentro da edição do item.');
assert(itemTemplate.includes('Variações e estoque'), 'Cadastro deve usar o conceito correto: variações e estoque.');
assert(itemEdit.includes('Variações e estoque'), 'Edição deve usar o conceito correto: variações e estoque.');
assert(!itemTemplate.includes('data-item-form-tab="estoque"'), 'Não deve existir aba conceitual de Estoque contendo variações.');
assert(!itemEdit.includes('data-item-edit-tab="estoque"'), 'Não deve existir aba conceitual de Estoque contendo variações.');
assert(!app.includes('Estoque</strong><small>'), 'Dashboard não deve ter card solto de Estoque.');
console.log('navigation-item-stock-1934.test.cjs OK');
