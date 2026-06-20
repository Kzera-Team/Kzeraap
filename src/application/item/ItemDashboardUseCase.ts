import type { Repository } from '../ports/Repository';
import type { ItemCatalogo } from '../../domain/item/ItemCatalogo';
import { criarItemDashboard, type ItemDashboard } from '../../domain/item/ItemDashboard';

export class ItemDashboardUseCase {
  constructor(private readonly items: Repository<ItemCatalogo>) {}
  async execute(): Promise<ItemDashboard> {
    return criarItemDashboard(await this.items.list());
  }
}
