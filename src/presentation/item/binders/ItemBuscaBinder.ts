import type { ItemCatalogoUiHandlers } from '../ItemCatalogoViewTypes';
import { inputValue } from '../../shared/ui/Html';

export class ItemBuscaBinder {
  bind(root: HTMLElement, handlers: ItemCatalogoUiHandlers): void {
    root.querySelector('[data-action="buscar"]')?.addEventListener('click', async () => {
      await handlers.onBuscar(inputValue(root, '#item-busca'));
    });
  }
}
