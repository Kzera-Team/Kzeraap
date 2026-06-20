import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { ItemCatalogo, ItemUnidade } from '../../domain/item/ItemCatalogo';
import { registrarFracionamentoNoLote } from '../../domain/item/ItemCatalogo';

export interface RegistrarFracionamentoLoteUseCaseInput {
  itemId: string;
  variacaoId: string;
  loteId: string;
  tamanhoFracao: number;
  unidadeFracao: ItemUnidade;
  quantidadeUnidadesCriadas: number;
  dataFracionamento?: string;
  observacao?: string;
  balancaId?: string;
}

export class RegistrarFracionamentoLoteUseCase {
  constructor(
    private readonly items: Repository<ItemCatalogo>,
    private readonly clock: Clock,
    private readonly idFactory: () => string
  ) {}

  async execute(input: RegistrarFracionamentoLoteUseCaseInput): Promise<ItemCatalogo> {
    const item = await this.items.getById(input.itemId);
    if (!item) throw new Error('Item não encontrado.');

    const now = this.clock.now().toISOString();
    const variacoes = item.variacoes.map(variacao => {
      if (variacao.id !== input.variacaoId) return variacao;
      const lotes = variacao.lotes.map(lote => {
        if (lote.id !== input.loteId) return lote;
        const fracionamentoInput = {
          tamanhoFracao: input.tamanhoFracao,
          unidadeFracao: input.unidadeFracao,
          quantidadeUnidadesCriadas: input.quantidadeUnidadesCriadas,
          dataFracionamento: input.dataFracionamento || now
        };
        if (input.observacao !== undefined) Object.assign(fracionamentoInput, { observacao: input.observacao });
        if (input.balancaId !== undefined) Object.assign(fracionamentoInput, { balancaId: input.balancaId });
        return registrarFracionamentoNoLote(lote, fracionamentoInput, variacao.unidade, this.idFactory(), now);
      });
      return { ...variacao, lotes, updatedAt: now };
    });

    const variacaoExiste = item.variacoes.some(variacao => variacao.id === input.variacaoId);
    if (!variacaoExiste) throw new Error('Variação não encontrada.');
    const loteExiste = item.variacoes.some(variacao => variacao.id === input.variacaoId && variacao.lotes.some(lote => lote.id === input.loteId));
    if (!loteExiste) throw new Error('Lote não encontrado.');

    return this.items.save({ ...item, variacoes, updatedAt: now });
  }
}
