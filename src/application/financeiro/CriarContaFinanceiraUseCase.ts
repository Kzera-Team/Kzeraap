import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import { criarContaFinanceira, type ContaFinanceira, type CriarContaFinanceiraInput } from '../../domain/financeiro/Financeiro';

export class CriarContaFinanceiraUseCase {
  constructor(
    private readonly contas: Repository<ContaFinanceira>,
    private readonly clock: Clock,
    private readonly idFactory: () => string
  ) {}

  async execute(input: CriarContaFinanceiraInput): Promise<ContaFinanceira> {
    const now = this.clock.now().toISOString();
    return this.contas.save(criarContaFinanceira(input, this.idFactory(), now));
  }
}
