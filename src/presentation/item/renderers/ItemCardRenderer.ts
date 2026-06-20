import type { ItemCatalogo } from '../../../domain/item/ItemCatalogo';
import { calcularMetricasPreco, estoqueTotalDoItem, primeiroLoteAtivo } from '../../../domain/item/ItemCatalogo';
import { escapeHtml } from '../../shared/ui/Html';
import { infoItem } from '../../shared/ui/InfoItem';
import { badge } from '../../shared/ui/Badge';

export class ItemCardRenderer {
  render(item: ItemCatalogo): string {
    const variacaoComLote = item.variacoes?.find(variacao => variacao.status === 'ativo' && variacao.lotes.some(lote => lote.status === 'ativo'));
    const lote = primeiroLoteAtivo(item);
    const preco = lote?.valor ?? 0;
    const custo = lote?.custo ?? 0;
    const estoqueTotal = estoqueTotalDoItem(item);
    const variacoesAtivas = item.variacoes?.filter(variacao => variacao.status === 'ativo').length || 0;
    const metricas = calcularMetricasPreco(custo, preco);

    return `<article class="kzera-entity-card item-card" data-testid="item-card">
      <div class="item-card-header">
        <div>
          <h3>${escapeHtml(item.nome)}</h3>
          <p class="item-meta">${escapeHtml(item.categoria || 'Sem categoria')} • ${variacoesAtivas} variação(ões)</p>
        </div>
${badge(item.status, item.status === 'ativo' ? 'success' : 'warning')}
      </div>
      <div class="item-price-grid kzera-info-grid">
        <details class="inline-details"><summary>Ver valores do item</summary>${infoItem('Preço base', preco.toFixed(2), 'price-highlight')}${infoItem('Custo', custo.toFixed(2))}${infoItem('Lucro', metricas.lucro.toFixed(2))}${infoItem('Margem', `${metricas.margemPercentual.toFixed(1)}%`)}</details>
      </div>
      <div class="item-commercial-grid kzera-info-grid">
        ${infoItem('Variações', String(variacoesAtivas))}
        ${infoItem('Estoque total', estoqueTotal.toFixed(3))}
        ${infoItem('Status', item.status)}
      </div>
      <div class="action-row kzera-action-row">
        ${lote && variacaoComLote ? `<button class="icon-button text-icon" type="button" data-action="abrir-lote" data-id="${item.id}" data-variacao-id="${variacaoComLote.id}" data-lote-id="${lote.id}" aria-label="Abrir estoque" title="Abrir estoque">📦 Estoque</button>` : ''}
        <button class="icon-button text-icon" type="button" data-action="editar" data-id="${item.id}" aria-label="Editar item" title="Editar item">✎ Editar</button>
        ${item.status === 'ativo'
          ? `<button class="icon-button text-icon" type="button" data-action="arquivar" data-id="${item.id}" aria-label="Arquivar item" title="Arquivar item">⌫ Arquivar</button>`
          : `<button class="icon-button text-icon" type="button" data-action="reativar" data-id="${item.id}" aria-label="Reativar item" title="Reativar item">↻ Reativar</button>`}
      </div>
    </article>`;
  }
}

