import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilBuscaFiltro } from '../../domain/perfil/PerfilBusca';
import { buscarPerfis } from '../../domain/perfil/PerfilBusca';

export class BuscarPerfisUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(filtro: PerfilBuscaFiltro = {}): Promise<Perfil[]> {
    return buscarPerfis(await this.perfis.list(), filtro);
  }
}
