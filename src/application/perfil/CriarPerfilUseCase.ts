import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { Perfil } from '../../domain/perfil/Perfil';
import { assertPerfilCriavel } from '../../domain/perfil/PerfilRules';

export interface CriarPerfilInput {
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  bairro?: string;
  municipio?: string;
  conhecePessoalmente?: boolean;
  observacoes?: string;
}

function assignOptional<T extends object, K extends keyof Perfil>(target: T, key: K, value: Perfil[K] | undefined): void {
  if (value !== undefined) {
    Object.assign(target, { [key]: value });
  }
}

export class CriarPerfilUseCase {
  constructor(
    private readonly perfis: Repository<Perfil>,
    private readonly clock: Clock,
    private readonly idFactory: () => string
  ) {}

  async execute(input: CriarPerfilInput): Promise<Perfil> {
    assertPerfilCriavel({ nome: input.nome } as Perfil);

    const now = this.clock.now().toISOString();

    const perfil: Perfil = {
      id: this.idFactory(),
      nome: input.nome.trim(),
      conhecePessoalmente: Boolean(input.conhecePessoalmente),
      status: 'ativo',
      createdAt: now,
      updatedAt: now
    };

    assignOptional(perfil, 'telefone', input.telefone);
    assignOptional(perfil, 'email', input.email);
    assignOptional(perfil, 'endereco', input.endereco);
    assignOptional(perfil, 'bairro', input.bairro);
    assignOptional(perfil, 'municipio', input.municipio);
    assignOptional(perfil, 'observacoes', input.observacoes);

    return this.perfis.save(perfil);
  }
}
