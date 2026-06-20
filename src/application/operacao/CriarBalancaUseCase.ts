import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { Balanca, BalancaStatus } from '../../domain/operacao/Balanca';
import { criarBalanca } from '../../domain/operacao/Balanca';

export interface CriarBalancaUseCaseInput {
  nome: string;
  codigo?: string;
  status?: BalancaStatus;
  padrao?: boolean;
  observacao?: string;
}

export class CriarBalancaUseCase {
  constructor(
    private readonly balancas: Repository<Balanca>,
    private readonly clock: Clock,
    private readonly idFactory: () => string
  ) {}

  async execute(input: CriarBalancaUseCaseInput): Promise<Balanca> {
    const now = this.clock.now().toISOString();
    const nova = criarBalanca(input, this.idFactory(), now);
    if (nova.padrao) await this.removerPadraoDasOutras(nova.id, now);
    return this.balancas.save(nova);
  }

  private async removerPadraoDasOutras(idAtual: string, now: string): Promise<void> {
    const existentes = await this.balancas.list();
    await Promise.all(existentes.filter(balanca => balanca.id !== idAtual && balanca.padrao).map(balanca => this.balancas.save({ ...balanca, padrao: false, updatedAt: now })));
  }
}
