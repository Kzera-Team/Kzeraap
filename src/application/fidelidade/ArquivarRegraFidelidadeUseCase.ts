import type { Repository } from '../ports/Repository';
import type { RegraFidelidade } from '../../domain/fidelidade/RegraFidelidade';

export class ArquivarRegraFidelidadeUseCase {
  constructor(
    private readonly repository: Repository<RegraFidelidade>,
    private readonly clock: { now: () => Date }
  ) {}

  async execute(id: string): Promise<void> {
    const regra = await this.repository.getById(id);
    if (!regra) throw new Error('Regra não encontrada.');
    await this.repository.save({ ...regra, status: 'arquivada', updatedAt: this.clock.now().toISOString() });
  }
}
