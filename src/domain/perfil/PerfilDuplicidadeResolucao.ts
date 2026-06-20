export type PerfilDuplicidadeResolucaoStatus = 'pendente' | 'ignorada' | 'mesclada';

export interface PerfilDuplicidadeResolucao {
  id: string;
  perfilAId: string;
  perfilBId: string;
  status: PerfilDuplicidadeResolucaoStatus;
  createdAt: string;
  updatedAt: string;
  motivo?: string;
}
