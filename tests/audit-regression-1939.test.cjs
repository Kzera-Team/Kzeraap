const fs=require('fs');const path=require('path');function a(c,m){if(!c)throw new Error(m)}
function read(f){return fs.existsSync(f)?fs.readFileSync(f,'utf8'):''}
function walk(dir){return fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p]}):[]}
const app=read('src/app/createKzeraAuthenticatedApp.ts');
a(!app.includes("'estoque'"),'rota estoque solta removida');
a(app.includes('data-import-panel="perfis"')&&app.includes('data-import-panel="itens"'),'importação como módulo real');
a(!app.includes("'Configurações técnicas e segurança local do ${PUBLIC_APP_NAME}.'"),'sem template literal quebrado em configurações');
const itemDomain=read('src/domain/item/ItemCatalogo.ts');
a(!itemDomain.includes('estoqueAtual')&&!itemDomain.includes('estoqueMinimo'),'Item sem estoque operacional direto');
a(!itemDomain.includes('ItemPrecoTier')&&!itemDomain.includes('tiers'),'Item sem tiers/preços legados');
a(!fs.existsSync('src/application/item/AjustarEstoqueCatalogoItemUseCase.ts'),'usecase ajuste estoque legado removido');
a(!fs.existsSync('src/application/item/AtualizarTiersCatalogoItemUseCase.ts'),'usecase tiers legado removido');
const itemTemplate=read('src/presentation/item/templates/ItemCatalogoTemplate.ts');
const perfilTemplate=read('src/presentation/perfil/templates/PerfilTemplate.ts');
a(!itemTemplate.includes('data-item-import-panel')&&!perfilTemplate.includes('data-perfil-import-panel'),'importação não embutida em telas principais');
a(!walk('src/presentation').some(f=>f.endsWith('.html')),'templates HTML mortos removidos');
const importacao=read('src/domain/item/ItemImportacao.ts')+read('src/domain/item/ItemImportacaoParser.ts')+read('src/application/item/ImportarCatalogoItensUseCase.ts');
a(importacao.includes('quantidadeLote')&&importacao.includes('custoLote')&&importacao.includes('valorLote'),'importação fala Item -> Variação -> Lote');
console.log('audit-regression-1939.test.cjs OK');
