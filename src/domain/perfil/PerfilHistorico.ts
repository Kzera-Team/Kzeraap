export type PerfilHistoricoTipo =
  | 'criado'
  | 'editado'
  | 'arquivado'
  | 'reativado'
  | 'codigo_definido'
  | 'importado'
  | 'mesclado'
  | 'duplicidade_ignorada';

export interface PerfilHistoricoEvento {
  id: string;
  perfilId: string;
  tipo: PerfilHistoricoTipo;
  descricao: string;
  createdAt: string;
  runtimeState?: Record<string, string | number | boolean>;
}

export function criarPerfilHistoricoEvento(input: PerfilHistoricoEvento): PerfilHistoricoEvento {
  return input;
}
