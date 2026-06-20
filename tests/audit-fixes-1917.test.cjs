const fs=require('fs');

const search=fs.readFileSync('src/presentation/perfil/binders/PerfilSearchBinder.ts','utf8');
const itemApp=fs.readFileSync('src/app/createItemCatalogoUiApp.ts','utf8');
const itemExport=fs.readFileSync('src/application/item/ExportarCatalogoItensUseCase.ts','utf8');
const perfilExport=fs.readFileSync('src/application/perfil/ExportarPerfisUseCase.ts','utf8');

if(search.includes('escapeHtml(state.termoBusca)')) throw new Error('double escape');
if(!itemApp.includes('releaseTransferPayload(preview)')) throw new Error('preview release missing');
if(itemApp.includes('releaseTransferPayload(rejeitados)')) throw new Error('invalid preview cleanup');
if(itemExport.includes('releaseObject')) throw new Error('item export should not mutate repository collection');
if(!perfilExport.includes('releaseObject(linhas)')) throw new Error('perfil export should cleanup derived export rows');
const itemList=fs.readFileSync('src/presentation/item/binders/ItemListBinder.ts','utf8');
if(itemList.includes('confirm(')) throw new Error('native confirm should not be used');
console.log('audit-fixes-1917.test.cjs OK');
