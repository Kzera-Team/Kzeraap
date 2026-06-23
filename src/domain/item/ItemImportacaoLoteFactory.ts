import type { ItemLote } from './ItemCatalogo';

export interface CriarLoteImportadoInput {
  id: string;
  nome?: string;
  valor: number;
  custo: number;
  quantidade: number;
  dataLancamento: string;
}

export function criarLoteImportado(input: CriarLoteImportadoInput): ItemLote {
  return {
    id: input.id,
    nome: input.nome?.trim() || 'Lote importado',
    valor: input.valor,
    custo: input.custo,
    custoTotal: input.custo,
    custoUnitario: input.quantidade ? input.custo / input.quantidade : 0,
    quantidade: input.quantidade,
    quantidadeGuardada: input.quantidade,
    dataLancamento: input.dataLancamento,
    fracionamentos: [],
    retiradasInternas: [],
    conferencias: [],
    status: 'ativo',
    createdAt: input.dataLancamento,
    updatedAt: input.dataLancamento,
  };
}
