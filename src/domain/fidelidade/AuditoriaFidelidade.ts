export type AcaoAuditoriaFidelidade = 'regra_criada' | 'pontos_concedidos' | 'pontos_resgatados' | 'pontos_expirados';

export interface RegistroAuditoriaFidelidade {
  id: string;
  proprietariaId: string;
  acao: AcaoAuditoriaFidelidade;
  entidadeId: string;
  idempotenciaChave: string | null;
  detalhes: Readonly<Record<string, string | number | boolean | null>>;
  registradaEm: string;
}
