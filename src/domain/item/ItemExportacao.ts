import type { ItemCatalogo } from './ItemCatalogo';

export function itensParaCsv(items: ItemCatalogo[]): string {
  const headers = ['Item', 'Categoria Real', 'Variação', 'Unidade', 'Lote', 'Quantidade', 'Custo', 'Valor', 'Status Item', 'Status Variação', 'Status Lote'];
  const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const rows = items.flatMap(item => item.variacoes.flatMap(variacao => variacao.lotes.map(lote => [
    item.nome,
    item.categoria || '',
    variacao.nome,
    variacao.unidade,
    lote.nome || '',
    lote.quantidade,
    lote.custo,
    lote.valor,
    item.status,
    variacao.status,
    lote.status
  ].map(escape).join(','))));
  return [headers.map(escape).join(','), ...rows].join('\n');
}
