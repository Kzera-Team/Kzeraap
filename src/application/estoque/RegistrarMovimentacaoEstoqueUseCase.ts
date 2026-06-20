import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import { aplicarMovimentacao, type EstoqueMovimentacao, type EstoqueMovimentoTipo, type EstoqueSaldo } from '../../domain/estoque/Estoque';

export interface RegistrarMovimentacaoEstoqueInput {
  itemId: string;
  tipo: EstoqueMovimentoTipo;
  quantidade: number;
  observacao?: string;
}

export class RegistrarMovimentacaoEstoqueUseCase {
  constructor(
    private readonly movimentos: Repository<EstoqueMovimentacao>,
    private readonly saldos: Repository<EstoqueSaldo>,
    private readonly clock: Clock,
    private readonly idFactory: () => string
  ) {}

  async execute(input: RegistrarMovimentacaoEstoqueInput): Promise<EstoqueSaldo> {
    const current = await this.saldos.getById(input.itemId);
    const quantidade = aplicarMovimentacao(current?.quantidade || 0, input);
    const now = this.clock.now().toISOString();

    const movimento: EstoqueMovimentacao = {
      id: this.idFactory(),
      itemId: input.itemId,
      tipo: input.tipo,
      quantidade: input.quantidade,
      createdAt: now
    };
    if (input.observacao) movimento.observacao = input.observacao;
    await this.movimentos.save(movimento);

    const saldo: EstoqueSaldo = { id: input.itemId, itemId: input.itemId, quantidade, updatedAt: now };
    return this.saldos.save(saldo);
  }
}
