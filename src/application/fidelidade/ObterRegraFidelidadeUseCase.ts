import type { Repository } from '../ports/Repository';
import type { RegraFidelidade } from '../../domain/fidelidade/RegraFidelidade';

export class ObterRegraFidelidadeUseCase {
  constructor(private readonly repository: Repository<RegraFidelidade>) {}

  async execute(): Promise<RegraFidelidade | null> {
    const todas = await this.repository.list();
    return todas.find(r => r.status !== 'arquivada') ?? null;
  }
}
