import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';

export class AtualizarBairroPerfilUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(perfilId: string, bairro: string, now = new Date().toISOString()): Promise<Perfil> {
    const perfil = await this.perfis.getById(perfilId);

    if (!perfil) {
      throw new Error('Perfil não encontrado.');
    }

    if (!bairro.trim()) {
      throw new Error('Bairro não pode ser vazio.');
    }

    const atualizado: Perfil = {
      ...perfil,
      bairro: bairro.trim(),
      updatedAt: now
    };

    return this.perfis.save(atualizado);
  }
}
