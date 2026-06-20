import type { Controller } from '../contracts/Controller';
import type { ListarPerfisUseCase } from '../../application/perfil/ListarPerfisUseCase';
import type { ListarPendenciasPerfilUseCase } from '../../application/perfil/ListarPendenciasPerfilUseCase';

export interface PerfilView {
  render(root: HTMLElement, data: {
    perfis: unknown[];
    pendencias: unknown[];
  }): Promise<void>;
}

export class PerfilController implements Controller {
  constructor(
    private readonly listarPerfis: ListarPerfisUseCase,
    private readonly listarPendencias: ListarPendenciasPerfilUseCase,
    private readonly view: PerfilView
  ) {}

  async mount(root: HTMLElement): Promise<void> {
    const perfis = await this.listarPerfis.execute({ status: 'ativos' });
    const pendencias = await this.listarPendencias.execute();

    await this.view.render(root, {
      perfis,
      pendencias
    });
  }
}
