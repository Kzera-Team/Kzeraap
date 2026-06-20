import type { Perfil } from './Perfil';

export type PerfilFiltroStatus = 'ativos' | 'arquivados' | 'todos';
export type PerfilFiltroCodigo = 'todos' | 'sem_codigo' | 'com_codigo' | 'aptos_para_codigo';

export interface PerfilListFilters {
  status?: PerfilFiltroStatus;
  codigo?: PerfilFiltroCodigo;
  conhecePessoalmente?: boolean;
  bairro?: string;
  municipio?: string;
}

export const perfilTemCodigo = (perfil: Perfil): boolean => Boolean(perfil.codigo && perfil.codigo.trim());
export const perfilTemBairro = (perfil: Perfil): boolean => Boolean(perfil.bairro && perfil.bairro.trim());

export const perfilEstaAptoParaCodigo = (perfil: Perfil): boolean =>
  perfil.status === 'ativo' && perfilTemBairro(perfil) && !perfilTemCodigo(perfil);

export const perfilAptoParaCodigo = perfilEstaAptoParaCodigo;

function normalizar(value: string | undefined): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function filtrarPerfis(perfis: Perfil[], filters: PerfilListFilters = {}): Perfil[] {
  const status = filters.status || 'ativos';
  const codigo = filters.codigo || 'todos';

  return perfis.filter(perfil => {
    if (status === 'ativos' && perfil.status !== 'ativo') return false;
    if (status === 'arquivados' && perfil.status !== 'arquivado') return false;

    if (codigo === 'sem_codigo' && perfilTemCodigo(perfil)) return false;
    if (codigo === 'com_codigo' && !perfilTemCodigo(perfil)) return false;
    if (codigo === 'aptos_para_codigo' && !perfilEstaAptoParaCodigo(perfil)) return false;

    if (typeof filters.conhecePessoalmente === 'boolean' && perfil.conhecePessoalmente !== filters.conhecePessoalmente) {
      return false;
    }

    if (filters.bairro && normalizar(perfil.bairro) !== normalizar(filters.bairro)) return false;
    if (filters.municipio && normalizar(perfil.municipio) !== normalizar(filters.municipio)) return false;

    return true;
  });
}
