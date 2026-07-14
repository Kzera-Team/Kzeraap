import {
  type MovimentoImportadoNormalizado,
  type PendenciaImportacaoFinanceira,
  type RegistroImportacaoFinanceira,
  type TransacaoImportadaNormalizada
} from './ImportacaoFinanceira';

export interface SugestaoConciliacaoImportacao {
  registroTransacaoId: string;
  registroFinanceiroIds: string[];
  segura: boolean;
  pendencias: PendenciaImportacaoFinanceira[];
}

function textoNormalizado(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function dinheiro(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function nomesCompativeis(transacao: TransacaoImportadaNormalizada, financeiro: MovimentoImportadoNormalizado): boolean {
  if (transacao.perfilId && financeiro.perfilId) return transacao.perfilId === financeiro.perfilId;
  return Boolean(transacao.clienteNome && financeiro.clienteNome && textoNormalizado(transacao.clienteNome) === textoNormalizado(financeiro.clienteNome));
}

function pagamentosCompativeis(transacao: TransacaoImportadaNormalizada, financeiro: MovimentoImportadoNormalizado): boolean {
  if (!transacao.tiposPagamento.length || !financeiro.metodoPagamento) return true;
  return transacao.tiposPagamento.includes(financeiro.metodoPagamento) || transacao.tiposPagamento.includes('outro') || financeiro.metodoPagamento === 'outro';
}

export function conciliarRegistro(
  transacaoRegistro: RegistroImportacaoFinanceira,
  financeiros: RegistroImportacaoFinanceira[]
): SugestaoConciliacaoImportacao {
  const transacao = transacaoRegistro.dadosNormalizados as TransacaoImportadaNormalizada | undefined;
  if (!transacao) return { registroTransacaoId: transacaoRegistro.id, registroFinanceiroIds: [], segura: false, pendencias: [{ codigo: 'revisao_manual', mensagem: 'Transação sem dados normalizados.' }] };

  const candidatos = financeiros.filter(registro => {
    const financeiro = registro.dadosNormalizados as MovimentoImportadoNormalizado | undefined;
    if (!financeiro || registro.status === 'ignorado' || registro.status === 'confirmado') return false;
    const numeroCompativel = Boolean(transacao.numero && financeiro.numeroTransacaoReferenciado === transacao.numero);
    const vinculoManual = registro.registroTransacaoVinculadoId === transacaoRegistro.id;
    return numeroCompativel || vinculoManual;
  });

  if (!candidatos.length) {
    return { registroTransacaoId: transacaoRegistro.id, registroFinanceiroIds: [], segura: transacao.valorPago === 0, pendencias: transacao.valorPago > 0 ? [{ codigo: 'transacao_nao_encontrada', mensagem: 'Nenhuma movimentação financeira compatível foi encontrada.' }] : [] };
  }

  const pendencias: PendenciaImportacaoFinanceira[] = [];
  const movimentos = candidatos.map(item => item.dadosNormalizados as MovimentoImportadoNormalizado);
  if (!movimentos.every(item => nomesCompativeis(transacao, item))) pendencias.push({ codigo: 'divergencia_perfil', mensagem: 'Perfil da movimentação não corresponde ao da transação.' });
  if (!movimentos.every(item => pagamentosCompativeis(transacao, item))) pendencias.push({ codigo: 'divergencia_pagamento', mensagem: 'Método de pagamento incompatível.' });
  const totalFinanceiro = dinheiro(movimentos.reduce((sum, item) => sum + (item.valorPago || item.valor), 0));
  if (Math.abs(totalFinanceiro - dinheiro(transacao.valorPago)) > 0.01) pendencias.push({ codigo: 'divergencia_valor', mensagem: 'Soma financeira não corresponde ao valor pago da transação.' });

  return {
    registroTransacaoId: transacaoRegistro.id,
    registroFinanceiroIds: candidatos.map(item => item.id),
    segura: pendencias.length === 0,
    pendencias
  };
}
