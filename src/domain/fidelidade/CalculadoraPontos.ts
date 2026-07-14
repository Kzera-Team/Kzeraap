import type { PoliticaArredondamento, RegraFidelidade } from './RegraFidelidade';
import { ValorInvalidoError } from './FidelidadeErrors';

const DIVISOR_CENTAVOS_E_MILESIMOS = 100_000;

export function calcularPontos(valorCentavos: number, regra: RegraFidelidade): number {
  if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) {
    throw new ValorInvalidoError('valorCentavos');
  }
  const pontosBrutos = (valorCentavos * regra.pontosPorRealMilesimos) / DIVISOR_CENTAVOS_E_MILESIMOS;
  return arredondar(pontosBrutos, regra.politicaArredondamento);
}

function arredondar(valor: number, politica: PoliticaArredondamento): number {
  switch (politica) {
    case 'para_baixo': return Math.floor(valor);
    case 'mais_proximo': return Math.round(valor);
    case 'para_cima': return Math.ceil(valor);
  }
}
