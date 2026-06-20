import type { Repository } from '../ports/Repository';
import type { ItemCatalogo } from '../../domain/item/ItemCatalogo';

export class ArquivarCatalogoItemUseCase {
  constructor(private readonly items: Repository<ItemCatalogo>) {}
  async execute(itemId: string, now = new Date().toISOString()): Promise<ItemCatalogo> {
    const item = await this.items.getById(itemId);
    if (!item) throw new Error('Item não encontrado.');
    return this.items.save({ ...item, status: 'arquivado', updatedAt: now });
  }
}
