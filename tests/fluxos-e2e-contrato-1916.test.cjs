const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const itemModule = fs.readFileSync('src/app/createItemCatalogoModule.ts', 'utf8');
const itemApp = fs.readFileSync('src/app/createItemCatalogoUiApp.ts', 'utf8');
const perfilModule = fs.readFileSync('src/app/createPerfilModule.ts', 'utf8');
const sessionController = fs.readFileSync('src/runtime/SessionActivityController.ts', 'utf8');
const sessionContext = fs.readFileSync('src/runtime/SessionContext.ts', 'utf8');

assert(itemModule.includes('importar') && itemModule.includes('editar') && itemModule.includes('arquivar') && itemModule.includes('reativar'), 'Catálogo deve suportar importar/editar/arquivar/reativar.');
assert(itemApp.includes('onEditarItem') && itemApp.includes('onArquivar') && itemApp.includes('onReativar'), 'UI de catálogo deve ligar edição e ciclo de status.');
assert(perfilModule.includes('fluxoImportacao') && perfilModule.includes('arquivar') && perfilModule.includes('reativar'), 'Perfis devem suportar importação e ciclo de status.');
assert(sessionController.includes('evaluate()') && sessionController.includes('releaseAll()'), 'Controller deve cobrir inatividade.');
assert(sessionContext.includes('requiresAttention') && sessionContext.includes('requiresContext'), 'Sessão deve cobrir revalidação.');

console.log('fluxos-e2e-contrato-1916.test.cjs OK');
