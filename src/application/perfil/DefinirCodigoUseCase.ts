import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { IdentityRule } from '../../domain/identidade/IdentityRule';
import { IdentityRuleEngine } from '../../domain/identidade/IdentityRuleEngine';

export class DefinirCodigoUseCase {
  private readonly engine = new IdentityRuleEngine();

  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(perfilId: string, rule: IdentityRule, now = new Date().toISOString()): Promise<Perfil> {
    const perfil = await this.perfis.getById(perfilId);

    if (!perfil) {
      throw new Error('Perfil não encontrado.');
    }

    if (perfil.codigo) {
      throw new Error('Codigo é imutável e já foi definido.');
    }

    if (!perfil.bairro) {
      throw new Error('Perfil precisa ter bairro antes de definir codigo.');
    }

    const codigo = this.engine.generate(rule, perfil);

    if (!codigo.trim()) {
      throw new Error('Regra de identidade gerou codigo vazio.');
    }

    const existentes = await this.perfis.list();
    const duplicado = existentes.some(item => item.id !== perfil.id && item.codigo === codigo);

    if (duplicado) {
      throw new Error('Codigo gerado já existe.');
    }

    const atualizado: Perfil = {
      ...perfil,
      codigo,
      codigoDefinidoEm: now,
      identidadeRegraId: rule.id,
      updatedAt: now
    };

    return this.perfis.save(atualizado);
  }
}
