import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { ItemCatalogo, ItemLote, ItemVariacao } from '../../domain/item/ItemCatalogo';

export interface LoteOperacionalEditContext {
  item: ItemCatalogo;
  variacao: ItemVariacao;
  lote: ItemLote;
  now: string;
}

export interface LoteOperacionalEditInput {
  itemId: string;
  variacaoId: string;
  loteId: string;
}

export type LoteOperacionalEditFn = (context: LoteOperacionalEditContext) => ItemLote;

export class LoteOperacionalEditor {
  constructor(
    private readonly items: Repository<ItemCatalogo>,
    private readonly clock: Clock
  ) {}

  async edit(input: LoteOperacionalEditInput, editLote: LoteOperacionalEditFn): Promise<ItemCatalogo> {
    const item = await this.items.getById(input.itemId);
    if (!item) throw new Error('Item não encontrado.');

    const now = this.clock.now().toISOString();
    let variacaoEncontrada = false;
    let loteEncontrado = false;

    const variacoes = item.variacoes.map(variacao => {
      if (variacao.id !== input.variacaoId) return variacao;
      variacaoEncontrada = true;

      const lotes = variacao.lotes.map(lote => {
        if (lote.id !== input.loteId) return lote;
        loteEncontrado = true;
        return { ...editLote({ item, variacao, lote, now }), updatedAt: now };
      });

      return { ...variacao, lotes, updatedAt: now };
    });

    if (!variacaoEncontrada) throw new Error('Variação não encontrada.');
    if (!loteEncontrado) throw new Error('Lote não encontrado.');

    return this.items.save({ ...item, variacoes, updatedAt: now });
  }
}
