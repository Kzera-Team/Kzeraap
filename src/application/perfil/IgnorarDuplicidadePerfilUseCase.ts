import type { Repository } from '../ports/Repository';
import type { PerfilDuplicidadeResolucao } from '../../domain/perfil/PerfilDuplicidadeResolucao';

export interface IgnorarDuplicidadePerfilInput {
  perfilAId: string;
  perfilBId: string;
  motivo?: string;
}

export class IgnorarDuplicidadePerfilUseCase {
  constructor(
    private readonly resolucoes: Repository<PerfilDuplicidadeResolucao>,
    private readonly idFactory: () => string
  ) {}

  async execute(input: IgnorarDuplicidadePerfilInput, now = new Date().toISOString()): Promise<PerfilDuplicidadeResolucao> {
    const resolucao: PerfilDuplicidadeResolucao = {
      id: this.idFactory(),
      perfilAId: input.perfilAId,
      perfilBId: input.perfilBId,
      status: 'ignorada',
      createdAt: now,
      updatedAt: now
    };

    if (input.motivo) {
      resolucao.motivo = input.motivo;
    }

    return this.resolucoes.save(resolucao);
  }
}
