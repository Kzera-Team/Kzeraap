import type { ItemCatalogoUiHandlers } from '../ItemCatalogoViewTypes';
import type { ItemUnidade } from '../../../domain/item/ItemCatalogo';
import { inputValue, numberValue } from '../../shared/ui/Html';

export class ItemFormBinder {
  bind(root: HTMLElement, handlers: ItemCatalogoUiHandlers): void {
    root.querySelector('[data-testid="item-form"]')?.addEventListener('submit', async event => {
      event.preventDefault();
      await handlers.onCriarItem({
        nome: inputValue(root, '#item-nome'),
        categoria: inputValue(root, '#item-categoria'),
        unidade: inputValue(root, '#item-variacao-unidade') as ItemUnidade,
        variacaoNome: inputValue(root, '#item-variacao-nome'),
        loteNome: inputValue(root, '#item-lote-nome'),
        loteValor: numberValue(root, '#item-lote-valor'),
        loteCusto: numberValue(root, '#item-lote-custo'),
        loteQuantidade: numberValue(root, '#item-lote-quantidade'),
        loteData: inputValue(root, '#item-lote-data')
      });
    });
  }
}
