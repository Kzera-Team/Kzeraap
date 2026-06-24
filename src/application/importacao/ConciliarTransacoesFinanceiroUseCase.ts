import type { Repository } from '../ports/Repository';
import { arredondarDinheiro, type TipoPagamentoTransacao } from '../../domain/financeiro/Financeiro';
import {
  normalizarTextoBusca,
  type PendenciaImportacao,
  type RegistroImportacaoFinanceira,
  type RegistroImportacaoTransacao
} from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

export type StatusConciliacaoImportacao =
  | 'conciliado'
  | 'pendente_sem_financeiro'
  | 'pendente_sem_transacao'
  | 'divergencia_valor'
  | 'divergencia_perfil'
  | 'divergencia_pagamento'
  | 'pagamento_posterior_provavel'
  | 'revisao_manual';

export type ConfiancaConciliacao = 'alta' | 'media' | 'baixa';

export interface ItemConciliacaoImportacao {
  id: string;
  numeroTransacao?: string | undefined;
  registroTransacaoId?: string | undefined;
  registroFinanceiroIds: string[];
  status: StatusConciliacaoImportacao;
  confianca: ConfiancaConciliacao;
  totalTransacao?: number | undefined;
  valorPagoTransacao?: number | undefined;
  valorPendenteTransacao?: number | undefined;
  valorFinanceiro?: number | undefined;
  diferenca?: number | undefined;
  sugestao?: string | undefined;
  aprovavelEmMassa?: boolean | undefined;
  bloqueioAprovacaoMassa?: string | undefined;
  tipoAprovacaoMassa?: TipoAprovacaoMassaConciliacao | undefined;
  detalhes: string[];
}

export interface ResumoConciliacaoImportacao {
  totalTransacoes: number;
  totalMovimentos: number;
  conciliados: number;
  pendentes: number;
  divergencias: number;
  sugestoesPagamentoPosterior: number;
  movimentosSemTransacao: number;
  aprovaveisEmMassa: number;
  bloqueadosAprovacaoMassa: number;
  aprovadosEmMassa: number;
}

export interface ResultadoConciliacaoImportacao {
  resumo: ResumoConciliacaoImportacao;
  itens: ItemConciliacaoImportacao[];
}

function quaseIgual(a: number, b: number): boolean {
  return Math.abs(arredondarDinheiro(a - b)) <= 0.01;
}

function dataMs(data?: string): number {
  if (!data) return 0;
  const br = data.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (br) {
    const [, dd, mm, yyyy, hh = '0', min = '0', ss = '0'] = br;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), Number(ss)).getTime();
  }
  const parsed = Date.parse(data);
  return Number.isFinite(parsed) ? parsed : 0;
}

function nomesCompativeis(transacao: RegistroImportacaoTransacao, financeiro: RegistroImportacaoFinanceira): boolean {
  if (transacao.perfilIdResolvido && financeiro.perfilIdResolvido) return transacao.perfilIdResolvido === financeiro.perfilIdResolvido;
  const a = transacao.dadosNormalizados?.clienteNome || transacao.clienteNomeImportado || '';
  const b = financeiro.dadosNormalizados?.clienteNome || financeiro.clienteNomeImportado || '';
  return Boolean(a && b && normalizarTextoBusca(a) === normalizarTextoBusca(b));
}

function pagamentoCompativel(tipos: TipoPagamentoTransacao[] | undefined, financeiro: RegistroImportacaoFinanceira): boolean {
  const metodo = financeiro.dadosNormalizados?.metodoPagamento;
  if (!metodo || !tipos?.length) return true;
  return tipos.includes(metodo) || tipos.includes('outro') || metodo === 'outro';
}

function somaFinanceiros(registros: RegistroImportacaoFinanceira[]): number {
  return arredondarDinheiro(registros.reduce((total, registro) => total + (registro.dadosNormalizados?.valorPago ?? 0), 0));
}

function pendenciaBloqueante(pendencia: PendenciaImportacao): boolean {
  return !['financeiro_divergente', 'transacao_nao_encontrada'].includes(pendencia?.tipo);
}

export type TipoAprovacaoMassaConciliacao = 'referencia' | 'pagamento_posterior';

export function motivoBloqueioAprovacaoMassa(
  transacao: RegistroImportacaoTransacao,
  financeiro: RegistroImportacaoFinanceira,
  tipo: TipoAprovacaoMassaConciliacao
): string | undefined {
  if (transacao.status === 'ignorado' || transacao.status === 'confirmado') return 'Transação não está aberta no staging.';
  if (financeiro.status === 'ignorado' || financeiro.status === 'confirmado') return 'Movimentação não está aberta no staging.';
  if (!transacao.dadosNormalizados) return 'Transação incompleta.';
  if (!financeiro.dadosNormalizados) return 'Movimentação financeira incompleta.';
  if (transacao.pendencias.some(pendenciaBloqueante)) return 'Transação tem pendência não financeira.';
  if (financeiro.pendencias.some(pendenciaBloqueante)) return 'Movimentação tem pendência não financeira.';
  if (financeiro.transacaoStagingIdResolvida && financeiro.transacaoStagingIdResolvida !== transacao.id) return 'Movimentação já está vinculada a outra transação.';
  const idsResolvidos = transacao.financeiroStagingIdsResolvidos || [];
  if (idsResolvidos.length && !idsResolvidos.includes(financeiro.id)) return 'Transação já está vinculada a outra movimentação.';
  const numeroTransacao = transacao.numeroOriginal || transacao.dadosNormalizados.numero;
  const numeroFinanceiro = financeiro.numeroTransacaoReferenciado || financeiro.dadosNormalizados.numeroTransacaoReferenciado;
  if (tipo === 'referencia' && (!numeroTransacao || !numeroFinanceiro || numeroTransacao !== numeroFinanceiro)) return 'Referência da transação não bate.';
  if (tipo === 'pagamento_posterior' && numeroFinanceiro) return 'Pagamento posterior provável não deve ter referência direta.';
  if (!nomesCompativeis(transacao, financeiro)) return 'Perfil/comprador não bate.';
  if (!pagamentoCompativel(transacao.dadosNormalizados.tiposPagamento, financeiro)) return 'Método de pagamento não bate.';
  if (!financeiro.dadosNormalizados.pago) return 'Movimentação ainda não está paga.';
  if (financeiro.dadosNormalizados.valorPago <= 0) return 'Movimentação sem valor pago válido.';
  const total = transacao.dadosNormalizados.total;
  const valorPago = transacao.dadosNormalizados.valorPago;
  const pendente = arredondarDinheiro(Math.max(0, total - valorPago));
  const esperado = tipo === 'referencia' ? (valorPago || total) : pendente;
  if (esperado <= 0) return 'Não há valor seguro para aprovar.';
  if (!quaseIgual(financeiro.dadosNormalizados.valorPago, esperado)) return 'Valor não bate com o esperado.';
  const dataTransacao = dataMs(transacao.dadosNormalizados.dataTransacao);
  const dataPagamento = dataMs(financeiro.dadosNormalizados.dataPagamento || financeiro.dadosNormalizados.dataCriacao);
  if (tipo === 'pagamento_posterior' && dataTransacao && dataPagamento && dataPagamento < dataTransacao) return 'Pagamento aparece antes da transação.';
  return undefined;
}

function bloqueioAprovacaoMassa(
  transacao: RegistroImportacaoTransacao,
  financeiros: RegistroImportacaoFinanceira[],
  tipo: TipoAprovacaoMassaConciliacao
): string | undefined {
  if (financeiros.length !== 1) return 'Precisa ter exatamente uma movimentação vinculada.';
  return motivoBloqueioAprovacaoMassa(transacao, financeiros[0]!, tipo);
}

function detalhesConciliacao(transacao: RegistroImportacaoTransacao | undefined, financeiros: RegistroImportacaoFinanceira[], status: StatusConciliacaoImportacao): string[] {
  const detalhes: string[] = [];
  if (transacao) {
    detalhes.push(`Transação staging: linha ${transacao.linha}${transacao.numeroOriginal ? `, número ${transacao.numeroOriginal}` : ''}.`);
    if (transacao.resolucaoConciliacao) detalhes.push(`Resolução: ${transacao.resolucaoConciliacao === 'massa_segura' ? 'aprovada em massa' : 'manual'}.`);
  }
  financeiros.forEach(financeiro => {
    const ref = financeiro.numeroTransacaoReferenciado || financeiro.dadosNormalizados?.numeroTransacaoReferenciado || 'sem referência';
    detalhes.push(`Movimento staging: linha ${financeiro.linha}, ref. ${ref}, valor ${financeiro.dadosNormalizados?.valorPago ?? '—'}.`);
  });
  detalhes.push(`Status calculado: ${status}.`);
  return detalhes;
}

export class ConciliarTransacoesFinanceiroUseCase {
  constructor(
    private readonly transacoes: Repository<RegistroImportacaoTransacao>,
    private readonly financeiros: Repository<RegistroImportacaoFinanceira>
  ) {}

  async execute(): Promise<ResultadoConciliacaoImportacao> {
    const transacoes = (await this.transacoes.list()).filter(registro => registro.status !== 'ignorado');
    const financeiros = (await this.financeiros.list()).filter(registro => registro.status !== 'ignorado');
    const financeirosPorReferencia = new Map<string, RegistroImportacaoFinanceira[]>();
    const usados = new Set<string>();
    const itens: ItemConciliacaoImportacao[] = [];

    financeiros.forEach(financeiro => {
      const numero = financeiro.numeroTransacaoReferenciado || financeiro.dadosNormalizados?.numeroTransacaoReferenciado;
      if (!numero) return;
      const lista = financeirosPorReferencia.get(numero) || [];
      lista.push(financeiro);
      financeirosPorReferencia.set(numero, lista);
    });

    for (const transacao of transacoes) {
      const dados = transacao.dadosNormalizados;
      const numero = transacao.numeroOriginal || dados?.numero;
      const relacionadosPorReferencia = numero ? (financeirosPorReferencia.get(numero) || []) : [];
      const idsResolvidos = new Set(transacao.financeiroStagingIdsResolvidos || []);
      const relacionadosManuais = financeiros.filter(financeiro => financeiro.transacaoStagingIdResolvida === transacao.id || idsResolvidos.has(financeiro.id));
      const relacionados = Array.from(new Map([...relacionadosPorReferencia, ...relacionadosManuais].map(financeiro => [financeiro.id, financeiro])).values());
      relacionados.forEach(financeiro => usados.add(financeiro.id));
      const valorFinanceiro = somaFinanceiros(relacionados);
      const total = dados?.total ?? 0;
      const valorPago = dados?.valorPago ?? 0;
      const pendente = arredondarDinheiro(Math.max(0, total - valorPago));

      if (relacionados.length) {
        const perfilOk = relacionados.every(financeiro => nomesCompativeis(transacao, financeiro));
        const pagamentoOk = relacionados.every(financeiro => pagamentoCompativel(dados?.tiposPagamento, financeiro));
        let status: StatusConciliacaoImportacao = 'conciliado';
        if (!perfilOk) status = 'divergencia_perfil';
        else if (!pagamentoOk) status = 'divergencia_pagamento';
        else if (!quaseIgual(valorFinanceiro, valorPago || total)) status = 'divergencia_valor';
        const bloqueio = status === 'conciliado' ? bloqueioAprovacaoMassa(transacao, relacionados, 'referencia') : 'Há divergência para revisão.';
        itens.push({
          id: `conc-${transacao.id}`,
          numeroTransacao: numero,
          registroTransacaoId: transacao.id,
          registroFinanceiroIds: relacionados.map(financeiro => financeiro.id),
          status,
          confianca: status === 'conciliado' && !bloqueio ? 'alta' : 'media',
          totalTransacao: total,
          valorPagoTransacao: valorPago,
          valorPendenteTransacao: pendente,
          valorFinanceiro,
          diferenca: arredondarDinheiro(valorFinanceiro - (valorPago || total)),
          sugestao: status === 'conciliado' && !bloqueio ? 'Referência, valor, perfil e pagamento seguros para aprovação em massa.' : 'Revisar diferença antes de confirmar.',
          aprovavelEmMassa: status === 'conciliado' && !bloqueio,
          bloqueioAprovacaoMassa: bloqueio,
          tipoAprovacaoMassa: 'referencia',
          detalhes: detalhesConciliacao(transacao, relacionados, status)
        });
        continue;
      }

      const candidatosPosteriores = pendente > 0 ? financeiros.filter(financeiro => {
        if (usados.has(financeiro.id)) return false;
        if (financeiro.numeroTransacaoReferenciado) return false;
        if (!financeiro.dadosNormalizados?.pago) return false;
        if (!quaseIgual(financeiro.dadosNormalizados.valorPago, pendente)) return false;
        if (!nomesCompativeis(transacao, financeiro)) return false;
        const dataTransacao = dataMs(dados?.dataTransacao);
        const dataPagamento = dataMs(financeiro.dadosNormalizados.dataPagamento || financeiro.dadosNormalizados.dataCriacao);
        return !dataTransacao || !dataPagamento || dataPagamento >= dataTransacao;
      }) : [];

      if (candidatosPosteriores.length === 1) {
        const financeiro = candidatosPosteriores[0]!;
        usados.add(financeiro.id);
        const bloqueio = bloqueioAprovacaoMassa(transacao, [financeiro], 'pagamento_posterior');
        itens.push({
          id: `conc-posterior-${transacao.id}`,
          numeroTransacao: numero,
          registroTransacaoId: transacao.id,
          registroFinanceiroIds: [financeiro.id],
          status: 'pagamento_posterior_provavel',
          confianca: bloqueio ? 'media' : 'alta',
          totalTransacao: total,
          valorPagoTransacao: valorPago,
          valorPendenteTransacao: pendente,
          valorFinanceiro: financeiro.dadosNormalizados?.valorPago,
          diferenca: arredondarDinheiro((financeiro.dadosNormalizados?.valorPago || 0) - pendente),
          sugestao: bloqueio ? `Conferir antes de aprovar: ${bloqueio}` : 'Pagamento posterior provável seguro para aprovação em massa.',
          aprovavelEmMassa: !bloqueio,
          bloqueioAprovacaoMassa: bloqueio,
          tipoAprovacaoMassa: 'pagamento_posterior',
          detalhes: detalhesConciliacao(transacao, [financeiro], 'pagamento_posterior_provavel')
        });
        continue;
      }

      itens.push({
        id: `conc-sem-fin-${transacao.id}`,
        numeroTransacao: numero,
        registroTransacaoId: transacao.id,
        registroFinanceiroIds: [],
        status: 'pendente_sem_financeiro',
        confianca: 'baixa',
        totalTransacao: total,
        valorPagoTransacao: valorPago,
        valorPendenteTransacao: pendente,
        sugestao: 'Sem movimentação financeira correspondente no staging.',
        aprovavelEmMassa: false,
        bloqueioAprovacaoMassa: candidatosPosteriores.length > 1 ? 'Mais de uma movimentação candidata.' : 'Sem movimentação candidata.',
        detalhes: detalhesConciliacao(transacao, [], 'pendente_sem_financeiro')
      });
    }

    financeiros.filter(financeiro => !usados.has(financeiro.id)).forEach(financeiro => {
      itens.push({
        id: `conc-sem-transacao-${financeiro.id}`,
        numeroTransacao: financeiro.numeroTransacaoReferenciado || financeiro.dadosNormalizados?.numeroTransacaoReferenciado,
        registroFinanceiroIds: [financeiro.id],
        status: 'pendente_sem_transacao',
        confianca: 'baixa',
        valorFinanceiro: financeiro.dadosNormalizados?.valorPago,
        sugestao: 'Movimentação financeira sem transação correspondente no staging.',
        aprovavelEmMassa: false,
        bloqueioAprovacaoMassa: 'Sem transação correspondente.',
        detalhes: detalhesConciliacao(undefined, [financeiro], 'pendente_sem_transacao')
      });
    });

    const resumo: ResumoConciliacaoImportacao = {
      totalTransacoes: transacoes.length,
      totalMovimentos: financeiros.length,
      conciliados: itens.filter(item => item.status === 'conciliado').length,
      pendentes: itens.filter(item => item.status.startsWith('pendente')).length,
      divergencias: itens.filter(item => item.status.startsWith('divergencia')).length,
      sugestoesPagamentoPosterior: itens.filter(item => item.status === 'pagamento_posterior_provavel').length,
      movimentosSemTransacao: itens.filter(item => item.status === 'pendente_sem_transacao').length,
      aprovaveisEmMassa: itens.filter(item => item.aprovavelEmMassa).length,
      bloqueadosAprovacaoMassa: itens.filter(item => (item.status === 'pagamento_posterior_provavel' || item.status === 'conciliado') && !item.aprovavelEmMassa).length,
      aprovadosEmMassa: transacoes.filter(item => item.resolucaoConciliacao === 'massa_segura').length
    };
    return { resumo, itens };
  }
}
