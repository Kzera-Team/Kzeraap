import type { Repository } from '../ports/Repository';
import {
  statusRegistroPorPendencias,
  type PendenciaImportacao,
  type RegistroImportacaoFinanceira,
  type RegistroImportacaoTransacao,
  type TipoPendenciaImportacao
} from '../../domain/importacao/ImportacaoTransacoesFinanceiro';
import { motivoBloqueioAprovacaoMassa, type TipoAprovacaoMassaConciliacao } from './ConciliarTransacoesFinanceiroUseCase';

export type TipoRegistroResolucaoImportacao = 'transacao' | 'financeiro';
export type AcaoResolucaoImportacao = 'vincular_financeiro' | 'vincular_financeiro_em_massa' | 'desfazer_aprovacao_massa' | 'marcar_revisao' | 'ignorar';

export interface VinculoFinanceiroEmMassaInput {
  registroTransacaoId: string;
  registroFinanceiroId: string;
  tipoAprovacao?: TipoAprovacaoMassaConciliacao;
}

export interface ResolverPendenciaImportacaoInput {
  acao: AcaoResolucaoImportacao;
  tipo?: TipoRegistroResolucaoImportacao;
  registroId?: string;
  registroTransacaoId?: string;
  registroFinanceiroId?: string;
  motivo?: string;
  vinculos?: VinculoFinanceiroEmMassaInput[];
}

export interface ResolverPendenciaImportacaoResultado {
  mensagem: string;
  transacao?: RegistroImportacaoTransacao;
  financeiro?: RegistroImportacaoFinanceira;
}

function removerPendencias(pendencias: PendenciaImportacao[], tipos: TipoPendenciaImportacao[]): PendenciaImportacao[] {
  return pendencias.filter(pendencia => pendencia && !tipos.includes(pendencia.tipo));
}

function incluirRevisaoManual(pendencias: PendenciaImportacao[], motivo?: string): PendenciaImportacao[] {
  const restantes = removerPendencias(pendencias, ['financeiro_divergente', 'transacao_nao_encontrada']);
  return [
    ...restantes,
    {
      tipo: 'revisao_manual',
      campo: 'Conciliação',
      mensagem: motivo?.trim() || 'Registro separado para revisão manual antes da confirmação definitiva.'
    }
  ];
}

function statusAtualizado(pendencias: PendenciaImportacao[]): ReturnType<typeof statusRegistroPorPendencias> {
  return statusRegistroPorPendencias(pendencias);
}

function tipoAprovacaoDerivado(transacao: RegistroImportacaoTransacao, financeiro: RegistroImportacaoFinanceira, tipoInformado?: TipoAprovacaoMassaConciliacao): TipoAprovacaoMassaConciliacao {
  if (tipoInformado) return tipoInformado;
  const numeroTransacao = transacao.numeroOriginal || transacao.dadosNormalizados?.numero;
  const numeroFinanceiro = financeiro.numeroTransacaoReferenciado || financeiro.dadosNormalizados?.numeroTransacaoReferenciado;
  return numeroTransacao && numeroFinanceiro && numeroTransacao === numeroFinanceiro ? 'referencia' : 'pagamento_posterior';
}

interface ParValidadoEmMassa {
  transacaoOriginal: RegistroImportacaoTransacao;
  financeiroOriginal: RegistroImportacaoFinanceira;
  transacaoAtualizada: RegistroImportacaoTransacao;
  financeiroAtualizado: RegistroImportacaoFinanceira;
}

export class ResolverPendenciaImportacaoUseCase {
  constructor(
    private readonly transacoes: Repository<RegistroImportacaoTransacao>,
    private readonly financeiros: Repository<RegistroImportacaoFinanceira>,
    private readonly now: () => string
  ) {}

  async execute(input: ResolverPendenciaImportacaoInput): Promise<ResolverPendenciaImportacaoResultado> {
    if (input.acao === 'vincular_financeiro') return this.vincularFinanceiro(input);
    if (input.acao === 'vincular_financeiro_em_massa') return this.vincularFinanceiroEmMassa(input);
    if (input.acao === 'desfazer_aprovacao_massa') return this.desfazerAprovacaoMassa();
    if (input.acao === 'marcar_revisao') return this.marcarRevisao(input);
    if (input.acao === 'ignorar') return this.ignorar(input);
    throw new Error('Ação de resolução inválida.');
  }

  private montarAtualizacaoVinculo(
    transacao: RegistroImportacaoTransacao,
    financeiro: RegistroImportacaoFinanceira,
    resolucaoConciliacao: 'manual' | 'massa_segura'
  ): { transacaoAtualizada: RegistroImportacaoTransacao; financeiroAtualizado: RegistroImportacaoFinanceira } {
    const financeirosResolvidos = new Set(transacao.financeiroStagingIdsResolvidos || []);
    financeirosResolvidos.add(financeiro.id);
    const updatedAt = this.now();
    const pendenciasTransacao = removerPendencias(transacao.pendencias, ['financeiro_divergente', 'transacao_nao_encontrada']);
    const pendenciasFinanceiro = removerPendencias(financeiro.pendencias, ['transacao_nao_encontrada', 'financeiro_divergente']);
    const transacaoAtualizada: RegistroImportacaoTransacao = {
      ...transacao,
      financeiroStagingIdsResolvidos: Array.from(financeirosResolvidos),
      resolucaoConciliacao,
      pendencias: pendenciasTransacao,
      status: statusAtualizado(pendenciasTransacao),
      updatedAt
    };
    const financeiroAtualizado: RegistroImportacaoFinanceira = {
      ...financeiro,
      transacaoStagingIdResolvida: transacao.id,
      resolucaoConciliacao,
      pendencias: pendenciasFinanceiro,
      status: statusAtualizado(pendenciasFinanceiro),
      updatedAt
    };
    return { transacaoAtualizada, financeiroAtualizado };
  }

  private async vincularFinanceiro(input: ResolverPendenciaImportacaoInput): Promise<ResolverPendenciaImportacaoResultado> {
    if (!input.registroTransacaoId || !input.registroFinanceiroId) throw new Error('Selecione a transação e a movimentação para vincular.');
    const transacao = await this.transacoes.getById(input.registroTransacaoId);
    const financeiro = await this.financeiros.getById(input.registroFinanceiroId);
    if (!transacao || !financeiro) throw new Error('Registro de importação não encontrado.');
    const { transacaoAtualizada, financeiroAtualizado } = this.montarAtualizacaoVinculo(transacao, financeiro, 'manual');
    await this.transacoes.save(transacaoAtualizada);
    await this.financeiros.save(financeiroAtualizado);
    return { mensagem: 'Vínculo financeiro salvo no staging.', transacao: transacaoAtualizada, financeiro: financeiroAtualizado };
  }

  private async validarVinculosEmMassa(vinculos: VinculoFinanceiroEmMassaInput[]): Promise<ParValidadoEmMassa[]> {
    const pares: ParValidadoEmMassa[] = [];
    const transacoesUsadas = new Set<string>();
    const financeirosUsados = new Set<string>();
    for (const vinculo of vinculos) {
      if (!vinculo.registroTransacaoId || !vinculo.registroFinanceiroId) throw new Error('Aprovação em massa recebeu vínculo incompleto.');
      if (transacoesUsadas.has(vinculo.registroTransacaoId)) throw new Error('Aprovação em massa bloqueada: transação repetida na seleção.');
      if (financeirosUsados.has(vinculo.registroFinanceiroId)) throw new Error('Aprovação em massa bloqueada: movimentação repetida na seleção.');
      transacoesUsadas.add(vinculo.registroTransacaoId);
      financeirosUsados.add(vinculo.registroFinanceiroId);
      const transacao = await this.transacoes.getById(vinculo.registroTransacaoId);
      const financeiro = await this.financeiros.getById(vinculo.registroFinanceiroId);
      if (!transacao || !financeiro) throw new Error('Aprovação em massa bloqueada: registro de staging não encontrado.');
      const tipoAprovacao = tipoAprovacaoDerivado(transacao, financeiro, vinculo.tipoAprovacao);
      const bloqueio = motivoBloqueioAprovacaoMassa(transacao, financeiro, tipoAprovacao);
      if (bloqueio) throw new Error(`Aprovação em massa bloqueada na linha ${transacao.linha}: ${bloqueio}`);
      const { transacaoAtualizada, financeiroAtualizado } = this.montarAtualizacaoVinculo(transacao, financeiro, 'massa_segura');
      pares.push({ transacaoOriginal: transacao, financeiroOriginal: financeiro, transacaoAtualizada, financeiroAtualizado });
    }
    return pares;
  }

  private async vincularFinanceiroEmMassa(input: ResolverPendenciaImportacaoInput): Promise<ResolverPendenciaImportacaoResultado> {
    const vinculos = input.vinculos || [];
    if (!vinculos.length) throw new Error('Nenhum vínculo seguro selecionado para aprovação em massa.');
    const pares = await this.validarVinculosEmMassa(vinculos);
    const salvos: ParValidadoEmMassa[] = [];
    try {
      for (const par of pares) {
        await this.transacoes.save(par.transacaoAtualizada);
        await this.financeiros.save(par.financeiroAtualizado);
        salvos.push(par);
      }
    } catch (error) {
      for (const par of salvos.reverse()) {
        await this.transacoes.save(par.transacaoOriginal);
        await this.financeiros.save(par.financeiroOriginal);
      }
      throw error;
    }
    return { mensagem: `${pares.length} vínculos seguros aprovados em massa.` };
  }

  private async desfazerAprovacaoMassa(): Promise<ResolverPendenciaImportacaoResultado> {
    const transacoes = await this.transacoes.list();
    const financeiros = await this.financeiros.list();
    const atualizadas = transacoes.filter(registro => registro.resolucaoConciliacao === 'massa_segura');
    const financeirosAtualizados = financeiros.filter(registro => registro.resolucaoConciliacao === 'massa_segura');
    const updatedAt = this.now();
    for (const transacao of atualizadas) {
      const atualizado: RegistroImportacaoTransacao = {
        ...transacao,
        financeiroStagingIdsResolvidos: [],
        updatedAt
      };
      delete atualizado.resolucaoConciliacao;
      await this.transacoes.save(atualizado);
    }
    for (const financeiro of financeirosAtualizados) {
      const atualizado: RegistroImportacaoFinanceira = {
        ...financeiro,
        updatedAt
      };
      delete atualizado.transacaoStagingIdResolvida;
      delete atualizado.resolucaoConciliacao;
      await this.financeiros.save(atualizado);
    }
    return { mensagem: `${atualizadas.length} aprovações em massa desfeitas no staging.` };
  }

  private async marcarRevisao(input: ResolverPendenciaImportacaoInput): Promise<ResolverPendenciaImportacaoResultado> {
    if (!input.tipo || !input.registroId) throw new Error('Selecione o registro para revisão.');
    const updatedAt = this.now();
    if (input.tipo === 'transacao') {
      const registro = await this.transacoes.getById(input.registroId);
      if (!registro) throw new Error('Transação em staging não encontrada.');
      const atualizado: RegistroImportacaoTransacao = { ...registro, pendencias: incluirRevisaoManual(registro.pendencias, input.motivo), status: 'erro', updatedAt };
      await this.transacoes.save(atualizado);
      return { mensagem: 'Transação marcada para revisão manual.', transacao: atualizado };
    }
    const registro = await this.financeiros.getById(input.registroId);
    if (!registro) throw new Error('Movimentação em staging não encontrada.');
    const atualizado: RegistroImportacaoFinanceira = { ...registro, pendencias: incluirRevisaoManual(registro.pendencias, input.motivo), status: 'erro', updatedAt };
    await this.financeiros.save(atualizado);
    return { mensagem: 'Movimentação marcada para revisão manual.', financeiro: atualizado };
  }

  private async ignorar(input: ResolverPendenciaImportacaoInput): Promise<ResolverPendenciaImportacaoResultado> {
    if (!input.tipo || !input.registroId) throw new Error('Selecione o registro para ignorar.');
    const updatedAt = this.now();
    if (input.tipo === 'transacao') {
      const registro = await this.transacoes.getById(input.registroId);
      if (!registro) throw new Error('Transação em staging não encontrada.');
      const atualizado: RegistroImportacaoTransacao = { ...registro, status: 'ignorado', updatedAt };
      await this.transacoes.save(atualizado);
      return { mensagem: 'Transação ignorada no staging.', transacao: atualizado };
    }
    const registro = await this.financeiros.getById(input.registroId);
    if (!registro) throw new Error('Movimentação em staging não encontrada.');
    const atualizado: RegistroImportacaoFinanceira = { ...registro, status: 'ignorado', updatedAt };
    await this.financeiros.save(atualizado);
    return { mensagem: 'Movimentação ignorada no staging.', financeiro: atualizado };
  }
}
