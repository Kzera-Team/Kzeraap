import type { Entity } from '../../core/Entity';

export type PerfilStatus = 'ativo' | 'arquivado';

export interface Perfil extends Entity {
  createdAt: string;
  updatedAt: string;
  nome: string;
  codigo?: string;
  codigoDefinidoEm?: string;
  identidadeRegraId?: string;
  bairro?: string;
  municipio?: string;
  endereco?: string;
  observacoes?: string;
  conhecePessoalmente: boolean;
  telefone?: string;
  email?: string;
  status: PerfilStatus;
  archivedAt?: string;
  archivedReason?: string;
  mergedIntoPerfilId?: string;
  ultimaImportacaoId?: string;
}

export interface PerfilResumoOperacional {
  id: string;
  codigo?: string;
  codigoDefinidoEm?: string;
  identidadeRegraId?: string;
  status: PerfilStatus;
  conhecePessoalmente: boolean;
  semCodigo: boolean;
}
