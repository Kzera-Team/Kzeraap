import type { ItemCatalogo } from '../../../domain/item/ItemCatalogo';
import { estoqueTotalDoItem } from '../../../domain/item/ItemCatalogo';

export type ItemStockStatus = 'empty' | 'ok';

export function estoqueStatus(item: ItemCatalogo): ItemStockStatus {
  return estoqueTotalDoItem(item) <= 0 ? 'empty' : 'ok';
}

export function estoqueLabel(item: ItemCatalogo): string {
  return estoqueStatus(item) === 'empty' ? 'Sem estoque' : 'Estoque OK';
}
