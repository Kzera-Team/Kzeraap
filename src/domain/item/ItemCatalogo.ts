import type { Entity } from '../../core/Entity';
import { DomainError } from '../../core/DomainError';
import type { SessaoPesagemRapida } from '../operacao/PesagemRapida';

export type ItemStatus = 'ativo' | 'arquivado';
export type ItemUnidade = 'un' | 'g' | 'mg' | 'ml' | 'kg' | 'l';

export type LoteStatus = 'ativo' | 'encerrado' | 'conferencia_pendente' | 'divergente';
export type FracionamentoStatus = 'ativo' | 'encerrado' | 'divergente';
export type RetiradaInternaMotivo = 'uso_proprio' | 'amostra' | 'teste' | 'consumo_interno' | 'retirada_autorizada' | 'outro';
export type ResultadoConferencia = 'sem_divergencia' | 'falta' | 'sobra' | 'pendente';

export interface RetiradaInternaEstoque {
  id: string;
  origemTipo: 'guardado' | 'fracionamento';
  origemId: string;
  quantidade: number;
  unidade: ItemUnidade | 'fracao';
  motivo: RetiradaInternaMotivo;
  dataHora: string;
  observacao?: string;
}

export interface LoteConferenciaLinha {
  id: string;
  origemTipo: 'guardado' | 'fracionamento';
  origemId: string;
  esperado: number;
  conferido: number;
  unidadeContagem: ItemUnidade | 'un';
  equivalenteBase: number;
  divergenciaBase: number;
}

export interface LoteConferencia {
  id: string;
  dataHora: string;
  balancaId?: string;
  linhas: LoteConferenciaLinha[];
  totalEsperadoBase: number;
  totalConferidoBase: number;
  divergenciaBase: number;
  resultado: ResultadoConferencia;
  observacao?: string;
}

export interface FracionamentoLote {
  id: string;
  tamanhoFracao: number;
  unidadeFracao: ItemUnidade;
  quantidadeUnidadesCriadas: number;
  quantidadeUnidadesDisponiveis: number;
  dataFracionamento: string;
  quantidadeEsperada: number;
  quantidadeConferida: number;
  divergenciaUnidades: number;
  equivalenteBase: number;
  balancaId?: string;
  status: FracionamentoStatus;
  observacao?: string;
  pesagensRapidas?: SessaoPesagemRapida[];
}

export interface ItemLote {
  id: string;
  nome?: string;
  valor: number;
  custo: number;
  custoTotal: number;
  custoUnitario: number;
  quantidade: number;
  quantidadeGuardada: number;
  dataLancamento: string;
  fracionamentos: FracionamentoLote[];
  retiradasInternas: RetiradaInternaEstoque[];
  conferencias: LoteConferencia[];
  status: LoteStatus;
  createdAt: string;
  updatedAt: string;
  observacao?: string;
}

export interface ItemVariacao {
  id: string;
  nome: string;
  unidade: ItemUnidade;
  lotes: ItemLote[];
  status: 'ativo' | 'arquivado';
  createdAt: string;
  updatedAt: string;
}

export interface ItemCatalogo extends Entity {
  nome: string;
  categoria?: string;
  descricao?: string;
  tags: string[];
  observacao?: string;
  variacoes: ItemVariacao[];
  status: ItemStatus;
}

export interface ItemMetricasPreco {
  preco: number;
  custo: number;
  lucro: number;
  markupPercentual: number;
  margemPercentual: number;
}

export const VARIACAO_PADRAO_ITEM = 'Padrão';

export function assertItemValido(input: Pick<ItemCatalogo, 'nome'>): void {
  if (!input.nome || !input.nome.trim()) throw new DomainError('Item exige nome.', 'ITEM_NOME_OBRIGATORIO');
}

export function unidadeAceitaDecimal(unidade: ItemUnidade): boolean {
  return unidade !== 'un';
}

export function normalizarQuantidadePorUnidade(quantidade: number, unidade: ItemUnidade): number {
  if (quantidade < 0) throw new DomainError('Quantidade não pode ser negativa.', 'ITEM_QUANTIDADE_INVALIDA');
  if (!unidadeAceitaDecimal(unidade) && !Number.isInteger(quantidade)) {
    throw new DomainError('Unidade inteira não aceita decimal.', 'ITEM_UNIDADE_INTEIRA_DECIMAL_INVALIDO');
  }
  return quantidade;
}

export function validarLote(lote: Pick<ItemLote, 'valor' | 'custo' | 'quantidade'>, unidade: ItemUnidade): void {
  if (lote.valor < 0) throw new DomainError('Valor do lote não pode ser negativo.', 'ITEM_LOTE_VALOR_INVALIDO');
  if (lote.custo < 0) throw new DomainError('Custo do lote não pode ser negativo.', 'ITEM_LOTE_CUSTO_INVALIDO');
  normalizarQuantidadePorUnidade(lote.quantidade, unidade);
}

export function validarVariacoes(variacoes: ItemVariacao[]): void {
  if (!variacoes.length) throw new DomainError('Item exige pelo menos uma variação.', 'ITEM_VARIACAO_OBRIGATORIA');
  const nomes = new Set<string>();
  for (const variacao of variacoes) {
    const nome = variacao.nome.trim().toLocaleLowerCase('pt-BR');
    if (!nome) throw new DomainError('Variação exige nome.', 'ITEM_VARIACAO_NOME_OBRIGATORIO');
    if (nomes.has(nome)) throw new DomainError('Variação duplicada.', 'ITEM_VARIACAO_DUPLICADA');
    nomes.add(nome);
    if (!variacao.unidade) throw new DomainError('Variação exige unidade.', 'ITEM_VARIACAO_UNIDADE_OBRIGATORIA');
    if (!variacao.lotes.length) throw new DomainError('Variação exige pelo menos um lote.', 'ITEM_LOTE_OBRIGATORIO');
    for (const lote of variacao.lotes) validarLote(lote, variacao.unidade);
  }
}

export function estoqueDaVariacao(variacao: ItemVariacao): number {
  return variacao.lotes
    .filter(lote => lote.status === 'ativo')
    .reduce((total, lote) => total + estoqueBaseDisponivelDoLote(lote), 0);
}

export function estoqueTotalDoItem(item: Pick<ItemCatalogo, 'variacoes'>): number {
  return item.variacoes
    .filter(variacao => variacao.status === 'ativo')
    .reduce((total, variacao) => total + estoqueDaVariacao(variacao), 0);
}


export function calcularCustoUnitarioLote(lote: Pick<ItemLote, 'custoTotal' | 'quantidade'>): number {
  return lote.quantidade === 0 ? 0 : lote.custoTotal / lote.quantidade;
}

export function equivalenteBaseFracionamento(fracionamento: Pick<FracionamentoLote, 'tamanhoFracao' | 'quantidadeUnidadesCriadas'>): number {
  return fracionamento.tamanhoFracao * fracionamento.quantidadeUnidadesCriadas;
}

export function equivalenteDisponivelFracionamento(fracionamento: Pick<FracionamentoLote, 'tamanhoFracao' | 'quantidadeUnidadesDisponiveis'>): number {
  return fracionamento.tamanhoFracao * fracionamento.quantidadeUnidadesDisponiveis;
}

export interface RegistrarFracionamentoLoteInput {
  tamanhoFracao: number;
  unidadeFracao: ItemUnidade;
  quantidadeUnidadesCriadas: number;
  dataFracionamento: string;
  observacao?: string;
  balancaId?: string;
}

export function equivalenteBaseDoFracionamentoInput(input: Pick<RegistrarFracionamentoLoteInput, 'tamanhoFracao' | 'quantidadeUnidadesCriadas'>): number {
  return input.tamanhoFracao * input.quantidadeUnidadesCriadas;
}

export function validarRegistroFracionamentoLote(lote: ItemLote, input: RegistrarFracionamentoLoteInput, unidadeBase: ItemUnidade): void {
  if (lote.status !== 'ativo') throw new DomainError('Só é possível fracionar lote ativo.', 'ITEM_LOTE_FRACIONAMENTO_LOTE_INATIVO');
  if (input.tamanhoFracao <= 0) throw new DomainError('Tamanho da fração deve ser maior que zero.', 'ITEM_LOTE_FRACAO_TAMANHO_INVALIDO');
  if (!Number.isInteger(input.quantidadeUnidadesCriadas) || input.quantidadeUnidadesCriadas <= 0) {
    throw new DomainError('Quantidade de unidades deve ser inteira e maior que zero.', 'ITEM_LOTE_FRACAO_UNIDADES_INVALIDAS');
  }
  if (input.unidadeFracao !== unidadeBase) {
    throw new DomainError('Fracionamento deve usar a unidade base do lote nesta etapa.', 'ITEM_LOTE_FRACAO_UNIDADE_INVALIDA');
  }
  const equivalenteBase = equivalenteBaseDoFracionamentoInput(input);
  if (equivalenteBase > lote.quantidadeGuardada) {
    throw new DomainError('Fracionamento maior que a quantidade guardada/a granel disponível.', 'ITEM_LOTE_FRACAO_SEM_GUARDADO');
  }
}

export function registrarFracionamentoNoLote(lote: ItemLote, input: RegistrarFracionamentoLoteInput, unidadeBase: ItemUnidade, fracionamentoId: string, now: string): ItemLote {
  validarRegistroFracionamentoLote(lote, input, unidadeBase);
  const equivalenteBase = equivalenteBaseDoFracionamentoInput(input);
  const fracionamento: FracionamentoLote = {
    id: fracionamentoId,
    tamanhoFracao: input.tamanhoFracao,
    unidadeFracao: input.unidadeFracao,
    quantidadeUnidadesCriadas: input.quantidadeUnidadesCriadas,
    quantidadeUnidadesDisponiveis: input.quantidadeUnidadesCriadas,
    dataFracionamento: input.dataFracionamento,
    quantidadeEsperada: input.quantidadeUnidadesCriadas,
    quantidadeConferida: 0,
    divergenciaUnidades: 0,
    equivalenteBase,
    status: 'ativo',
    pesagensRapidas: []
  };
  if (input.observacao?.trim()) fracionamento.observacao = input.observacao.trim();
  if (input.balancaId) fracionamento.balancaId = input.balancaId;
  return {
    ...lote,
    quantidadeGuardada: lote.quantidadeGuardada - equivalenteBase,
    fracionamentos: [...lote.fracionamentos, fracionamento],
    updatedAt: now
  };
}

export function estoqueBaseDisponivelDoLote(lote: ItemLote): number {
  const fracionadoDisponivel = lote.fracionamentos
    .filter(fracionamento => fracionamento.status === 'ativo')
    .reduce((total, fracionamento) => total + equivalenteDisponivelFracionamento(fracionamento), 0);
  return lote.quantidadeGuardada + fracionadoDisponivel;
}

export function conferirLoteConsolidado(input: {
  totalEsperadoBase: number;
  guardadoConferidoBase: number;
  fracionamentos: Array<{ tamanhoFracao: number; unidadesConferidas: number }>;
}): Pick<LoteConferencia, 'totalEsperadoBase' | 'totalConferidoBase' | 'divergenciaBase' | 'resultado'> {
  const totalFracionado = input.fracionamentos.reduce((total, atual) => total + (atual.tamanhoFracao * atual.unidadesConferidas), 0);
  const totalConferidoBase = input.guardadoConferidoBase + totalFracionado;
  const divergenciaBase = totalConferidoBase - input.totalEsperadoBase;
  return {
    totalEsperadoBase: input.totalEsperadoBase,
    totalConferidoBase,
    divergenciaBase,
    resultado: divergenciaBase === 0 ? 'sem_divergencia' : divergenciaBase < 0 ? 'falta' : 'sobra'
  };
}

export function primeiroLoteAtivo(item: ItemCatalogo): ItemLote | undefined {
  return item.variacoes
    .flatMap(variacao => variacao.status === 'ativo' ? variacao.lotes : [])
    .find(lote => lote.status === 'ativo');
}

export function calcularMetricasPreco(custo: number, preco: number): ItemMetricasPreco {
  const lucro = preco - custo;
  return {
    preco,
    custo,
    lucro,
    markupPercentual: custo === 0 ? 0 : (lucro / custo) * 100,
    margemPercentual: preco === 0 ? 0 : (lucro / preco) * 100
  };
}

export function precoParaQuantidade(item: ItemCatalogo, quantidade: number, variacaoId?: string): number {
  const variacao = variacaoId ? item.variacoes.find(current => current.id === variacaoId) : item.variacoes.find(current => current.status === 'ativo');
  if (!variacao) throw new DomainError('Item sem variação ativa.', 'ITEM_SEM_VARIACAO_ATIVA');
  normalizarQuantidadePorUnidade(quantidade, variacao.unidade);
  const lote = variacao.lotes.find(current => current.status === 'ativo');
  if (!lote) throw new DomainError('Variação sem lote ativo.', 'ITEM_SEM_LOTE_ATIVO');
  return lote.valor;
}

export function itemEstoqueBaixo(_item: ItemCatalogo): boolean {
  return false;
}
export interface ResumoOperacionalLote {
  loteId: string;
  quantidadeTotalBase: number;
  quantidadeGuardadaBase: number;
  quantidadeFracionadaCriadaBase: number;
  quantidadeFracionadaDisponivelBase: number;
  estoqueDisponivelBase: number;
  quantidadeRetiradaBase: number;
  totalFracionamentos: number;
  totalConferencias: number;
  totalRetiradasInternas: number;
  custoTotal: number;
  custoUnitario: number;
  status: LoteStatus;
}

export function resumoOperacionalDoLote(lote: ItemLote): ResumoOperacionalLote {
  const quantidadeFracionadaCriadaBase = lote.fracionamentos
    .reduce((total, fracionamento) => total + equivalenteBaseFracionamento(fracionamento), 0);
  const quantidadeFracionadaDisponivelBase = lote.fracionamentos
    .filter(fracionamento => fracionamento.status === 'ativo')
    .reduce((total, fracionamento) => total + equivalenteDisponivelFracionamento(fracionamento), 0);
  const quantidadeRetiradaBase = lote.retiradasInternas.reduce((total, retirada) => total + retirada.quantidade, 0);

  return {
    loteId: lote.id,
    quantidadeTotalBase: lote.quantidade,
    quantidadeGuardadaBase: lote.quantidadeGuardada,
    quantidadeFracionadaCriadaBase,
    quantidadeFracionadaDisponivelBase,
    estoqueDisponivelBase: estoqueBaseDisponivelDoLote(lote),
    quantidadeRetiradaBase,
    totalFracionamentos: lote.fracionamentos.length,
    totalConferencias: lote.conferencias.length,
    totalRetiradasInternas: lote.retiradasInternas.length,
    custoTotal: lote.custoTotal,
    custoUnitario: lote.custoUnitario || calcularCustoUnitarioLote(lote),
    status: lote.status
  };
}

export function encontrarLoteOperacional(item: ItemCatalogo, variacaoId: string, loteId: string): { variacao: ItemVariacao; lote: ItemLote } | null {
  const variacao = item.variacoes.find(atual => atual.id === variacaoId);
  if (!variacao) return null;
  const lote = variacao.lotes.find(atual => atual.id === loteId);
  if (!lote) return null;
  return { variacao, lote };
}

