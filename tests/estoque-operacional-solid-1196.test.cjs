const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

const editor = read('src/application/item/LoteOperacionalEditor.ts');
const inventario = read('src/application/item/RegistrarInventarioLoteUseCase.ts');
const saida = read('src/application/item/RegistrarSaidaInternaLoteUseCase.ts');
const modulo = read('src/app/createItemCatalogoModule.ts');
const unidade = read('src/domain/item/UnidadeOperacional.ts');

assert(editor.includes('class LoteOperacionalEditor'), 'Deve existir editor operacional do lote.');
assert(editor.includes('type LoteOperacionalEditFn'), 'Editor deve receber callback pequeno de edição.');
assert(editor.includes('items.getById'), 'Editor concentra busca do item.');
assert(editor.includes('items.save'), 'Editor concentra persistência do item.');
assert(editor.includes('Variação não encontrada'), 'Editor valida variação.');
assert(editor.includes('Lote não encontrado'), 'Editor valida lote.');

assert(inventario.includes('RegistrarInventarioLoteUseCase'), 'Inventário deve ter use case próprio.');
assert(!inventario.includes('items.getById'), 'Inventário não deve duplicar busca de item.');
assert(!inventario.includes('items.save'), 'Inventário não deve duplicar persistência.');
assert(inventario.includes('linhaGuardado'), 'Inventário deve isolar linha de guardado.');
assert(inventario.includes('linhaFracao'), 'Inventário deve isolar linha de fração.');
assert(inventario.includes('criarConferencia'), 'Inventário deve isolar criação de conferência.');
assert(inventario.includes('exigirUnidadeOperacional'), 'Inventário deve validar unidade pela fonte única.');
assert(inventario.includes('unidadeBanco'), 'Inventário deve usar unidade interna pela fonte única.');
assert(!inventario.includes("unidadeContagem: 'mg'"), 'Inventário não deve fixar mg fora da fonte única.');

assert(saida.includes('RegistrarSaidaInternaLoteUseCase'), 'Saída interna deve ter use case próprio.');
assert(!saida.includes('items.getById'), 'Saída interna não deve duplicar busca de item.');
assert(!saida.includes('items.save'), 'Saída interna não deve duplicar persistência.');
assert(saida.includes('saidaGuardado'), 'Saída do guardado deve ficar isolada.');
assert(saida.includes('saidaFracionamento'), 'Saída de fracionamento deve ficar isolada.');
assert(saida.includes('criarRegistro'), 'Saída interna deve isolar criação de histórico.');
assert(saida.includes('comStatusAtualizado'), 'Saída interna deve isolar regra de status.');

assert(unidade.includes("export type UnidadeOperacional = 'g' | 'ml'"), 'Fonte única deve liberar só g e ml por enquanto.');
assert(unidade.includes("{ unidade: 'g', unidadeBanco: 'mg', fatorTelaParaBanco: 1000 }"), 'g deve gravar em mg.');
assert(unidade.includes("{ unidade: 'ml', unidadeBanco: 'ml', fatorTelaParaBanco: 1 }"), 'ml deve gravar em ml.');
assert(!unidade.includes("'und'"), 'und ainda não deve entrar na fonte fixa atual.');

assert(modulo.includes('new LoteOperacionalEditor(items, clock)'), 'Módulo deve compor editor operacional.');
assert(modulo.includes('registrarInventario'), 'Módulo deve expor inventário.');
assert(modulo.includes('registrarSaidaInterna'), 'Módulo deve expor saída interna.');

console.log('estoque-operacional-solid-1196.test.cjs OK');
