import type { ItemCatalogo } from './ItemCatalogo';
import { estoqueTotalDoItem } from './ItemCatalogo';

export interface ItemBuscaFiltro {
  termo?: string;
  status?: 'ativo' | 'arquivado' | 'todos';
  estoqueBaixo?: boolean;
}

export function buscarItens(items: ItemCatalogo[], filtro: ItemBuscaFiltro = {}): ItemCatalogo[] {
  const termo = filtro.termo?.trim().toLowerCase();
  return items.filter(item => {
    if (filtro.status && filtro.status !== 'todos' && item.status !== filtro.status) return false;
    if (filtro.estoqueBaixo && estoqueTotalDoItem(item) > 0) return false;
    if (!termo) return true;
    const haystack = [item.nome, item.categoria || '', ...item.variacoes.flatMap(variacao => [variacao.nome, variacao.unidade, ...variacao.lotes.map(lote => lote.nome || '')])]
      .join(' ')
      .toLowerCase();
    return haystack.includes(termo);
  });
}
