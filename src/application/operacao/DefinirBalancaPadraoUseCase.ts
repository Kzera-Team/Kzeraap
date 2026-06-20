import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { Balanca } from '../../domain/operacao/Balanca';

export class DefinirBalancaPadraoUseCase {
  constructor(private readonly balancas: Repository<Balanca>, private readonly clock: Clock) {}

  async execute(id: string): Promise<Balanca> {
    const existentes = await this.balancas.list();
    const alvo = existentes.find(balanca => balanca.id === id);
    if (!alvo) throw new Error('Balança não encontrada.');
    if (alvo.status !== 'ativa') throw new Error('Balança inativa não pode ser padrão.');
    const now = this.clock.now().toISOString();
    await Promise.all(existentes.filter(balanca => balanca.id !== id && balanca.padrao).map(balanca => this.balancas.save({ ...balanca, padrao: false, updatedAt: now })));
    return this.balancas.save({ ...alvo, padrao: true, updatedAt: now });
  }
}
