import type { ItemUnidade } from '../../../domain/item/ItemCatalogo';
import type { ItemCatalogoUiHandlers } from '../ItemCatalogoViewTypes';

export class LoteFracionamentoBinder {
  bind(root: HTMLElement, handlers: ItemCatalogoUiHandlers): void {
    root.querySelector<HTMLFormElement>('[data-testid="lote-fracionamento-form"]')?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!(form instanceof HTMLFormElement)) return;
      const data = new FormData(form);
      await handlers.onRegistrarFracionamento({
        itemId: String(data.get('itemId') || ''),
        variacaoId: String(data.get('variacaoId') || ''),
        loteId: String(data.get('loteId') || ''),
        tamanhoFracao: Number(data.get('tamanhoFracao') || 0),
        unidadeFracao: String(data.get('unidadeFracao') || '') as ItemUnidade,
        quantidadeUnidadesCriadas: Number(data.get('quantidadeUnidadesCriadas') || 0),
        dataFracionamento: String(data.get('dataFracionamento') || ''),
        observacao: String(data.get('observacao') || '')
      });
    });
  }
}
