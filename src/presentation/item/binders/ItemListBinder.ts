import type { ItemCatalogoUiHandlers, ItemCatalogoUiState } from '../ItemCatalogoViewTypes';
import { inputValue } from '../../shared/ui/Html';
import { ItemCardRenderer } from '../renderers/ItemCardRenderer';
import { ItemEditCardRenderer } from '../renderers/ItemEditCardRenderer';
import { emptyState } from '../../shared/ui/EmptyState';

function tagsFrom(value: string): string[] {
  return value.split(',').map(tag => tag.trim()).filter(Boolean);
}

export class ItemListBinder {
  private readonly cardRenderer = new ItemCardRenderer();
  private readonly editCardRenderer = new ItemEditCardRenderer();

  bind(root: HTMLElement, state: ItemCatalogoUiState, handlers: ItemCatalogoUiHandlers): void {
    root.querySelector('[data-action="exportar"]')?.addEventListener('click', async () => handlers.onExportar());

    const slot = root.querySelector('[data-slot="item-list"]');
    if (!slot) return;

    if (!state.items.length) {
      slot.innerHTML = emptyState('Nenhum item encontrado.');
      return;
    }

    slot.innerHTML = state.items.map(item =>
      state.editandoItemId === item.id ? this.editCardRenderer.render(item) : this.cardRenderer.render(item)
    ).join('');

    slot.querySelectorAll<HTMLButtonElement>('[data-item-edit-tab]').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id || '';
        const target = button.dataset.itemEditTab || 'informacoes';
        slot.querySelectorAll<HTMLButtonElement>(`[data-item-edit-tab][data-id="${id}"]`).forEach(item => item.classList.toggle('active', item === button));
        slot.querySelectorAll<HTMLElement>(`[data-item-edit-tab-panel][data-id="${id}"]`).forEach(panel => {
          panel.hidden = panel.dataset.itemEditTabPanel !== target;
        });
      });
    });

    slot.querySelectorAll<HTMLButtonElement>('button[data-action]').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id || '';
        const action = button.dataset.action;

        if (action === 'abrir-lote') await handlers.onAbrirLote(id, button.dataset.variacaoId || '', button.dataset.loteId || '');
        if (action === 'editar') await handlers.onEditarItem(id);
        if (action === 'cancelar-edicao') await handlers.onCancelarEdicao();
        if (action === 'arquivar') await handlers.onArquivar(id);
        if (action === 'reativar') await handlers.onReativar(id);
        if (action === 'salvar') await this.salvarEdicao(root, id, handlers);
      });
    });
  }

  private async salvarEdicao(root: HTMLElement, itemId: string, handlers: ItemCatalogoUiHandlers): Promise<void> {
    const input = {
      nome: inputValue(root, `#edit-nome-${itemId}`),
      categoria: inputValue(root, `#edit-categoria-${itemId}`),
      tags: tagsFrom(inputValue(root, `#edit-tags-${itemId}`))
    } as { nome: string; categoria: string; descricao?: string; tags: string[]; observacao?: string };

    const descricao = inputValue(root, `#edit-descricao-${itemId}`);
    const observacao = inputValue(root, `#edit-observacao-${itemId}`);
    if (descricao) input.descricao = descricao;
    if (observacao) input.observacao = observacao;

    await handlers.onSalvarItem(itemId, input);
  }
}
