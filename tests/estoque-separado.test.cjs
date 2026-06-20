const fs=require('fs');function a(c,m){if(!c)throw new Error(m)};
const domain=fs.readFileSync('src/domain/estoque/Estoque.ts','utf8');
const usecase=fs.readFileSync('src/application/estoque/RegistrarMovimentacaoEstoqueUseCase.ts','utf8');
const itemTemplate=fs.readFileSync('src/presentation/item/templates/ItemCatalogoTemplate.ts','utf8');
const editRenderer=fs.readFileSync('src/presentation/item/renderers/ItemEditCardRenderer.ts','utf8');
a(domain.includes("'entrada' | 'saida' | 'ajuste'"),'Estoque deve ter entrada, saída e ajuste');
a(usecase.includes('Repository<EstoqueMovimentacao>') && usecase.includes('Repository<EstoqueSaldo>'),'Estoque deve ter repositórios próprios');
a(!itemTemplate.includes('id="item-estoque"') && !editRenderer.includes('edit-estoque'),'Item UI não deve controlar estoque');
console.log('estoque-separado.test.cjs OK');
