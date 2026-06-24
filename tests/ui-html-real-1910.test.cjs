const fs=require('fs');function a(c,m){if(!c)throw new Error(m)};
const perfil=fs.readFileSync('src/presentation/perfil/PerfilDomView.ts','utf8');
const item=fs.readFileSync('src/presentation/item/ItemCatalogoDomView.ts','utf8');
a(!fs.existsSync('src/presentation/perfil/perfil.html'),'perfil html morto removido');
a(!fs.existsSync('src/presentation/item/item-catalogo.html'),'item html morto removido');
a(!item.includes('document.createElement'),'item sem createElement');
a(!item.includes('appendChild'),'item sem appendChild');
a(perfil.includes('PerfilTemplate.html?raw'),'perfil usa template html externo');a(item.includes('ITEM_TEMPLATE'),'item template');
console.log('ui-html-real-1910.test.cjs OK');
