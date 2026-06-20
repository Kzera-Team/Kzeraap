import type { Perfil } from '../domain/perfil/Perfil';

export interface PerfilRecord {
  id: string;
  codigo?: string;
  conhecePessoalmente: boolean;
  status: Perfil['status'];
  createdAt: string;
  updatedAt: string;
  packedPayload: string;
}

export interface PerfilPayload {
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  bairro?: string;
  municipio?: string;
  observacoes?: string;
}

function withOptional<T extends object, K extends keyof PerfilPayload>(
  target: T,
  key: K,
  value: PerfilPayload[K]
): T {
  if (value !== undefined) {
    return { ...target, [key]: value };
  }

  return target;
}

export function extractPerfilPayload(perfil: Perfil): PerfilPayload {
  let payload: PerfilPayload = {
    nome: perfil.nome
  };

  payload = withOptional(payload, 'telefone', perfil.telefone);
  payload = withOptional(payload, 'email', perfil.email);
  payload = withOptional(payload, 'endereco', perfil.endereco);
  payload = withOptional(payload, 'bairro', perfil.bairro);
  payload = withOptional(payload, 'municipio', perfil.municipio);
  payload = withOptional(payload, 'observacoes', perfil.observacoes);

  return payload;
}

export function buildPerfilRecord(perfil: Perfil, packedPayload: string): PerfilRecord {
  const record: PerfilRecord = {
    id: perfil.id,
    conhecePessoalmente: Boolean(perfil.conhecePessoalmente),
    status: perfil.status,
    createdAt: perfil.createdAt,
    updatedAt: perfil.updatedAt,
    packedPayload
  };

  if (perfil.codigo !== undefined) {
    record.codigo = perfil.codigo;
  }

  return record;
}

export function mergePerfilPayload(record: PerfilRecord, sensitive: PerfilPayload): Perfil {
  const perfil: Perfil = {
    id: record.id,
    nome: sensitive.nome,
    conhecePessoalmente: record.conhecePessoalmente,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };

  if (record.codigo !== undefined) perfil.codigo = record.codigo;
  if (sensitive.telefone !== undefined) perfil.telefone = sensitive.telefone;
  if (sensitive.email !== undefined) perfil.email = sensitive.email;
  if (sensitive.endereco !== undefined) perfil.endereco = sensitive.endereco;
  if (sensitive.bairro !== undefined) perfil.bairro = sensitive.bairro;
  if (sensitive.municipio !== undefined) perfil.municipio = sensitive.municipio;
  if (sensitive.observacoes !== undefined) perfil.observacoes = sensitive.observacoes;

  return perfil;
}
