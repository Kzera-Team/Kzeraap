import type { Repository } from '../ports/Repository';
import type { PerfilHistoricoEvento } from '../../domain/perfil/PerfilHistorico';

export class ListarHistoricoPerfilUseCase {
  constructor(private readonly historico: Repository<PerfilHistoricoEvento>) {}

  async execute(perfilId: string): Promise<PerfilHistoricoEvento[]> {
    const eventos = await this.historico.list();

    return eventos
      .filter(evento => evento.perfilId === perfilId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
}
