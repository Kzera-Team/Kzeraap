import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilListFilters } from '../../domain/perfil/PerfilFilters';
import { filtrarPerfis } from '../../domain/perfil/PerfilFilters';

export class ListarPerfisUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(filters: PerfilListFilters = {}): Promise<Perfil[]> {
    return filtrarPerfis(await this.perfis.list(), filters);
  }
}
