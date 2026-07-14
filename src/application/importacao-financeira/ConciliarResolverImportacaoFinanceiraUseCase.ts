import type { Clock } from '../../core/Clock';
import { conciliarRegistro, type SugestaoConciliacaoImportacao } from '../../domain/importacao-financeira/ConciliacaoImportacaoFinanceira';
import {
  ImportacaoFinanceiraError,
  type EscopoImportacaoFinanceira,
  type PendenciaImportacaoFinanceira,
  type RegistroImportacaoFinanceira
} from '../../domain/importacao-financeira/ImportacaoFinanceira';
import { exigirPertencimento } from '../../domain/importacao-financeira/ImportacaoFinanceiraInvariants';
import type { ImportacaoFinanceiraStore } from './ImportacaoFinanceiraPorts';

export class ConciliarImportacaoFinanceiraUseCase {
  constructor(private readonly store: ImportacaoFinanceiraStore, private readonly clock: Clock, private readonly idFactory: (prefix: string) => string) {}

  async execute(scope: EscopoImportacaoFinanceira): Promise<SugestaoConciliacaoImportacao[]> {
    const registros = await this.store.listRegistros(scope);
    const transacoes = registros.filter(item => item.tipo === 'transacao' && item.status !== 'ignorado');
    const financeiros = registros.filter(item => item.tipo === 'financeiro' && item.status !== 'ignorado');
    const suggestions = transacoes.map(item => conciliarRegistro(item, financeiros));
    const now = this.clock.now().toISOString();
    for (const suggestion of suggestions) {
      await this.store.appendAuditoria({ id: this.idFactory('audit-importacao'), ...scope, operacao: 'conciliacao', registroId: suggestion.registroTransacaoId, depois: suggestion, createdAt: now, updatedAt: now });
    }
    return suggestions;
  }
}

export type AcaoResolucaoPendencia = 'vincular' | 'marcar_revisao' | 'ignorar' | 'retry';

export interface ResolverPendenciaInput extends EscopoImportacaoFinanceira {
  acao: AcaoResolucaoPendencia;
  registroId: string;
  registroFinanceiroId?: string;
  motivo?: string;
}

function withoutFinancialPendencies(pendencias: PendenciaImportacaoFinanceira[]): PendenciaImportacaoFinanceira[] {
  return pendencias.filter(item => !['transacao_nao_encontrada', 'divergencia_valor', 'divergencia_perfil', 'divergencia_pagamento', 'revisao_manual'].includes(item.codigo));
}

export class ResolverPendenciaImportacaoFinanceiraUseCase {
  constructor(private readonly store: ImportacaoFinanceiraStore, private readonly clock: Clock, private readonly idFactory: (prefix: string) => string) {}

  async execute(input: ResolverPendenciaInput): Promise<RegistroImportacaoFinanceira> {
    const scope = { usuarioId: input.usuarioId, loteId: input.loteId };
    const registro = await this.store.getRegistro(scope, input.registroId);
    if (!registro) throw new ImportacaoFinanceiraError('REGISTRO_NAO_ENCONTRADO', 'Registro não encontrado no escopo informado.');
    exigirPertencimento(registro, scope);
    const before = structuredClone(registro);
    const now = this.clock.now().toISOString();
    let updated: RegistroImportacaoFinanceira;

    if (input.acao === 'ignorar') updated = { ...registro, status: 'ignorado', updatedAt: now };
    else if (input.acao === 'marcar_revisao') updated = { ...registro, status: 'erro', pendencias: [...withoutFinancialPendencies(registro.pendencias), { codigo: 'revisao_manual', mensagem: input.motivo?.trim() || 'Revisão manual obrigatória.' }], updatedAt: now };
    else if (input.acao === 'retry') {
      updated = { ...registro, status: registro.pendencias.length ? 'pendente' : 'validado', updatedAt: now };
      delete updated.ultimaFalha;
    }
    else {
      if (registro.tipo !== 'transacao' || !input.registroFinanceiroId) throw new ImportacaoFinanceiraError('VINCULO_INVALIDO', 'Vínculo exige transação e movimentação financeira.');
      const financeiro = await this.store.getRegistro(scope, input.registroFinanceiroId);
      if (!financeiro || financeiro.tipo !== 'financeiro') throw new ImportacaoFinanceiraError('FINANCEIRO_NAO_ENCONTRADO', 'Movimentação financeira não encontrada no lote.');
      exigirPertencimento(financeiro, scope);
      const suggestion = conciliarRegistro(registro, [financeiro]);
      if (!suggestion.segura) throw new ImportacaoFinanceiraError('VINCULO_INSEGURO', suggestion.pendencias.map(item => item.mensagem).join(' '));
      updated = { ...registro, registrosFinanceirosVinculadosIds: [financeiro.id], resolucao: 'manual', pendencias: withoutFinancialPendencies(registro.pendencias), status: withoutFinancialPendencies(registro.pendencias).length ? 'pendente' : 'validado', updatedAt: now };
      await this.store.saveRegistro({ ...financeiro, registroTransacaoVinculadoId: registro.id, resolucao: 'manual', pendencias: withoutFinancialPendencies(financeiro.pendencias), status: withoutFinancialPendencies(financeiro.pendencias).length ? 'pendente' : 'validado', updatedAt: now });
    }

    const saved = await this.store.saveRegistro(updated);
    await this.store.appendAuditoria({ id: this.idFactory('audit-importacao'), ...scope, operacao: input.acao === 'retry' ? 'retry' : 'resolucao', registroId: saved.id, antes: before, depois: saved, createdAt: now, updatedAt: now });
    return saved;
  }
}
