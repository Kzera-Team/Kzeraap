import type { Repository } from '../ports/Repository';
import type { RegraFidelidade, PremioFidelidade, RegraFidelidadeStatus } from '../../domain/fidelidade/RegraFidelidade';
import { validarRegraFidelidade } from '../../domain/fidelidade/RegraFidelidade';

export interface SalvarRegraFidelidadeInput {
  id?: string;
  nome: string;
  status: RegraFidelidadeStatus;
  totalPassos: number;
  periodoInicio: string;
  periodoFim?: string;
  regraPassoItemId: string;
  regraPassoItemNome: string;
  regraPassoQuantidade: number;
  regraPassoUnidade: string;
  regraPassoPassosGerados: number;
  premios: PremioFidelidade[];
}

export class SalvarRegraFidelidadeUseCase {
  constructor(
    private readonly repository: Repository<RegraFidelidade>,
    private readonly clock: { now: () => Date },
    private readonly idFactory: () => string
  ) {}

  async execute(input: SalvarRegraFidelidadeInput): Promise<RegraFidelidade> {
    const erros = validarRegraFidelidade(input);
    if (erros.length > 0) throw new Error(erros.join(' '));

    const now = this.clock.now().toISOString();
    const existing = input.id ? await this.repository.getById(input.id) : null;

    const regra: RegraFidelidade = {
      id: input.id ?? this.idFactory(),
      nome: input.nome,
      status: input.status,
      totalPassos: input.totalPassos,
      periodoInicio: input.periodoInicio,
      ...(input.periodoFim ? { periodoFim: input.periodoFim } : {}),
      regraPassoItemId: input.regraPassoItemId,
      regraPassoItemNome: input.regraPassoItemNome,
      regraPassoQuantidade: input.regraPassoQuantidade,
      regraPassoUnidade: input.regraPassoUnidade,
      regraPassoPassosGerados: input.regraPassoPassosGerados,
      premios: input.premios,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    return this.repository.save(regra);
  }
}
