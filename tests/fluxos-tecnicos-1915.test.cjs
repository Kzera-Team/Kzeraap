const fs = require('fs');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const perfilFluxo = fs.readFileSync('src/application/perfil/FluxoImportacaoPerfisUseCase.ts', 'utf8');
const itemImport = fs.readFileSync('src/application/item/ImportarCatalogoItensUseCase.ts', 'utf8');
const transfer = fs.readFileSync('src/runtime/TransferScope.ts', 'utf8');
const cleanup = fs.readFileSync('src/runtime/RuntimeCleanup.ts', 'utf8');

assert(perfilFluxo.includes('limpar(): void'), 'Fluxo de perfis deve expor limpeza explícita.');
assert(perfilFluxo.includes('releaseObject(this.state.preview)'), 'Fluxo de perfis deve limpar preview.');
assert(itemImport.includes('releaseObject(validos)'), 'Importação de itens deve limpar lista de trabalho.');
assert(transfer.includes('releaseTextBuffer'), 'TransferScope deve tratar texto temporário.');
assert(cleanup.includes('releaseBytes') && cleanup.includes('releaseObject'), 'RuntimeCleanup deve manter limpeza centralizada.');

console.log('fluxos-tecnicos-1915.test.cjs OK');
