import type { Repository } from '../ports/Repository';
import type { ItemCatalogo } from '../../domain/item/ItemCatalogo';
import { itensParaCsv } from '../../domain/item/ItemExportacao';

export class ExportarCatalogoItensUseCase {
  constructor(private readonly items: Repository<ItemCatalogo>) {}

  async execute(): Promise<string> {
    const items = await this.items.list();

    return itensParaCsv(items);
  }
}
