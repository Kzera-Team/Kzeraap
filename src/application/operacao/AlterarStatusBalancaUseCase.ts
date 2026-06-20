import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { Balanca, BalancaStatus } from '../../domain/operacao/Balanca';

export class AlterarStatusBalancaUseCase {
  constructor(private readonly balancas: Repository<Balanca>, private readonly clock: Clock) {}

  async execute(id: string, status: BalancaStatus): Promise<Balanca> {
    const balanca = await this.balancas.getById(id);
    if (!balanca) throw new Error('Balança não encontrada.');
    const next: Balanca = { ...balanca, status, updatedAt: this.clock.now().toISOString() };
    if (status === 'inativa') next.padrao = false;
    return this.balancas.save(next);
  }
}
