import { DomainError } from '../../core/DomainError';
import type { Perfil } from './Perfil';

export function assertPerfilCriavel(input: Pick<Perfil, 'nome'>): void {
  if (!input.nome || !input.nome.trim()) {
    throw new DomainError('Perfil exige nome.', 'CLIENTE_NOME_OBRIGATORIO');
  }
}

export function perfilPodeAparecerEmBuscaPadrao(perfil: Perfil): boolean {
  return perfil.status === 'ativo';
}

export function perfilTemCodigo(perfil: Perfil): boolean {
  return Boolean(perfil.codigo && perfil.codigo.trim());
}

export function perfilAptoParaDefinirCodigo(perfil: Perfil, requisitosAtendidos: boolean): boolean {
  return perfil.status === 'ativo' && !perfilTemCodigo(perfil) && requisitosAtendidos;
}

export function arquivarPerfil(perfil: Perfil, when: string): Perfil {
  return {
    ...perfil,
    status: 'arquivado',
    updatedAt: when
  };
}
