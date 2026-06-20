import type { Perfil } from './Perfil';
import { perfilEstaAptoParaCodigo } from './PerfilFilters';
import { detectarDuplicidadesPerfis, type PerfilDuplicidade } from './PerfilDuplicidade';

export interface PerfilPendenciasDashboard {
  semBairro: number;
  semCodigo: number;
  aptosParaCodigo: number;
  possiveisDuplicados: number;
  arquivados: number;
  duplicidades: PerfilDuplicidade[];
}

export function criarPerfilPendenciasDashboard(perfis: Perfil[]): PerfilPendenciasDashboard {
  const ativos = perfis.filter(perfil => perfil.status === 'ativo');
  const duplicidades = detectarDuplicidadesPerfis(ativos);

  return {
    semBairro: ativos.filter(perfil => !perfil.bairro).length,
    semCodigo: ativos.filter(perfil => !perfil.codigo).length,
    aptosParaCodigo: ativos.filter(perfilEstaAptoParaCodigo).length,
    possiveisDuplicados: duplicidades.length,
    arquivados: perfis.filter(perfil => perfil.status === 'arquivado').length,
    duplicidades
  };
}
