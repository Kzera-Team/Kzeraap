const fs=require('fs');function a(c,m){if(!c)throw new Error(m)};
const perfil=fs.readFileSync('src/presentation/perfil/PerfilDomView.ts','utf8');const item=fs.readFileSync('src/presentation/item/ItemCatalogoDomView.ts','utf8');
a(perfil.length<9000,'PerfilDomView controlado');a(item.length<7000,'ItemCatalogoDomView controlado');
a(fs.existsSync('src/presentation/perfil/binders/PerfilFormBinder.ts'),'PerfilFormBinder');a(fs.existsSync('src/presentation/perfil/binders/PerfilImportacaoBinder.ts'),'PerfilImportacaoBinder');a(fs.existsSync('src/presentation/perfil/renderers/PerfilCardRenderer.ts'),'PerfilCardRenderer');a(fs.existsSync('src/presentation/item/binders/ItemListBinder.ts'),'ItemListBinder');a(fs.existsSync('src/presentation/item/renderers/ItemCardRenderer.ts'),'ItemCardRenderer');a(fs.existsSync('src/presentation/shared/ui/Html.ts'),'shared Html');
console.log('ui-modular-real-1912.test.cjs OK');
