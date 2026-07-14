import type { Entity } from '../../core/Entity';

export type TipoRegistroImportacaoFinanceira = 'transacao' | 'financeiro';
export type StatusLoteImportacaoFinanceira = 'preparando' | 'pendente' | 'pronto' | 'confirmando' | 'confirmado' | 'falha_parcial' | 'cancelado';
export type StatusRegistroImportacaoFinanceira = 'pendente' | 'validado' | 'ignorado' | 'confirmado' | 'erro';
export type StatusPreviaConfirmacaoImportacao = 'congelada' | 'confirmando' | 'confirmada' | 'falha_revertida' | 'falha_parcial' | 'desfeita';
export type CodigoPendenciaImportacao =
  | 'campo_obrigatorio'
  | 'valor_invalido'
  | 'perfil_nao_encontrado'
  | 'item_nao_encontrado'
  | 'transacao_nao_encontrada'
  | 'divergencia_valor'
  | 'divergencia_perfil'
  | 'divergencia_pagamento'
  | 'registro_orfao'
  | 'revisao_manual';

export interface EscopoImportacaoFinanceira {
  usuarioId: string;
  loteId: string;
}

export interface PendenciaImportacaoFinanceira {
  codigo: CodigoPendenciaImportacao;
  mensagem: string;
  campo?: string;
  valor?: string;
}

export interface TransacaoImportadaNormalizada {
  numero?: string;
  clienteNome: string;
  perfilId?: string;
  dataTransacao?: string;
  descricao?: string;
  total: number;
  valorPago: number;
  custo: number;
  lucro: number;
  tiposPagamento: string[];
}

export interface MovimentoImportadoNormalizado {
  numeroTransacaoReferenciado?: string;
  clienteNome: string;
  perfilId?: string;
  dataPagamento?: string;
  valor: number;
  valorPago: number;
  metodoPagamento: string;
  pago: boolean;
}

export type DadosNormalizadosImportacao = TransacaoImportadaNormalizada | MovimentoImportadoNormalizado;

export interface LoteImportacaoFinanceira extends Entity, EscopoImportacaoFinanceira {
  requestId: string;
  nomeArquivoTransacoes?: string;
  nomeArquivoFinanceiro?: string;
  status: StatusLoteImportacaoFinanceira;
  totalRegistros: number;
  totalPendentes: number;
  totalValidos: number;
  totalConfirmados: number;
  ultimaFalha?: string;
}

export interface RegistroImportacaoFinanceira extends Entity, EscopoImportacaoFinanceira {
  tipo: TipoRegistroImportacaoFinanceira;
  linha: number;
  fingerprint: string;
  dadosBrutos: Record<string, string>;
  dadosNormalizados?: DadosNormalizadosImportacao;
  status: StatusRegistroImportacaoFinanceira;
  pendencias: PendenciaImportacaoFinanceira[];
  registroTransacaoVinculadoId?: string;
  registrosFinanceirosVinculadosIds?: string[];
  resolucao?: 'manual' | 'automatica_segura';
  previaId?: string;
  artefatosOficiaisIds?: string[];
  ultimaFalha?: string;
}

export interface SnapshotConfirmacaoImportacao {
  registro: RegistroImportacaoFinanceira;
  financeiros: RegistroImportacaoFinanceira[];
  assinatura: string;
}

export interface ArtefatosConfirmacaoImportacao {
  transacaoIds: string[];
  pagamentoIds: string[];
  movimentoIds: string[];
  registrosConfirmadosIds: string[];
}

export interface PreviaConfirmacaoImportacao extends Entity, EscopoImportacaoFinanceira {
  status: StatusPreviaConfirmacaoImportacao;
  assinatura: string;
  snapshots: SnapshotConfirmacaoImportacao[];
  registrosBloqueadosIds: string[];
  artefatos: ArtefatosConfirmacaoImportacao;
  resultado: 'total' | 'parcial';
  ultimaFalha?: string;
  confirmadoEm?: string;
}

export interface AuditoriaRegistroImportacao extends Entity, EscopoImportacaoFinanceira {
  operacao: 'preparacao' | 'conciliacao' | 'resolucao' | 'previa' | 'confirmacao' | 'rollback' | 'recovery' | 'retry';
  registroId?: string;
  previaId?: string;
  antes?: unknown;
  depois?: unknown;
  detalhe?: string;
}

export interface PlanoArtefatoOficial {
  registroId: string;
  assinatura: string;
  transacao: TransacaoImportadaNormalizada;
  financeiros: MovimentoImportadoNormalizado[];
}

export interface ResultadoEscritaArtefatoOficial {
  transacaoId: string;
  pagamentoIds: string[];
  movimentoIds: string[];
}

export function artefatosVazios(): ArtefatosConfirmacaoImportacao {
  return { transacaoIds: [], pagamentoIds: [], movimentoIds: [], registrosConfirmadosIds: [] };
}

export class ImportacaoFinanceiraError extends Error {
  constructor(public readonly code: string, message: string, public readonly retryable = false) {
    super(message);
    this.name = 'ImportacaoFinanceiraError';
  }
}
