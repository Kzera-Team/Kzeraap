export type TipoMovimentacaoFidelidade = 'concessao' | 'resgate' | 'expiracao';

export interface MovimentacaoFidelidade {
  id: string;
  proprietariaId: string;
  contaId: string;
  clienteId: string;
  tipo: TipoMovimentacaoFidelidade;
  pontos: number;
  saldoAntes: number;
  saldoDepois: number;
  idempotenciaChave: string;
  referenciaExterna: string | null;
  regraId: string | null;
  ocorridaEm: string;
}
