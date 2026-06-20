import { DomainError } from '../../core/DomainError';

export type EstoqueMovimentoTipo = 'entrada' | 'saida' | 'ajuste';

export interface EstoqueMovimentacao {
  id: string;
  itemId: string;
  tipo: EstoqueMovimentoTipo;
  quantidade: number;
  createdAt: string;
  observacao?: string;
}

export interface EstoqueSaldo {
  id: string;
  itemId: string;
  quantidade: number;
  updatedAt: string;
}

export function validarQuantidadeEstoque(quantidade: number): void {
  if (!Number.isFinite(quantidade) || quantidade < 0) {
    throw new DomainError('Quantidade de estoque precisa ser positiva.', 'ESTOQUE_QUANTIDADE_INVALIDA');
  }
}

export function aplicarMovimentacao(saldoAtual: number, movimento: Pick<EstoqueMovimentacao, 'tipo' | 'quantidade'>): number {
  validarQuantidadeEstoque(movimento.quantidade);
  if (movimento.tipo === 'entrada') return saldoAtual + movimento.quantidade;
  if (movimento.tipo === 'saida') {
    if (saldoAtual < movimento.quantidade) throw new DomainError('Estoque insuficiente.', 'ESTOQUE_INSUFICIENTE');
    return saldoAtual - movimento.quantidade;
  }
  return movimento.quantidade;
}
