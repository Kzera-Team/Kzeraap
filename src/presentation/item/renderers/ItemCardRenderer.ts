import type { ItemCatalogo } from '../../../domain/item/ItemCatalogo';
import { calcularMetricasPreco, estoqueTotalDoItem, primeiroLoteAtivo } from '../../../domain/item/ItemCatalogo';

function createInfoItem(label: string, value: string, extraClass?: string): HTMLElement {
  const item = document.createElement('div');
  item.classList.add('info-item');
  if (extraClass) item.classList.add(extraClass);

  const strong = document.createElement('strong');
  strong.textContent = value;

  const span = document.createElement('span');
  span.textContent = label;

  item.append(strong, span);
  return item;
}

function createStatusBadge(status: ItemCatalogo['status']): HTMLElement {
  const statusBadge = document.createElement('span');
  statusBadge.classList.add('badge', status === 'ativo' ? 'badge-success' : 'badge-warning');
  statusBadge.textContent = status;
  return statusBadge;
}

function createActionButton(label: string, action: string, itemId: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('icon-button', 'text-icon');
  button.type = 'button';
  button.dataset['action'] = action;
  button.dataset['id'] = itemId;
  button.setAttribute('aria-label', label);
  button.title = label;
  button.textContent = label;
  return button;
}

export class ItemCardRenderer {
  render(item: ItemCatalogo): HTMLElement {
    const variacaoComLote = item.variacoes?.find(variacao => variacao.status === 'ativo' && variacao.lotes.some(lote => lote.status === 'ativo'));
    const lote = primeiroLoteAtivo(item);
    const preco = lote?.valor ?? 0;
    const custo = lote?.custo ?? 0;
    const estoqueTotal = estoqueTotalDoItem(item);
    const variacoesAtivas = item.variacoes?.filter(variacao => variacao.status === 'ativo').length || 0;
    const metricas = calcularMetricasPreco(custo, preco);

    const article = document.createElement('article');
    article.classList.add('kzera-entity-card', 'item-card');
    article.dataset['testid'] = 'item-card';

    const header = document.createElement('div');
    header.classList.add('item-card-header');

    const titleGroup = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = item.nome;

    const meta = document.createElement('p');
    meta.classList.add('item-meta');
    meta.textContent = `${item.categoria || 'Sem categoria'} • ${variacoesAtivas} variação(ões)`;

    titleGroup.append(title, meta);
    header.append(titleGroup, createStatusBadge(item.status));

    const priceGrid = document.createElement('div');
    priceGrid.classList.add('item-price-grid', 'kzera-info-grid');

    const details = document.createElement('details');
    details.classList.add('inline-details');
    const summary = document.createElement('summary');
    summary.textContent = 'Ver valores do item';
    details.append(
      summary,
      createInfoItem('Preço base', preco.toFixed(2), 'price-highlight'),
      createInfoItem('Custo', custo.toFixed(2)),
      createInfoItem('Lucro', metricas.lucro.toFixed(2)),
      createInfoItem('Margem', `${metricas.margemPercentual.toFixed(1)}%`)
    );
    priceGrid.appendChild(details);

    const commercialGrid = document.createElement('div');
    commercialGrid.classList.add('item-commercial-grid', 'kzera-info-grid');
    commercialGrid.append(
      createInfoItem('Variações', String(variacoesAtivas)),
      createInfoItem('Estoque total', estoqueTotal.toFixed(3)),
      createInfoItem('Status', item.status)
    );

    const actions = document.createElement('div');
    actions.classList.add('action-row', 'kzera-action-row');

    if (lote && variacaoComLote) {
      const estoqueButton = createActionButton('📦 Estoque', 'abrir-lote', item.id);
      estoqueButton.dataset['variacaoId'] = variacaoComLote.id;
      estoqueButton.dataset['loteId'] = lote.id;
      estoqueButton.setAttribute('aria-label', 'Abrir estoque');
      estoqueButton.title = 'Abrir estoque';
      actions.appendChild(estoqueButton);
    }

    actions.appendChild(createActionButton('✎ Editar', 'editar', item.id));
    actions.appendChild(
      item.status === 'ativo'
        ? createActionButton('⌫ Arquivar', 'arquivar', item.id)
        : createActionButton('↻ Reativar', 'reativar', item.id)
    );

    article.append(header, priceGrid, commercialGrid, actions);
    return article;
  }
}
