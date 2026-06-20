import type { Entity } from '../../core/Entity';
import { DomainError } from '../../core/DomainError';

export type TipoContaFinanceira = 'manual' | 'dinheiro' | 'banco' | 'carteira_digital' | 'cripto' | 'outro';
export type StatusContaFinanceira = 'ativa' | 'inativa';
export type MoedaFinanceira = 'BRL' | 'BTC' | 'ETH' | 'USDT' | 'USD' | 'OUTRA';

export interface ContaFinanceira extends Entity {
  nome: string;
  tipo: TipoContaFinanceira;
  moeda: MoedaFinanceira;
  status: StatusContaFinanceira;
  observacao?: string;
  provedor?: string;
  referenciaExterna?: string;
}

export type TipoMovimentoFinanceiro = 'entrada' | 'saida' | 'abatimento' | 'estorno' | 'ajuste' | 'taxa' | 'transferencia';
export type StatusMovimentoFinanceiro = 'previsto' | 'confirmado' | 'conciliado' | 'ignorado' | 'cancelado';
export type OrigemMovimentoFinanceiro = 'importado_csv' | 'manual' | 'sistema_antigo' | 'conciliacao' | 'banco' | 'cripto' | 'ajuste_operacional';

export interface MovimentoOrigemRastreavel {
  transacaoId?: string;
  pagamentoId?: string;
  clienteNome?: string;
  valorOriginal: number;
  moedaOriginal: MoedaFinanceira;
  observacao?: string;
}

export interface MovimentoFinanceiro extends Entity {
  contaFinanceiraId?: string;
  transacaoId?: string;
  pagamentoId?: string;
  clienteNome?: string;
  tipo: TipoMovimentoFinanceiro;
  valor: number;
  moeda: MoedaFinanceira;
  dataHora: string;
  status: StatusMovimentoFinanceiro;
  origem: OrigemMovimentoFinanceiro;
  loteConfirmacaoId?: string;
  referenciaExterna?: string;
  observacao?: string;
  origensRastreaveis?: MovimentoOrigemRastreavel[];
}

export type TipoPagamentoTransacao = 'pix' | 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pendente' | 'cripto' | 'transferencia' | 'outro';
export type StatusPagamentoTransacao = 'pendente' | 'parcial' | 'pago' | 'cancelado' | 'estornado';

export interface PagamentoTransacao extends Entity {
  transacaoId: string;
  clienteNome: string;
  valor: number;
  moeda: MoedaFinanceira;
  tipo: TipoPagamentoTransacao;
  status: StatusPagamentoTransacao;
  dataHora?: string;
  contaFinanceiraId?: string;
  movimentoFinanceiroId?: string;
  origem: OrigemMovimentoFinanceiro;
  loteConfirmacaoId?: string;
  observacao?: string;
}

export type StatusFinanceiroTransacao = 'pago' | 'parcial' | 'pendente' | 'cancelado';
export type OrigemTransacaoFinanceira = 'importado_csv' | 'manual' | 'sistema_antigo' | 'conciliacao';

export interface TransacaoFinanceira extends Entity {
  numeroOrigem?: string;
  clienteNome: string;
  perfilId?: string;
  dataTransacao: string;
  statusOperacional: string;
  statusFinanceiro: StatusFinanceiroTransacao;
  subtotal: number;
  desconto: number;
  entrega: number;
  taxa: number;
  total: number;
  valorPago: number;
  valorPendente: number;
  custo: number;
  lucro: number;
  origem: OrigemTransacaoFinanceira;
  loteConfirmacaoId?: string;
  assinaturaImportacao?: string;
  confirmadoEm?: string;
  observacao?: string;
}

export interface ResumoFinanceiroTransacao {
  total: number;
  valorPago: number;
  valorPendente: number;
  custo: number;
  lucro: number;
  statusFinanceiro: StatusFinanceiroTransacao;
}

export function arredondarDinheiro(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export function validarValorFinanceiro(valor: number, campo: string): void {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new DomainError(`${campo} financeiro inválido.`, 'FINANCEIRO_VALOR_INVALIDO');
  }
}

export function validarCompradorNomeObrigatorio(clienteNome: string): void {
  if (!clienteNome.trim()) {
    throw new DomainError('Informe o nome do comprador para registrar transacao ou pagamento.', 'FINANCEIRO_CLIENTE_NOME_OBRIGATORIO');
  }
}

export function calcularStatusFinanceiro(total: number, valorPago: number, cancelado = false): StatusFinanceiroTransacao {
  validarValorFinanceiro(total, 'Total');
  validarValorFinanceiro(valorPago, 'Valor pago');
  if (cancelado) return 'cancelado';
  if (total === 0) return 'pago';
  if (valorPago <= 0) return 'pendente';
  if (valorPago + 0.009 >= total) return 'pago';
  return 'parcial';
}

export function resumirFinanceiroTransacao(input: Pick<TransacaoFinanceira, 'total' | 'valorPago' | 'custo' | 'lucro' | 'statusOperacional'>): ResumoFinanceiroTransacao {
  const total = arredondarDinheiro(input.total);
  const valorPago = arredondarDinheiro(Math.min(input.valorPago, total));
  const valorPendente = arredondarDinheiro(Math.max(0, total - valorPago));
  return {
    total,
    valorPago,
    valorPendente,
    custo: arredondarDinheiro(input.custo),
    lucro: arredondarDinheiro(input.lucro),
    statusFinanceiro: calcularStatusFinanceiro(total, valorPago, input.statusOperacional.toLowerCase() === 'cancelado')
  };
}

export interface CriarTransacaoFinanceiraInput {
  numeroOrigem?: string;
  clienteNome: string;
  perfilId?: string;
  dataTransacao: string;
  statusOperacional?: string;
  subtotal?: number;
  desconto?: number;
  entrega?: number;
  taxa?: number;
  total: number;
  valorPago?: number;
  custo?: number;
  lucro?: number;
  origem: OrigemTransacaoFinanceira;
  observacao?: string;
}

export function criarTransacaoFinanceira(input: CriarTransacaoFinanceiraInput, id: string, now: string): TransacaoFinanceira {
  validarCompradorNomeObrigatorio(input.clienteNome);
  const subtotal = arredondarDinheiro(input.subtotal ?? input.total);
  const desconto = arredondarDinheiro(input.desconto ?? 0);
  const entrega = arredondarDinheiro(input.entrega ?? 0);
  const taxa = arredondarDinheiro(input.taxa ?? 0);
  const total = arredondarDinheiro(input.total);
  const valorPago = arredondarDinheiro(input.valorPago ?? 0);
  const custo = arredondarDinheiro(input.custo ?? 0);
  const lucro = arredondarDinheiro(input.lucro ?? total - custo);
  [subtotal, desconto, entrega, taxa, total, valorPago, custo, lucro].forEach((valor, index) => validarValorFinanceiro(valor, `Valor ${index + 1}`));
  const statusOperacional = input.statusOperacional || 'importado';
  const resumo = resumirFinanceiroTransacao({ total, valorPago, custo, lucro, statusOperacional });
  const transacao: TransacaoFinanceira = {
    id,
    clienteNome: input.clienteNome.trim(),
    dataTransacao: input.dataTransacao,
    statusOperacional,
    statusFinanceiro: resumo.statusFinanceiro,
    subtotal,
    desconto,
    entrega,
    taxa,
    total,
    valorPago: resumo.valorPago,
    valorPendente: resumo.valorPendente,
    custo,
    lucro,
    origem: input.origem,
    createdAt: now,
    updatedAt: now
  };
  if (input.numeroOrigem?.trim()) transacao.numeroOrigem = input.numeroOrigem.trim();
  if (input.perfilId?.trim()) transacao.perfilId = input.perfilId.trim();
  if (input.observacao?.trim()) transacao.observacao = input.observacao.trim();
  return transacao;
}

export interface CriarContaFinanceiraInput {
  nome: string;
  tipo?: TipoContaFinanceira;
  moeda?: MoedaFinanceira;
  status?: StatusContaFinanceira;
  observacao?: string;
  provedor?: string;
  referenciaExterna?: string;
}

export function criarContaFinanceira(input: CriarContaFinanceiraInput, id: string, now: string): ContaFinanceira {
  if (!input.nome.trim()) throw new DomainError('Conta financeira exige nome.', 'CONTA_FINANCEIRA_NOME_OBRIGATORIO');
  const conta: ContaFinanceira = {
    id,
    nome: input.nome.trim(),
    tipo: input.tipo || 'manual',
    moeda: input.moeda || 'BRL',
    status: input.status || 'ativa',
    createdAt: now,
    updatedAt: now
  };
  if (input.observacao?.trim()) conta.observacao = input.observacao.trim();
  if (input.provedor?.trim()) conta.provedor = input.provedor.trim();
  if (input.referenciaExterna?.trim()) conta.referenciaExterna = input.referenciaExterna.trim();
  return conta;
}

export interface CriarPagamentoTransacaoInput {
  transacaoId: string;
  clienteNome: string;
  valor: number;
  moeda?: MoedaFinanceira;
  tipo?: TipoPagamentoTransacao;
  status?: StatusPagamentoTransacao;
  dataHora?: string;
  contaFinanceiraId?: string;
  movimentoFinanceiroId?: string;
  origem?: OrigemMovimentoFinanceiro;
  observacao?: string;
}

export function criarPagamentoTransacao(input: CriarPagamentoTransacaoInput, id: string, now: string): PagamentoTransacao {
  if (!input.transacaoId.trim()) throw new DomainError('Pagamento precisa estar vinculado a uma transacao.', 'PAGAMENTO_TRANSACAO_ID_OBRIGATORIO');
  validarCompradorNomeObrigatorio(input.clienteNome);
  validarValorFinanceiro(input.valor, 'Pagamento');
  const pagamento: PagamentoTransacao = {
    id,
    transacaoId: input.transacaoId.trim(),
    clienteNome: input.clienteNome.trim(),
    valor: arredondarDinheiro(input.valor),
    moeda: input.moeda || 'BRL',
    tipo: input.tipo || 'outro',
    status: input.status || (input.valor > 0 ? 'pago' : 'pendente'),
    origem: input.origem || 'manual',
    createdAt: now,
    updatedAt: now
  };
  if (input.dataHora) pagamento.dataHora = input.dataHora;
  if (input.contaFinanceiraId?.trim()) pagamento.contaFinanceiraId = input.contaFinanceiraId.trim();
  if (input.movimentoFinanceiroId?.trim()) pagamento.movimentoFinanceiroId = input.movimentoFinanceiroId.trim();
  if (input.observacao?.trim()) pagamento.observacao = input.observacao.trim();
  return pagamento;
}

export interface CriarMovimentoFinanceiroInput {
  contaFinanceiraId?: string;
  transacaoId?: string;
  pagamentoId?: string;
  clienteNome?: string;
  tipo: TipoMovimentoFinanceiro;
  valor: number;
  moeda?: MoedaFinanceira;
  dataHora?: string;
  status?: StatusMovimentoFinanceiro;
  origem?: OrigemMovimentoFinanceiro;
  referenciaExterna?: string;
  observacao?: string;
  origensRastreaveis?: MovimentoOrigemRastreavel[];
}

export function criarMovimentoFinanceiro(input: CriarMovimentoFinanceiroInput, id: string, now: string): MovimentoFinanceiro {
  validarValorFinanceiro(input.valor, 'Movimento');
  const movimento: MovimentoFinanceiro = {
    id,
    tipo: input.tipo,
    valor: arredondarDinheiro(input.valor),
    moeda: input.moeda || 'BRL',
    dataHora: input.dataHora || now,
    status: input.status || 'confirmado',
    origem: input.origem || 'manual',
    createdAt: now,
    updatedAt: now
  };
  if (input.contaFinanceiraId?.trim()) movimento.contaFinanceiraId = input.contaFinanceiraId.trim();
  if (input.transacaoId?.trim()) movimento.transacaoId = input.transacaoId.trim();
  if (input.pagamentoId?.trim()) movimento.pagamentoId = input.pagamentoId.trim();
  if (input.clienteNome?.trim()) movimento.clienteNome = input.clienteNome.trim();
  if (input.referenciaExterna?.trim()) movimento.referenciaExterna = input.referenciaExterna.trim();
  if (input.observacao?.trim()) movimento.observacao = input.observacao.trim();
  if (input.origensRastreaveis?.length) movimento.origensRastreaveis = input.origensRastreaveis.map(origem => ({ ...origem, valorOriginal: arredondarDinheiro(origem.valorOriginal) }));
  return movimento;
}
