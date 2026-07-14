export interface LotePontos {
  id: string;
  proprietariaId: string;
  contaId: string;
  movimentoConcessaoId: string;
  pontosOriginais: number;
  pontosDisponiveis: number;
  concedidoEm: string;
  expiraEm: string | null;
}

export function calcularExpiracao(concedidoEm: string, validadeDias: number | null): string | null {
  if (validadeDias === null) return null;
  return new Date(Date.parse(concedidoEm) + validadeDias * 86_400_000).toISOString();
}
