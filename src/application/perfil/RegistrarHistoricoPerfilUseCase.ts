import type { Repository } from '../ports/Repository';
import type { PerfilHistoricoEvento, PerfilHistoricoTipo } from '../../domain/perfil/PerfilHistorico';

export interface RegistrarHistoricoPerfilInput {
  perfilId: string;
  tipo: PerfilHistoricoTipo;
  descricao: string;
  runtimeState?: Record<string, string | number | boolean>;
}

export class RegistrarHistoricoPerfilUseCase {
  constructor(
    private readonly historico: Repository<PerfilHistoricoEvento>,
    private readonly idFactory: () => string
  ) {}

  async execute(input: RegistrarHistoricoPerfilInput, now = new Date().toISOString()): Promise<PerfilHistoricoEvento> {
    const evento: PerfilHistoricoEvento = {
      id: this.idFactory(),
      perfilId: input.perfilId,
      tipo: input.tipo,
      descricao: input.descricao,
      createdAt: now
    };

    if (input.runtimeState) {
      evento.runtimeState = input.runtimeState;
    }

    return this.historico.save(evento);
  }
}
