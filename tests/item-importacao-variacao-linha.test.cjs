const fs = require('fs');
function a(c,m){ if(!c) throw new Error(m); }
const domain = fs.readFileSync('src/domain/item/ItemImportacao.ts','utf8');
const parser = fs.readFileSync('src/domain/item/ItemImportacaoParser.ts','utf8');
const importUseCase = fs.readFileSync('src/application/item/ImportarCatalogoItensUseCase.ts','utf8');
const binder = fs.readFileSync('src/presentation/item/binders/ItemImportacaoBinder.ts','utf8');
const app = fs.readFileSync('src/app/createItemCatalogoUiApp.ts','utf8');
const catalogo = fs.readFileSync('src/domain/item/ItemCatalogo.ts','utf8');
a(!domain.includes('Categoria é obrigatória.'), 'Categoria de item não deve ser obrigatória na importação.');
a(!app.includes('Categoria é obrigatória.'), 'Validação da prévia não deve exigir categoria.');
a(parser.includes("categoria: 'variacaoNome'"), 'Coluna Categoria da planilha deve mapear para variação.');
a(importUseCase.includes('variacaoNome') && importUseCase.includes('VARIACAO_PADRAO_ITEM'), 'Importação deve criar variação, usando padrão quando necessário.');
a(importUseCase.includes('lotes: [{'), 'Importação deve criar lote dentro da variação.');
a(binder.includes('item-import-line'), 'Prévia de item deve renderizar registros por linha compacta.');
a(binder.includes('preview-variacao'), 'Prévia deve editar variação, não categoria real.');
a(binder.includes('preview-quantidade') && binder.includes('preview-custo') && binder.includes('preview-preco'), 'Linha deve exibir quantidade, custo e valor do lote.');
a(catalogo.includes('ITEM_VARIACAO_OBRIGATORIA') && catalogo.includes('ITEM_LOTE_OBRIGATORIO'), 'Domínio deve exigir variação e lote.');
console.log('item-importacao-variacao-linha.test.cjs OK');
