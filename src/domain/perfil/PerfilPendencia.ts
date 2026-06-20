import type { Perfil } from './Perfil';
import { perfilEstaAptoParaCodigo } from './PerfilFilters';

export type PerfilPendenciaTipo =
  | 'sem_bairro'
  | 'apto_para_codigo'
  | 'sem_codigo';

export interface PerfilPendencia {
  perfilId: string;
  tipo: PerfilPendenciaTipo;
  label: string;
}

export function obterPendenciasPerfil(perfil: Perfil): PerfilPendencia[] {
  const pendencias: PerfilPendencia[] = [];

  if (!perfil.bairro) {
    pendencias.push({
      perfilId: perfil.id,
      tipo: 'sem_bairro',
      label: 'Perfil sem bairro'
    });
  }

  if (!perfil.codigo) {
    pendencias.push({
      perfilId: perfil.id,
      tipo: 'sem_codigo',
      label: 'Perfil sem codigo'
    });
  }

  if (perfilEstaAptoParaCodigo(perfil)) {
    pendencias.push({
      perfilId: perfil.id,
      tipo: 'apto_para_codigo',
      label: 'Perfil apto para definir codigo'
    });
  }

  return pendencias;
}
