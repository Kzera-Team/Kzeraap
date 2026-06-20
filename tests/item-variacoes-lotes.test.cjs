const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const domain = fs.readFileSync(path.join(root, 'src/domain/item/ItemCatalogo.ts'), 'utf8');
const template = fs.readFileSync(path.join(root, 'src/presentation/item/templates/ItemCatalogoTemplate.ts'), 'utf8');
const binder = fs.readFileSync(path.join(root, 'src/presentation/item/binders/ItemFormBinder.ts'), 'utf8');
const card = fs.readFileSync(path.join(root, 'src/presentation/item/renderers/ItemCardRenderer.ts'), 'utf8');

assert(domain.includes('export interface ItemVariacao'), 'Item deve declarar variações.');
assert(domain.includes('export interface ItemLote'), 'Item deve declarar lotes.');
assert(domain.includes('estoqueTotalDoItem'), 'Estoque total do item deve ser derivado das variações/lotes.');
assert(domain.includes('valor: number'), 'Valor deve existir no lote.');
assert(domain.includes('custo: number'), 'Custo deve existir no lote.');
assert(domain.includes('quantidade: number'), 'Quantidade deve existir no lote.');
assert(template.includes('Variação inicial'), 'Cadastro de item deve expor variação inicial.');
assert(template.includes('item-lote-valor'), 'Cadastro deve capturar valor do lote.');
assert(template.includes('item-lote-custo'), 'Cadastro deve capturar custo do lote.');
assert(template.includes('item-lote-quantidade'), 'Cadastro deve capturar quantidade do lote.');
assert(binder.includes('variacaoNome'), 'Binder deve enviar nome da variação.');
assert(binder.includes('loteValor'), 'Binder deve enviar valor do lote.');
assert(card.includes('Estoque total'), 'Card deve exibir estoque total derivado.');
console.log('item-variacoes-lotes.test.cjs OK');
