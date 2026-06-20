import type { ItemCatalogo } from '../../../domain/item/ItemCatalogo';
import { estoqueDaVariacao } from '../../../domain/item/ItemCatalogo';
import { escapeHtml } from '../../shared/ui/Html';

export class ItemEditCardRenderer {
  render(item: ItemCatalogo): string {
    const variacoes = (item.variacoes || []).map(variacao => `
      <article class="item-variation-card">
        <header class="variation-card-header">
          <div><strong>${escapeHtml(variacao.nome)}</strong><small>${variacao.lotes.length} entrada(s)</small></div>
          <span class="badge badge-neutral">${escapeHtml(variacao.unidade)}</span>
        </header>
        <div class="variation-stock-summary"><strong>${estoqueDaVariacao(variacao).toFixed(3)}</strong><span>${escapeHtml(variacao.unidade)} em estoque</span></div>
        <div class="item-lote-list item-lote-grid">
          ${variacao.lotes.map(lote => `
            <div class="item-lote-row">
              <strong>${escapeHtml(lote.nome || 'Entrada')}</strong>
              <span>${lote.quantidade.toFixed(3)} ${escapeHtml(variacao.unidade)}</span>
              <span>V ${lote.valor.toFixed(2)}</span>
              <span>C ${lote.custo.toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
      </article>
    `).join('') || '<p class="empty-state">Nenhuma variação cadastrada para este item.</p>';

    return `<article class="kzera-card item-card item-edit-card" data-testid="item-edit-card">
      <h3>Editar ${escapeHtml(item.nome)}</h3>
      <nav class="item-tabs" data-testid="item-edit-tabs-${item.id}" aria-label="Edição do item">
        <button type="button" class="active" data-item-edit-tab="informacoes" data-id="${item.id}" aria-label="Informações" title="Informações">ⓘ</button>
        <button type="button" data-item-edit-tab="variacoes" data-id="${item.id}" aria-label="Variações e estoque" title="Variações e estoque">▦</button>
      </nav>
      <div data-item-edit-tab-panel="informacoes" data-id="${item.id}">
        <fieldset class="item-form-section">
          <legend>Informações</legend>
          <input id="edit-nome-${item.id}" value="${escapeHtml(item.nome)}" placeholder="Nome" />
          <input id="edit-categoria-${item.id}" value="${escapeHtml(item.categoria)}" placeholder="Categoria opcional" />
          <input id="edit-descricao-${item.id}" value="${escapeHtml(item.descricao || '')}" placeholder="Descrição" />
          <input id="edit-tags-${item.id}" value="${escapeHtml(item.tags.join(', '))}" placeholder="Tags separadas por vírgula" />
          <input id="edit-observacao-${item.id}" value="${escapeHtml(item.observacao || '')}" placeholder="Observação" />
        </fieldset>
      </div>
      <div data-item-edit-tab-panel="variacoes" data-id="${item.id}" hidden>
        <fieldset class="item-form-section item-variation-section">
          <legend>Variações e estoque</legend>
          <p class="form-hint">Variação pertence ao item. Unidade pertence à variação. Valor, custo e quantidade pertencem à entrada de estoque.</p>
          ${variacoes}
        </fieldset>
      </div>
      <div class="action-row">
        <button class="icon-button primary-icon text-icon" type="button" data-action="salvar" data-id="${item.id}" aria-label="Salvar" title="Salvar">✓ Salvar</button>
        <button class="icon-button" type="button" data-action="cancelar-edicao" data-id="${item.id}" aria-label="Cancelar" title="Cancelar">×</button>
      </div>
    </article>`;
  }
}
