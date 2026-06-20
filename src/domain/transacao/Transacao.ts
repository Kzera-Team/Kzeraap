import type { Entity } from '../../core/Entity';

export type TipoItemTransacao = 'item' | 'campanha';
export type TransacaoStatus = 'concluida' | 'cancelada';

export interface TransacaoPagamento {
  forma: string;
  valor: number;
}

export interface TransacaoItemSnapshot {
  tipo: TipoItemTransacao;
  itemId: string;
  nomeOperacional: string;
  quantidade: number;
  precoPraticado: number;
  descontoValor: number;
  descontoPercentual: number;
  custoUnitario: number;
  lucroTotal: number;
}

export interface Transacao extends Entity {
  perfilId?: string;
  compradorNomeTexto?: string;
  perfilCodigo?: string;
  status: TransacaoStatus;
  subtotal: number;
  descontoValor: number;
  descontoPercentual: number;
  total: number;
  pagamentos: TransacaoPagamento[];
  itens: TransacaoItemSnapshot[];
}
