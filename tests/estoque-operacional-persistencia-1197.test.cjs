const fs = require('fs');
const assert = require('assert');

const indexedDbRepository = fs.readFileSync('src/infrastructure/repositories/IndexedDbRepository.ts', 'utf8');
const inMemoryRepository = fs.readFileSync('src/infrastructure/repositories/InMemoryRepository.ts', 'utf8');
const app = fs.readFileSync('src/app/createKzeraAuthenticatedApp.ts', 'utf8');
const itemModule = fs.readFileSync('src/app/createItemCatalogoModule.ts', 'utf8');
const inventario = fs.readFileSync('src/application/item/RegistrarInventarioLoteUseCase.ts', 'utf8');
const saida = fs.readFileSync('src/application/item/RegistrarSaidaInternaLoteUseCase.ts', 'utf8');

assert(indexedDbRepository.includes('store.put(entity)'), 'IndexedDB deve persistir o objeto inteiro, sem whitelist que perca campos operacionais.');
assert(indexedDbRepository.includes('store.get(id)'), 'IndexedDB deve reler o objeto persistido por id.');
assert(indexedDbRepository.includes('store.getAll()'), 'IndexedDB deve listar objetos persistidos inteiros.');

assert(inMemoryRepository.includes('structuredClone(entity)'), 'InMemoryRepository deve clonar o objeto inteiro em save/get/list.');
assert(inMemoryRepository.includes('this.data.set(entity.id, structuredClone(entity))'), 'InMemoryRepository não pode filtrar campos operacionais.');

assert(app.includes("createOperationalRepository<ItemCatalogo>('itens')"), 'Itens devem usar repository operacional persistente.');
assert(app.includes("stores: ['perfis', 'itens', 'balancas'"), 'IndexedDB operacional deve conter store de itens.');

assert(itemModule.includes('registrarInventario'), 'Módulo de item deve expor inventário operacional.');
assert(itemModule.includes('registrarSaidaInterna'), 'Módulo de item deve expor saída interna operacional.');

assert(inventario.includes('conferencias: [conferencia, ...lote.conferencias]'), 'Inventário deve persistir conferências no lote.');
assert(saida.includes('retiradasInternas:'), 'Saída interna deve persistir histórico de retiradas.');
assert(saida.includes('quantidadeGuardada:'), 'Saída interna deve persistir baixa no guardado.');
assert(saida.includes('quantidadeUnidadesDisponiveis:'), 'Saída interna deve persistir baixa de frações.');
assert(saida.includes("status: estoqueBaseDisponivelDoLote(lote) === 0 ? 'encerrado' : lote.status"), 'Saída interna deve persistir encerramento quando o estoque zera.');

console.log('estoque-operacional-persistencia-1197.test.cjs OK');
