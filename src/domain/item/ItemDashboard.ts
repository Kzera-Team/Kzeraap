import type { ItemCatalogo } from './ItemCatalogo';
import { primeiroLoteAtivo } from './ItemCatalogo';

export interface ItemDashboard {
  totalAtivos: number;
  arquivados: number;
  semPreco: number;
  custoMedio: number;
}

export function criarItemDashboard(items: ItemCatalogo[]): ItemDashboard {
  const ativos = items.filter(item => item.status === 'ativo');
  const lotes = ativos.flatMap(item => item.variacoes.flatMap(variacao => variacao.lotes));
  return {
    totalAtivos: ativos.length,
    arquivados: items.filter(item => item.status === 'arquivado').length,
    semPreco: ativos.filter(item => !primeiroLoteAtivo(item)?.valor).length,
    custoMedio: lotes.length ? lotes.reduce((total, lote) => total + lote.custo, 0) / lotes.length : 0
  };
}
