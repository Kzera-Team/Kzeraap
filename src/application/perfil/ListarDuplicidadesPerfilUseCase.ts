import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilDuplicidade } from '../../domain/perfil/PerfilDuplicidade';
import { detectarDuplicidadesPerfis } from '../../domain/perfil/PerfilDuplicidade';

export class ListarDuplicidadesPerfilUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(): Promise<PerfilDuplicidade[]> {
    const perfis = await this.perfis.list();
    const ativos = perfis.filter(perfil => perfil.status === 'ativo');

    return detectarDuplicidadesPerfis(ativos);
  }
}
