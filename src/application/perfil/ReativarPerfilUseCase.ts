import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';

export class ReativarPerfilUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(perfilId: string, now = new Date().toISOString()): Promise<Perfil> {
    const perfil = await this.perfis.getById(perfilId);

    if (!perfil) {
      throw new Error('Perfil não encontrado.');
    }

    const atualizado: Perfil = {
      ...perfil,
      status: 'ativo',
      updatedAt: now
    };

    return this.perfis.save(atualizado);
  }
}
