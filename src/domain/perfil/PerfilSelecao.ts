import type { Perfil } from './Perfil';

export interface PerfilSelecaoItem {
  id: string;
  label: string;
  sublabel?: string;
  arquivado: boolean;
}

export function criarPerfilSelecaoItem(perfil: Perfil): PerfilSelecaoItem {
  const item: PerfilSelecaoItem = {
    id: perfil.id,
    label: perfil.codigo || perfil.nome,
    arquivado: perfil.status === 'arquivado'
  };

  if (!perfil.codigo) {
    item.sublabel = 'Sem codigo';
  }

  return item;
}

export function perfisParaSelecao(perfis: Perfil[]): PerfilSelecaoItem[] {
  return perfis
    .filter(perfil => perfil.status === 'ativo')
    .map(criarPerfilSelecaoItem);
}
