import { DomainError } from '../../core/DomainError';

export function assertTotalNaoNegativo(total: number): void {
  if (total < 0) {
    throw new DomainError('Total da transacao não pode ser negativo.', 'TRANSACAO_TOTAL_NEGATIVO');
  }
}

export function calcularTotalComDescontos(subtotal: number, descontoValor: number, descontoPercentual: number): number {
  const pct = Math.max(0, descontoPercentual);
  const valor = Math.max(0, descontoValor);
  const total = subtotal - (subtotal * pct / 100) - valor;
  return Math.max(0, total);
}
