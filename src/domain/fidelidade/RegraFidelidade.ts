import { DecisaoProdutoPendenteError, ValorInvalidoError } from './FidelidadeErrors';

export type PoliticaArredondamento = 'para_baixo' | 'mais_proximo' | 'para_cima';
export type PoliticaConsumo = 'menor_expiracao_primeiro' | 'mais_antigo_primeiro';

export interface RegraFidelidade {
  id: string;
  proprietariaId: string;
  nome: string;
  pontosPorRealMilesimos: number;
  politicaArredondamento: PoliticaArredondamento;
  politicaConsumo: PoliticaConsumo;
  validadeDias: number | null;
  ativa: boolean;
  criadaEm: string;
}

export interface CriarRegraFidelidadeInput {
  id: string;
  proprietariaId: string;
  nome: string;
  pontosPorRealMilesimos: number;
  politicaArredondamento?: PoliticaArredondamento;
  politicaConsumo?: PoliticaConsumo;
  validadeDias?: number | null;
  ativa: boolean;
  criadaEm: string;
}

export function criarRegraFidelidade(input: CriarRegraFidelidadeInput): RegraFidelidade {
  validarTexto(input.id, 'id');
  validarTexto(input.proprietariaId, 'proprietariaId');
  validarTexto(input.nome, 'nome');
  if (!Number.isInteger(input.pontosPorRealMilesimos) || input.pontosPorRealMilesimos <= 0) {
    throw new ValorInvalidoError('pontosPorRealMilesimos');
  }
  if (input.politicaArredondamento === undefined) {
    throw new DecisaoProdutoPendenteError('política de arredondamento');
  }
  if (input.politicaConsumo === undefined) {
    throw new DecisaoProdutoPendenteError('política de consumo dos lotes');
  }
  if (input.validadeDias === undefined) {
    throw new DecisaoProdutoPendenteError('validade dos pontos (dias ou sem expiração)');
  }
  if (input.validadeDias !== null && (!Number.isInteger(input.validadeDias) || input.validadeDias <= 0)) {
    throw new ValorInvalidoError('validadeDias');
  }
  validarIso(input.criadaEm, 'criadaEm');

  return { ...input, politicaArredondamento: input.politicaArredondamento, politicaConsumo: input.politicaConsumo, validadeDias: input.validadeDias };
}

function validarTexto(value: string, campo: string): void {
  if (value.trim().length === 0) throw new ValorInvalidoError(campo);
}

function validarIso(value: string, campo: string): void {
  if (Number.isNaN(Date.parse(value))) throw new ValorInvalidoError(campo);
}
