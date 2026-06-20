import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilPendencia } from '../../domain/perfil/PerfilPendencia';
import { obterPendenciasPerfil } from '../../domain/perfil/PerfilPendencia';

export class ListarPendenciasPerfilUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(): Promise<PerfilPendencia[]> {
    const perfis = await this.perfis.list();

    return perfis
      .filter(perfil => perfil.status === 'ativo')
      .flatMap(obterPendenciasPerfil);
  }
}
