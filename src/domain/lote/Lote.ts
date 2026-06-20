import type { Entity } from '../../core/Entity';

export interface Lote extends Entity {
  itemId: string;
  quantidadeInicial: number;
  quantidadeDisponivel: number;
  custoUnitario: number;
  entradaEm: string;
  observacao?: string;
}
