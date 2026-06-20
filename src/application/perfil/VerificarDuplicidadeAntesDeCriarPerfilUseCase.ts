import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilDuplicidade } from '../../domain/perfil/PerfilDuplicidade';
import { detectarDuplicidadePerfil } from '../../domain/perfil/PerfilDuplicidade';

export class VerificarDuplicidadeAntesDeCriarPerfilUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(candidato: Perfil): Promise<PerfilDuplicidade[]> {
    const existentes = await this.perfis.list();

    return existentes
      .filter(perfil => perfil.status === 'ativo')
      .map(perfil => detectarDuplicidadePerfil(candidato, perfil))
      .filter((item): item is PerfilDuplicidade => Boolean(item))
      .sort((a, b) => b.score - a.score);
  }
}
