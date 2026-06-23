export type UnidadeOperacional = 'g' | 'ml';

export interface UnidadeOperacionalConfig {
  unidade: UnidadeOperacional;
  unidadeBanco: 'mg' | 'ml';
  fatorTelaParaBanco: number;
}

export const UNIDADES_OPERACIONAIS: UnidadeOperacionalConfig[] = [
  { unidade: 'g', unidadeBanco: 'mg', fatorTelaParaBanco: 1000 },
  { unidade: 'ml', unidadeBanco: 'ml', fatorTelaParaBanco: 1 }
];

export function unidadesOperacionaisDisponiveis(): UnidadeOperacional[] {
  return UNIDADES_OPERACIONAIS.map(config => config.unidade);
}

export function isUnidadeOperacional(unidade: string): unidade is UnidadeOperacional {
  return unidadesOperacionaisDisponiveis().includes(unidade as UnidadeOperacional);
}

export function exigirUnidadeOperacional(unidade: string): UnidadeOperacional {
  if (!isUnidadeOperacional(unidade)) throw new Error('Unidade operacional inválida.');
  return unidade;
}

export function telaParaBanco(valor: number, unidade: UnidadeOperacional): number {
  return valor * configUnidade(unidade).fatorTelaParaBanco;
}

export function bancoParaTela(valor: number, unidade: UnidadeOperacional): number {
  return valor / configUnidade(unidade).fatorTelaParaBanco;
}

export function unidadeBanco(unidade: UnidadeOperacional): 'mg' | 'ml' {
  return configUnidade(unidade).unidadeBanco;
}

function configUnidade(unidade: UnidadeOperacional): UnidadeOperacionalConfig {
  return UNIDADES_OPERACIONAIS.find(config => config.unidade === unidade) || UNIDADES_OPERACIONAIS[0];
}
