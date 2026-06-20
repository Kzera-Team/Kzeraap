import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilSelecaoItem } from '../../domain/perfil/PerfilSelecao';
import { perfisParaSelecao } from '../../domain/perfil/PerfilSelecao';

export class SelecionarPerfilUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(): Promise<PerfilSelecaoItem[]> {
    return perfisParaSelecao(await this.perfis.list());
  }
}
