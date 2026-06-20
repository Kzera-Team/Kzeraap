import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { Balanca, CalibragemResultado } from '../../domain/operacao/Balanca';
import { registrarCalibragemNaBalanca } from '../../domain/operacao/Balanca';

export interface RegistrarCalibragemBalancaUseCaseInput {
  balancaId: string;
  pesoUsado: number;
  unidade: 'mg' | 'g' | 'kg';
  resultado: CalibragemResultado;
  dataHora?: string;
  observacao?: string;
}

export class RegistrarCalibragemBalancaUseCase {
  constructor(
    private readonly balancas: Repository<Balanca>,
    private readonly clock: Clock,
    private readonly idFactory: () => string
  ) {}

  async execute(input: RegistrarCalibragemBalancaUseCaseInput): Promise<Balanca> {
    const balanca = await this.balancas.getById(input.balancaId);
    if (!balanca) throw new Error('Balança não encontrada.');
    const now = this.clock.now().toISOString();
    return this.balancas.save(registrarCalibragemNaBalanca(balanca, input, this.idFactory(), now));
  }
}
