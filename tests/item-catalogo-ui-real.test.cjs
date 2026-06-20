const fs=require('fs');
function a(c,m){if(!c)throw new Error(m)}
const view=fs.readFileSync('src/presentation/item/ItemCatalogoDomView.ts','utf8');
const importer=fs.readFileSync('src/presentation/item/binders/ItemImportacaoBinder.ts','utf8');
const card=fs.readFileSync('src/presentation/item/renderers/ItemCardRenderer.ts','utf8');
const app=fs.readFileSync('src/app/createItemCatalogoUiApp.ts','utf8');
a(view.includes('ItemImportacaoBinder'),'view importa binder de importação');
a(importer.includes('item-import-preview'),'preview');
a(importer.includes('onSelecionarArquivo'),'importar');
a(card.includes('calcularMetricasPreco'),'metricas ui');
a(card.includes('item-card'),'cards');
a(app.includes('ParseImportacaoCatalogoItensUseCase'),'parser app');
a(app.includes('module.importar.execute'),'confirmar');
console.log('item-catalogo-ui-real.test.cjs OK');
