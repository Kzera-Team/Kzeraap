import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilPendenciasDashboard } from '../../domain/perfil/PerfilPendenciasDashboard';
import { criarPerfilPendenciasDashboard } from '../../domain/perfil/PerfilPendenciasDashboard';

export class PerfilPendenciasDashboardUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(): Promise<PerfilPendenciasDashboard> {
    return criarPerfilPendenciasDashboard(await this.perfis.list());
  }
}
