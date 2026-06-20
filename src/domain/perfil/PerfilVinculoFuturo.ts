export interface PerfilVinculoFuturo {
  perfilId: string;
  operacoes: number;
  transacoes: number;
  observacao: string;
}

export function perfilPodeSerMescladoSemQuebrarVinculos(vinculo: PerfilVinculoFuturo): boolean {
  return vinculo.operacoes >= 0 && vinculo.transacoes >= 0;
}
