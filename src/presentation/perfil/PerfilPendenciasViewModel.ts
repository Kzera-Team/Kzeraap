
export interface PerfilPendencia {
  tipo: 'sem_codigo' | 'sem_bairro' | 'duplicidade';
  perfilId: string;
}

export interface PerfilPendenciasDashboard {
  total: number;
  pendencias: PerfilPendencia[];
}
