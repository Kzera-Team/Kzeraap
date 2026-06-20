import type { Repository } from '../ports/Repository';
import type { ItemCatalogo } from '../../domain/item/ItemCatalogo';
import type { ItemBuscaFiltro } from '../../domain/item/ItemBusca';
import { buscarItens } from '../../domain/item/ItemBusca';

export class ListarCatalogoItensUseCase {
  constructor(private readonly items: Repository<ItemCatalogo>) {}
  async execute(filtro: ItemBuscaFiltro = {}): Promise<ItemCatalogo[]> {
    return buscarItens(await this.items.list(), filtro);
  }
}
