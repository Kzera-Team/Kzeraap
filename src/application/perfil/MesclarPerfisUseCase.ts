import type { Repository } from '../ports/Repository';
import type { Perfil } from '../../domain/perfil/Perfil';

export interface MesclarPerfisInput {
  principalId: string;
  secundarioId: string;
}

function pick<T>(primary: T | undefined, secondary: T | undefined): T | undefined {
  return primary !== undefined && primary !== '' ? primary : secondary;
}

function setOptional<K extends keyof Perfil>(target: Perfil, key: K, value: Perfil[K] | undefined): void {
  if (value !== undefined) {
    Object.assign(target, { [key]: value });
  }
}

export class MesclarPerfisUseCase {
  constructor(private readonly perfis: Repository<Perfil>) {}

  async execute(input: MesclarPerfisInput, now = new Date().toISOString()): Promise<Perfil> {
    if (input.principalId === input.secundarioId) {
      throw new Error('Não é possível mesclar o perfil com ele mesmo.');
    }

    const principal = await this.perfis.getById(input.principalId);
    const secundario = await this.perfis.getById(input.secundarioId);

    if (!principal || !secundario) {
      throw new Error('Perfil não encontrado.');
    }

    const atualizado: Perfil = {
      ...principal,
      conhecePessoalmente: principal.conhecePessoalmente || secundario.conhecePessoalmente,
      updatedAt: now
    };

    setOptional(atualizado, 'telefone', pick(principal.telefone, secundario.telefone));
    setOptional(atualizado, 'email', pick(principal.email, secundario.email));
    setOptional(atualizado, 'endereco', pick(principal.endereco, secundario.endereco));
    setOptional(atualizado, 'bairro', pick(principal.bairro, secundario.bairro));
    setOptional(atualizado, 'municipio', pick(principal.municipio, secundario.municipio));
    setOptional(atualizado, 'observacoes', pick(principal.observacoes, secundario.observacoes));

    await this.perfis.save(atualizado);

    const secundarioArquivado: Perfil = {
      ...secundario,
      status: 'arquivado',
      updatedAt: now,
      mergedIntoPerfilId: principal.id
    };

    await this.perfis.save(secundarioArquivado);

    return atualizado;
  }
}
