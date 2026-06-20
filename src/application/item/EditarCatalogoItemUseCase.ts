import type { Repository } from '../ports/Repository';
import type { ItemCatalogo } from '../../domain/item/ItemCatalogo';
import { assertItemValido, validarVariacoes } from '../../domain/item/ItemCatalogo';

export type EditarCatalogoItemInput = Partial<Omit<ItemCatalogo, 'id' | 'createdAt' | 'updatedAt' | 'status'>>;

export class EditarCatalogoItemUseCase {
  constructor(private readonly items: Repository<ItemCatalogo>) {}
  async execute(itemId: string, input: EditarCatalogoItemInput, now = new Date().toISOString()): Promise<ItemCatalogo> {
    const item = await this.items.getById(itemId);
    if (!item) throw new Error('Item não encontrado.');

    const atualizado: ItemCatalogo = {
      ...item,
      ...input,
      tags: input.tags || item.tags,
      variacoes: input.variacoes || item.variacoes || [],
      updatedAt: now
    };

    assertItemValido(atualizado);
    validarVariacoes(atualizado.variacoes || []);

    return this.items.save(atualizado);
  }
}
