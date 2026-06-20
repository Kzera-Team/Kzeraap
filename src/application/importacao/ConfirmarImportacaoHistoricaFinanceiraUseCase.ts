import type { Clock } from '../../core/Clock';
import type { Repository } from '../ports/Repository';
import {
  arredondarDinheiro,
  criarMovimentoFinanceiro,
  criarPagamentoTransacao,
  criarTransacaoFinanceira,
  type MovimentoFinanceiro,
  type PagamentoTransacao,
  type TipoPagamentoTransacao,
  type TransacaoFinanceira
} from '../../domain/financeiro/Financeiro';
import type {
  ArtefatosPacoteConfirmacaoHistorica,
  ItemPacoteConfirmacaoHistorica,
  PacoteConfirmacaoHistorica,
  RegistroImportacaoFinanceira,
  RegistroImportacaoTransacao
} from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

export interface ConfirmarImportacaoHistoricaFinanceiraInput {
  modo: 'previsualizar' | 'confirmar' | 'desfazer_lote' | 'recuperar_falha' | 'listar_lotes';
  previaId?: string;
  loteConfirmacaoId?: string;
  confirmacaoDesfazerTexto?: string;
}

export interface LoteConfirmacaoHistoricaResumo {
  previaId: string;
  loteConfirmacaoId: string;
  status: string;
  totalTransacoes: number;
  faturamentoTotal: number;
  custoTotal: number;
  lucroTotal: number;
  confirmadoEm?: string;
  falhaMensagem?: string;
}

export interface ConfirmarImportacaoHistoricaFinanceiraResultado {
  modo: 'previsualizar' | 'confirmar' | 'desfazer_lote' | 'recuperar_falha' | 'listar_lotes';
  previaId: string;
  loteConfirmacaoId?: string;
  pacoteStatus?: string;
  transacoesCriadas: number;
  pagamentosCriados: number;
  movimentosCriados: number;
  transacoesDesfeitas?: number;
  pagamentosDesfeitos?: number;
  movimentosDesfeitos?: number;
  registrosIgnorados: number;
  registrosBloqueados: number;
  faturamentoTotal: number;
  custoTotal: number;
  lucroTotal: number;
  valorPagoTotal: number;
  valorPendenteTotal: number;
  primeiraData?: string;
  ultimaData?: string;
  avisos: string[];
  bloqueios: string[];
  bloqueiosExportacao: string;
  transacoesPrevistas: number;
  pagamentosPrevistos: number;
  movimentosPrevistos: number;
  pacotesConfirmados: LoteConfirmacaoHistoricaResumo[];
  pacotesComFalha: LoteConfirmacaoHistoricaResumo[];
}

interface ConfirmacaoPlanejada {
  staging: RegistroImportacaoTransacao;
  financeiros: RegistroImportacaoFinanceira[];
  assinatura: string;
}

interface ConfirmacaoPlano {
  previaId: string;
  loteConfirmacaoId: string;
  assinaturaPacote: string;
  planejadas: ConfirmacaoPlanejada[];
  registrosIgnorados: number;
  registrosBloqueados: number;
  faturamentoTotal: number;
  custoTotal: number;
  lucroTotal: number;
  valorPagoTotal: number;
  valorPendenteTotal: number;
  primeiraData?: string;
  ultimaData?: string;
  avisos: string[];
  bloqueios: string[];
  pagamentosPrevistos: number;
  movimentosPrevistos: number;
}

function dataOrdenavel(valor?: string): string | undefined {
  if (!valor?.trim()) return undefined;
  const raw = valor.trim();
  const matchPt = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (matchPt) return `${matchPt[3]!}-${matchPt[2]!.padStart(2, '0')}-${matchPt[1]!.padStart(2, '0')}`;
  const matchIso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (matchIso) return `${matchIso[1]!}-${matchIso[2]!.padStart(2, '0')}-${matchIso[3]!.padStart(2, '0')}`;
  return raw;
}

function statusPagamentoPorValor(valor: number, total: number): 'pendente' | 'parcial' | 'pago' {
  if (valor <= 0) return 'pendente';
  if (valor + 0.009 >= total) return 'pago';
  return 'parcial';
}

function tipoPagamentoPrincipal(tipos: TipoPagamentoTransacao[] | undefined): TipoPagamentoTransacao {
  return tipos?.find(tipo => tipo !== 'pendente') || tipos?.[0] || 'outro';
}

function textoNormalizado(valor?: string): string {
  return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function assinaturaTransacao(input: {
  numeroOrigem?: string;
  clienteNome: string;
  dataTransacao: string;
  total: number;
  valorPago: number;
  custo: number;
  lucro: number;
  origem?: string;
}): string {
  if (input.numeroOrigem?.trim()) return `numero:${input.numeroOrigem.trim()}`;
  return [
    'sem-numero',
    textoNormalizado(input.clienteNome),
    dataOrdenavel(input.dataTransacao) || input.dataTransacao,
    arredondarDinheiro(input.total).toFixed(2),
    arredondarDinheiro(input.valorPago).toFixed(2),
    arredondarDinheiro(input.custo).toFixed(2),
    arredondarDinheiro(input.lucro).toFixed(2),
    input.origem || 'importado_csv'
  ].join('|');
}

function hashCurto(texto: string): string {
  let hash = 0;
  for (let i = 0; i < texto.length; i += 1) hash = ((hash << 5) - hash + texto.charCodeAt(i)) | 0;
  return Math.abs(hash).toString(36);
}

function financeiroEstaApto(financeiro: RegistroImportacaoFinanceira): boolean {
  return Boolean(financeiro.dadosNormalizados && !financeiro.pendencias.length && financeiro.status !== 'ignorado' && financeiro.status !== 'erro' && !financeiro.movimentoFinanceiroId);
}

function bloqueiosExportacaoTexto(bloqueios: string[]): string {
  if (!bloqueios.length) return 'Nenhum bloqueio.';
  return ['linha;problema', ...bloqueios.map(item => {
    const linha = item.match(/Linha\s+(\d+)/i)?.[1] || '';
    const problema = item.replace(/;/g, ',');
    return `${linha};${problema}`;
  })].join('\n');
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj).sort().map(key => `${JSON.stringify(key)}:${stableStringify(obj[key])}`).join(',')}}`;
}

function assinaturaPacoteDeItens(itens: ItemPacoteConfirmacaoHistorica[]): string {
  return hashCurto(stableStringify(itens.map(item => ({
    registroTransacaoId: item.registroTransacaoId,
    linha: item.linha,
    assinatura: item.assinatura,
    stagingSnapshot: item.stagingSnapshot,
    financeirosSnapshot: item.financeirosSnapshot
  })).sort((a, b) => `${a.registroTransacaoId}:${a.linha}`.localeCompare(`${b.registroTransacaoId}:${b.linha}`))));
}

function cloneArtefatos(): ArtefatosPacoteConfirmacaoHistorica {
  return { transacaoIds: [], pagamentoIds: [], movimentoIds: [] };
}



function assinaturaTransacaoOficial(transacao: TransacaoFinanceira): string {
  const inputAssinatura: {
    numeroOrigem?: string;
    clienteNome: string;
    dataTransacao: string;
    total: number;
    valorPago: number;
    custo: number;
    lucro: number;
    origem?: string;
  } = {
    clienteNome: transacao.clienteNome,
    dataTransacao: transacao.dataTransacao,
    total: transacao.total,
    valorPago: transacao.valorPago,
    custo: transacao.custo,
    lucro: transacao.lucro,
    origem: transacao.origem
  };
  if (transacao.numeroOrigem) inputAssinatura.numeroOrigem = transacao.numeroOrigem;
  return transacao.assinaturaImportacao || assinaturaTransacao(inputAssinatura);
}

function snapshotTransacaoComparavel(registro: RegistroImportacaoTransacao): string {
  const clone = structuredClone(registro) as Partial<RegistroImportacaoTransacao>;
  delete clone.confirmacaoPreviaId;
  delete clone.confirmacaoAssinatura;
  delete clone.updatedAt;
  return stableStringify(clone);
}

function snapshotFinanceiroComparavel(registro: RegistroImportacaoFinanceira): string {
  const clone = structuredClone(registro) as Partial<RegistroImportacaoFinanceira>;
  delete clone.confirmacaoPreviaId;
  delete clone.updatedAt;
  return stableStringify(clone);
}

function loteResumo(pacote: PacoteConfirmacaoHistorica): LoteConfirmacaoHistoricaResumo {
  const resumo: LoteConfirmacaoHistoricaResumo = {
    previaId: pacote.previaId,
    loteConfirmacaoId: pacote.loteConfirmacaoId,
    status: pacote.status,
    totalTransacoes: pacote.totalTransacoes,
    faturamentoTotal: pacote.faturamentoTotal,
    custoTotal: pacote.custoTotal,
    lucroTotal: pacote.lucroTotal
  };
  if (pacote.confirmadoEm) resumo.confirmadoEm = pacote.confirmadoEm;
  if (pacote.falhaMensagem) resumo.falhaMensagem = pacote.falhaMensagem;
  return resumo;
}

export class ConfirmarImportacaoHistoricaFinanceiraUseCase {
  private readonly pacotesMemoria = new Map<string, PacoteConfirmacaoHistorica>();

  constructor(
    private readonly stagingTransacoes: Repository<RegistroImportacaoTransacao>,
    private readonly stagingFinanceiros: Repository<RegistroImportacaoFinanceira>,
    private readonly transacoesFinanceiras: Repository<TransacaoFinanceira>,
    private readonly pagamentos: Repository<PagamentoTransacao>,
    private readonly movimentos: Repository<MovimentoFinanceiro>,
    private readonly clock: Clock,
    private readonly idFactory: (prefix: string) => string,
    private readonly pacotesConfirmacao?: Repository<PacoteConfirmacaoHistorica>
  ) {}

  private exigirRemocaoSegura(): void {
    if (!this.transacoesFinanceiras.remove || !this.pagamentos.remove || !this.movimentos.remove) {
      throw new Error('Confirmação histórica bloqueada: repositórios oficiais precisam permitir remoção para rollback/desfazer lote.');
    }
  }

  private async salvarPacote(pacote: PacoteConfirmacaoHistorica): Promise<PacoteConfirmacaoHistorica> {
    if (this.pacotesConfirmacao) return this.pacotesConfirmacao.save(pacote);
    this.pacotesMemoria.set(pacote.id, structuredClone(pacote));
    return structuredClone(pacote);
  }

  private async listarPacotes(): Promise<PacoteConfirmacaoHistorica[]> {
    if (this.pacotesConfirmacao) return this.pacotesConfirmacao.list();
    return Array.from(this.pacotesMemoria.values()).map(item => structuredClone(item));
  }

  private async buscarPacotePorPrevia(previaId: string): Promise<PacoteConfirmacaoHistorica | null> {
    if (this.pacotesConfirmacao) return this.pacotesConfirmacao.getById(previaId);
    const pacote = this.pacotesMemoria.get(previaId);
    return pacote ? structuredClone(pacote) : null;
  }

  private async buscarPacotePorLote(loteConfirmacaoId: string): Promise<PacoteConfirmacaoHistorica | null> {
    const pacotes = await this.listarPacotes();
    return pacotes.find(pacote => pacote.loteConfirmacaoId === loteConfirmacaoId) || null;
  }

  private async resumosPacotes(): Promise<{ confirmados: LoteConfirmacaoHistoricaResumo[]; falhas: LoteConfirmacaoHistoricaResumo[] }> {
    const pacotes = await this.listarPacotes();
    return {
      confirmados: pacotes.filter(pacote => pacote.status === 'confirmado').sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(loteResumo),
      falhas: pacotes.filter(pacote => pacote.status === 'falha_confirmacao' || pacote.status === 'confirmando').sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(loteResumo)
    };
  }

  private async montarPlano(): Promise<ConfirmacaoPlano> {
    const transacoes = await this.stagingTransacoes.list();
    const financeiros = await this.stagingFinanceiros.list();
    const financeirosPorId = new Map(financeiros.map(registro => [registro.id, registro]));
    const existentes = await this.transacoesFinanceiras.list();
    const assinaturasJaConfirmadas = new Set(existentes.map(assinaturaTransacaoOficial));
    const assinaturasNoPlano = new Set<string>();
    const financeirosNoPlano = new Set<string>();
    const avisos: string[] = [];
    const bloqueios: string[] = [];
    let registrosBloqueados = 0;
    let registrosIgnorados = 0;
    let pagamentosPrevistos = 0;
    let movimentosPrevistos = 0;
    let faturamentoTotal = 0;
    let custoTotal = 0;
    let lucroTotal = 0;
    let valorPagoTotal = 0;
    let valorPendenteTotal = 0;
    const datas: string[] = [];
    const planejadas: ConfirmacaoPlanejada[] = [];

    for (const registro of transacoes) {
      if (registro.status === 'ignorado') { registrosIgnorados += 1; continue; }
      if (registro.status === 'confirmado' || registro.transacaoFinanceiraId) { registrosIgnorados += 1; continue; }
      if (!registro.dadosNormalizados) { registrosBloqueados += 1; bloqueios.push(`Linha ${registro.linha}: sem dados normalizados.`); continue; }
      if (registro.pendencias.length || registro.status !== 'validado') { registrosBloqueados += 1; bloqueios.push(`Linha ${registro.linha}: pendências abertas ou status não validado.`); continue; }

      const dados = registro.dadosNormalizados;
      const assinaturaInput: {
        numeroOrigem?: string;
        clienteNome: string;
        dataTransacao: string;
        total: number;
        valorPago: number;
        custo: number;
        lucro: number;
        origem?: string;
      } = {
        clienteNome: dados.clienteNome || registro.clienteNomeImportado || 'Comprador importado',
        dataTransacao: dados.dataTransacao || dados.dataPagamento || '',
        total: dados.total,
        valorPago: dados.valorPago,
        custo: dados.custo,
        lucro: dados.lucro,
        origem: 'importado_csv'
      };
      const numeroOrigem = registro.numeroOriginal || dados.numero;
      if (numeroOrigem) assinaturaInput.numeroOrigem = numeroOrigem;
      const assinatura = assinaturaTransacao(assinaturaInput);
      if (assinaturasJaConfirmadas.has(assinatura)) { registrosIgnorados += 1; continue; }
      if (assinaturasNoPlano.has(assinatura)) {
        registrosBloqueados += 1;
        bloqueios.push(`Linha ${registro.linha}: duplicidade interna no próprio pacote de confirmação.`);
        continue;
      }

      const idsFinanceiros = registro.financeiroStagingIdsResolvidos || [];
      const financeirosResolvidos = idsFinanceiros.map(id => financeirosPorId.get(id)).filter(Boolean) as RegistroImportacaoFinanceira[];
      const financeiroRepetido = financeirosResolvidos.find(financeiro => financeirosNoPlano.has(financeiro.id));
      if (financeiroRepetido) {
        registrosBloqueados += 1;
        bloqueios.push(`Linha ${registro.linha}: movimentação financeira ${financeiroRepetido.id} já está vinculada em outro registro deste pacote.`);
        continue;
      }
      const valorPago = arredondarDinheiro(dados.valorPago);
      if (valorPago > 0 && !financeirosResolvidos.length) {
        registrosBloqueados += 1;
        bloqueios.push(`Linha ${registro.linha}: tem valor pago, mas não tem movimentação financeira vinculada.`);
        continue;
      }
      if (valorPago > 0 && !registro.resolucaoConciliacao) {
        registrosBloqueados += 1;
        bloqueios.push(`Linha ${registro.linha}: valor pago exige aprovação de conciliação antes da confirmação definitiva.`);
        continue;
      }
      if (financeirosResolvidos.some(financeiro => !financeiroEstaApto(financeiro))) {
        registrosBloqueados += 1;
        bloqueios.push(`Linha ${registro.linha}: vínculo financeiro incompleto, ignorado, com erro, pendente ou já confirmado.`);
        continue;
      }
      const somaFinanceiros = arredondarDinheiro(financeirosResolvidos.reduce((total, financeiro) => {
        const movimento = financeiro.dadosNormalizados!;
        return total + arredondarDinheiro(movimento.valorPago || movimento.valor || 0);
      }, 0));
      if (valorPago > 0 && Math.abs(somaFinanceiros - valorPago) > 0.01) {
        registrosBloqueados += 1;
        bloqueios.push(`Linha ${registro.linha}: valor pago não bate com a soma financeira vinculada.`);
        continue;
      }

      assinaturasNoPlano.add(assinatura);
      financeirosResolvidos.forEach(financeiro => financeirosNoPlano.add(financeiro.id));
      planejadas.push({ staging: registro, financeiros: financeirosResolvidos, assinatura });
      pagamentosPrevistos += financeirosResolvidos.length;
      movimentosPrevistos += financeirosResolvidos.length;
      faturamentoTotal = arredondarDinheiro(faturamentoTotal + dados.total);
      custoTotal = arredondarDinheiro(custoTotal + dados.custo);
      lucroTotal = arredondarDinheiro(lucroTotal + dados.lucro);
      valorPagoTotal = arredondarDinheiro(valorPagoTotal + dados.valorPago);
      valorPendenteTotal = arredondarDinheiro(valorPendenteTotal + Math.max(0, dados.total - dados.valorPago));
      const data = dataOrdenavel(dados.dataTransacao || dados.dataPagamento);
      if (data) datas.push(data);
    }

    if (!planejadas.length) avisos.push('Nenhuma transação aprovada e coerente disponível para confirmar.');
    datas.sort();
    const itensPacote = planejadas.map(item => ({
      registroTransacaoId: item.staging.id,
      linha: item.staging.linha,
      assinatura: item.assinatura,
      stagingSnapshot: item.staging,
      financeirosSnapshot: item.financeiros
    }));
    const assinaturaPacote = assinaturaPacoteDeItens(itensPacote);
    const previaId = `previa-${assinaturaPacote}-${planejadas.length}`;
    const loteConfirmacaoId = `lote-${hashCurto(`${previaId}|${assinaturaPacote}`)}-${planejadas.length}`;
    const plano: ConfirmacaoPlano = {
      previaId,
      loteConfirmacaoId,
      assinaturaPacote,
      planejadas,
      registrosIgnorados,
      registrosBloqueados,
      faturamentoTotal,
      custoTotal,
      lucroTotal,
      valorPagoTotal,
      valorPendenteTotal,
      avisos,
      bloqueios,
      pagamentosPrevistos,
      movimentosPrevistos
    };
    if (datas[0]) plano.primeiraData = datas[0];
    const ultima = datas[datas.length - 1];
    if (ultima) plano.ultimaData = ultima;
    return plano;
  }

  private async resultadoDoPlano(plano: ConfirmacaoPlano, modo: 'previsualizar' | 'confirmar' | 'desfazer_lote' | 'recuperar_falha' | 'listar_lotes', criados = { transacoes: 0, pagamentos: 0, movimentos: 0 }, status?: string): Promise<ConfirmarImportacaoHistoricaFinanceiraResultado> {
    const pacotes = await this.resumosPacotes();
    const resultado: ConfirmarImportacaoHistoricaFinanceiraResultado = {
      modo,
      previaId: plano.previaId,
      loteConfirmacaoId: plano.loteConfirmacaoId,
      transacoesCriadas: criados.transacoes,
      pagamentosCriados: criados.pagamentos,
      movimentosCriados: criados.movimentos,
      registrosIgnorados: plano.registrosIgnorados,
      registrosBloqueados: plano.registrosBloqueados,
      faturamentoTotal: plano.faturamentoTotal,
      custoTotal: plano.custoTotal,
      lucroTotal: plano.lucroTotal,
      valorPagoTotal: plano.valorPagoTotal,
      valorPendenteTotal: plano.valorPendenteTotal,
      avisos: plano.avisos,
      bloqueios: plano.bloqueios,
      bloqueiosExportacao: bloqueiosExportacaoTexto(plano.bloqueios),
      transacoesPrevistas: plano.planejadas.length,
      pagamentosPrevistos: plano.pagamentosPrevistos,
      movimentosPrevistos: plano.movimentosPrevistos,
      pacotesConfirmados: pacotes.confirmados,
      pacotesComFalha: pacotes.falhas
    };
    if (status) resultado.pacoteStatus = status;
    if (plano.primeiraData) resultado.primeiraData = plano.primeiraData;
    if (plano.ultimaData) resultado.ultimaData = plano.ultimaData;
    return resultado;
  }

  private pacoteDoPlano(plano: ConfirmacaoPlano, now: string): PacoteConfirmacaoHistorica {
    const payloadProtegido = {
      planejadas: plano.planejadas.map(item => ({
        registroTransacaoId: item.staging.id,
        linha: item.staging.linha,
        assinatura: item.assinatura,
        stagingSnapshot: item.staging,
        financeirosSnapshot: item.financeiros
      })),
      bloqueios: [...plano.bloqueios],
      avisos: [...plano.avisos],
      artefatosCriados: cloneArtefatos(),
      resumoProtegido: {
        totalTransacoes: plano.planejadas.length,
        totalPagamentos: plano.pagamentosPrevistos,
        totalMovimentos: plano.movimentosPrevistos,
        registrosIgnorados: plano.registrosIgnorados,
        registrosBloqueados: plano.registrosBloqueados,
        faturamentoTotal: plano.faturamentoTotal,
        custoTotal: plano.custoTotal,
        lucroTotal: plano.lucroTotal,
        valorPagoTotal: plano.valorPagoTotal,
        valorPendenteTotal: plano.valorPendenteTotal,
        ...(plano.primeiraData ? { primeiraData: plano.primeiraData } : {}),
        ...(plano.ultimaData ? { ultimaData: plano.ultimaData } : {})
      }
    };
    const pacote: PacoteConfirmacaoHistorica = {
      id: plano.previaId,
      previaId: plano.previaId,
      loteConfirmacaoId: plano.loteConfirmacaoId,
      status: 'congelado',
      assinaturaPacote: plano.assinaturaPacote,
      totalTransacoes: plano.planejadas.length,
      totalPagamentos: plano.pagamentosPrevistos,
      totalMovimentos: plano.movimentosPrevistos,
      registrosIgnorados: plano.registrosIgnorados,
      registrosBloqueados: plano.registrosBloqueados,
      faturamentoTotal: plano.faturamentoTotal,
      custoTotal: plano.custoTotal,
      lucroTotal: plano.lucroTotal,
      valorPagoTotal: plano.valorPagoTotal,
      valorPendenteTotal: plano.valorPendenteTotal,
      payloadProtegido,
      createdAt: now,
      updatedAt: now
    };
    if (plano.primeiraData) pacote.primeiraData = plano.primeiraData;
    if (plano.ultimaData) pacote.ultimaData = plano.ultimaData;
    return pacote;
  }

  // compatibilidade 1.18.2: congelarPrevia agora cria pacote persistente protegido.
  private async congelarPacote(plano: ConfirmacaoPlano): Promise<PacoteConfirmacaoHistorica> {
    const now = this.clock.now().toISOString();
    const pacote = await this.salvarPacote(this.pacoteDoPlano(plano, now));
    await Promise.all(plano.planejadas.map(item => this.stagingTransacoes.save({
      ...item.staging,
      confirmacaoPreviaId: plano.previaId,
      confirmacaoAssinatura: item.assinatura,
      updatedAt: now
    })));
    const financeiros = plano.planejadas.flatMap(item => item.financeiros);
    await Promise.all(financeiros.map(financeiro => this.stagingFinanceiros.save({
      ...financeiro,
      confirmacaoPreviaId: plano.previaId,
      updatedAt: now
    })));
    return pacote;
  }

  // compatibilidade 1.18.2: validarPreviaCongelada agora valida o pacote persistente.
  private async validarPacoteCongelado(previaId?: string): Promise<PacoteConfirmacaoHistorica> {
    if (!previaId) throw new Error('Recalcule a prévia antes de confirmar. A confirmação definitiva exige prévia atual, congelada e visível.');
    const pacote = await this.buscarPacotePorPrevia(previaId);
    if (!pacote || !pacote.payloadProtegido) throw new Error('Pacote congelado não encontrado. Gere a prévia novamente antes de confirmar.');
    if (pacote.status !== 'congelado') throw new Error(`Pacote não pode ser confirmado no status atual: ${pacote.status}.`);
    const assinaturaAtual = assinaturaPacoteDeItens(pacote.payloadProtegido.planejadas);
    if (assinaturaAtual !== pacote.assinaturaPacote) throw new Error('Pacote congelado foi alterado ou corrompido. Gere a prévia novamente.');
    const assinaturas = new Set<string>();
    const financeiros = new Set<string>();
    for (const item of pacote.payloadProtegido.planejadas) {
      if (assinaturas.has(item.assinatura)) throw new Error(`Pacote bloqueado: duplicidade interna na linha ${item.linha}.`);
      assinaturas.add(item.assinatura);
      for (const financeiro of item.financeirosSnapshot) {
        if (financeiros.has(financeiro.id)) throw new Error(`Pacote bloqueado: movimentação financeira repetida na linha ${item.linha}.`);
        financeiros.add(financeiro.id);
      }
    }
    const existentes = await this.transacoesFinanceiras.list();
    const assinaturasJaConfirmadas = new Set(existentes.map(item => item.assinaturaImportacao).filter(Boolean) as string[]);
    const duplicada = pacote.payloadProtegido.planejadas.find(item => assinaturasJaConfirmadas.has(item.assinatura));
    if (duplicada) throw new Error(`Pacote bloqueado: linha ${duplicada.linha} já foi confirmada antes.`);
    return pacote;
  }


  private planoDoPacote(pacote: PacoteConfirmacaoHistorica): ConfirmacaoPlano {
    const payload = pacote.payloadProtegido;
    const planejadas = payload?.planejadas.map(item => ({
      staging: item.stagingSnapshot,
      financeiros: item.financeirosSnapshot,
      assinatura: item.assinatura
    })) || [];
    const plano: ConfirmacaoPlano = {
      previaId: pacote.previaId,
      loteConfirmacaoId: pacote.loteConfirmacaoId,
      assinaturaPacote: pacote.assinaturaPacote,
      planejadas,
      registrosIgnorados: pacote.registrosIgnorados,
      registrosBloqueados: pacote.registrosBloqueados,
      faturamentoTotal: pacote.faturamentoTotal,
      custoTotal: pacote.custoTotal,
      lucroTotal: pacote.lucroTotal,
      valorPagoTotal: pacote.valorPagoTotal,
      valorPendenteTotal: pacote.valorPendenteTotal,
      avisos: payload?.avisos || [],
      bloqueios: payload?.bloqueios || [],
      pagamentosPrevistos: pacote.totalPagamentos,
      movimentosPrevistos: pacote.totalMovimentos
    };
    if (pacote.primeiraData) plano.primeiraData = pacote.primeiraData;
    if (pacote.ultimaData) plano.ultimaData = pacote.ultimaData;
    return plano;
  }

  private async reconsultarStagingAtualAntesDeConfirmar(pacote: PacoteConfirmacaoHistorica): Promise<void> {
    if (!pacote.payloadProtegido) throw new Error('Pacote sem payload protegido não pode ser confirmado.');
    const [stagingAtual, financeirosAtuais, oficiais] = await Promise.all([
      this.stagingTransacoes.list(),
      this.stagingFinanceiros.list(),
      this.transacoesFinanceiras.list()
    ]);
    const transacoesPorId = new Map(stagingAtual.map(registro => [registro.id, registro]));
    const financeirosPorId = new Map(financeirosAtuais.map(registro => [registro.id, registro]));
    const assinaturasJaConfirmadas = new Set(oficiais.map(assinaturaTransacaoOficial));
    const financeirosUsados = new Set<string>();

    for (const item of pacote.payloadProtegido.planejadas) {
      if (assinaturasJaConfirmadas.has(item.assinatura)) throw new Error(`Pacote bloqueado: linha ${item.linha} já existe nos oficiais atuais.`);
      const atual = transacoesPorId.get(item.registroTransacaoId);
      if (!atual) throw new Error(`Pacote bloqueado: linha ${item.linha} não existe mais no staging atual.`);
      if (atual.status !== 'validado' || atual.transacaoFinanceiraId) throw new Error(`Pacote bloqueado: linha ${item.linha} mudou de status depois da prévia.`);
      if (snapshotTransacaoComparavel(atual) !== snapshotTransacaoComparavel(item.stagingSnapshot)) throw new Error(`Pacote bloqueado: linha ${item.linha} foi alterada depois da prévia congelada.`);
      const idsEsperados = item.financeirosSnapshot.map(financeiro => financeiro.id).sort().join('|');
      const idsAtuais = (atual.financeiroStagingIdsResolvidos || []).slice().sort().join('|');
      if (idsEsperados !== idsAtuais) throw new Error(`Pacote bloqueado: vínculos financeiros da linha ${item.linha} mudaram depois da prévia.`);
      for (const financeiroSnapshot of item.financeirosSnapshot) {
        const financeiroAtual = financeirosPorId.get(financeiroSnapshot.id);
        if (!financeiroAtual) throw new Error(`Pacote bloqueado: movimento financeiro da linha ${item.linha} não existe mais no staging.`);
        if (financeirosUsados.has(financeiroAtual.id)) throw new Error(`Pacote bloqueado: movimento financeiro repetido na linha ${item.linha}.`);
        financeirosUsados.add(financeiroAtual.id);
        if (!financeiroEstaApto(financeiroAtual)) throw new Error(`Pacote bloqueado: financeiro vinculado à linha ${item.linha} mudou depois da prévia.`);
        if (snapshotFinanceiroComparavel(financeiroAtual) !== snapshotFinanceiroComparavel(financeiroSnapshot)) throw new Error(`Pacote bloqueado: financeiro vinculado à linha ${item.linha} foi alterado depois da prévia.`);
      }
    }
  }

  private async atualizarPacoteAntesDoArtefato(pacote: PacoteConfirmacaoHistorica, artefatos: ArtefatosPacoteConfirmacaoHistorica, now: string): Promise<void> {
    await this.atualizarPacote({ ...pacote, payloadProtegido: { ...pacote.payloadProtegido!, artefatosCriados: structuredClone(artefatos) } }, 'confirmando', now);
  }

  private async atualizarPacote(pacote: PacoteConfirmacaoHistorica, status: PacoteConfirmacaoHistorica['status'], now: string, extra: Partial<PacoteConfirmacaoHistorica> = {}): Promise<PacoteConfirmacaoHistorica> {
    return this.salvarPacote({ ...pacote, ...extra, status, updatedAt: now });
  }

  private async removerArtefatos(artefatos: ArtefatosPacoteConfirmacaoHistorica): Promise<{ transacoes: number; pagamentos: number; movimentos: number }> {
    this.exigirRemocaoSegura();
    await Promise.all([...artefatos.movimentoIds].reverse().map(id => this.movimentos.remove!(id)));
    await Promise.all([...artefatos.pagamentoIds].reverse().map(id => this.pagamentos.remove!(id)));
    await Promise.all([...artefatos.transacaoIds].reverse().map(id => this.transacoesFinanceiras.remove!(id)));
    return { transacoes: artefatos.transacaoIds.length, pagamentos: artefatos.pagamentoIds.length, movimentos: artefatos.movimentoIds.length };
  }

  private async recuperarFalha(loteConfirmacaoId?: string): Promise<ConfirmarImportacaoHistoricaFinanceiraResultado> {
    this.exigirRemocaoSegura();
    if (!loteConfirmacaoId?.trim()) throw new Error('Informe o lote com falha para recuperar.');
    const loteId = loteConfirmacaoId.trim();
    const pacote = await this.buscarPacotePorLote(loteId);
    if (!pacote || !pacote.payloadProtegido) throw new Error('Pacote com falha não encontrado.');
    if (pacote.status !== 'falha_confirmacao' && pacote.status !== 'confirmando') throw new Error('Somente pacote com falha/interrupção de confirmação entra na recuperação.');
    const removidos = await this.removerArtefatos(pacote.payloadProtegido.artefatosCriados);
    const now = this.clock.now().toISOString();
    await Promise.all(pacote.payloadProtegido.planejadas.map(item => this.stagingTransacoes.save({ ...item.stagingSnapshot, status: 'validado', updatedAt: now })));
    await Promise.all(pacote.payloadProtegido.planejadas.flatMap(item => item.financeirosSnapshot).map(financeiro => this.stagingFinanceiros.save({ ...financeiro, status: 'validado', updatedAt: now })));
    const pacoteRecuperado = await this.atualizarPacote({ ...pacote, payloadProtegido: { ...pacote.payloadProtegido, artefatosCriados: cloneArtefatos() } }, 'congelado', now);
    const plano = this.planoDoPacote(pacoteRecuperado);
    return { ...(await this.resultadoDoPlano(plano, 'recuperar_falha')), transacoesDesfeitas: removidos.transacoes, pagamentosDesfeitos: removidos.pagamentos, movimentosDesfeitos: removidos.movimentos };
  }

  private planoVazio(previaId = 'sem-previa', loteConfirmacaoId = 'sem-lote'): ConfirmacaoPlano {
    return {
      previaId,
      loteConfirmacaoId,
      assinaturaPacote: '',
      planejadas: [],
      registrosIgnorados: 0,
      registrosBloqueados: 0,
      faturamentoTotal: 0,
      custoTotal: 0,
      lucroTotal: 0,
      valorPagoTotal: 0,
      valorPendenteTotal: 0,
      avisos: [],
      bloqueios: [],
      pagamentosPrevistos: 0,
      movimentosPrevistos: 0
    };
  }

  private async desfazerLote(loteConfirmacaoId?: string, confirmacaoDesfazerTexto?: string): Promise<ConfirmarImportacaoHistoricaFinanceiraResultado> {
    this.exigirRemocaoSegura();
    if (!loteConfirmacaoId?.trim()) throw new Error('Informe o lote de confirmação para desfazer.');
    const loteId = loteConfirmacaoId.trim();
    if (confirmacaoDesfazerTexto !== 'DESFAZER') throw new Error('Para evitar toque acidental, digite DESFAZER antes de desfazer o lote.');
    const pacote = await this.buscarPacotePorLote(loteId);
    if (!pacote || !pacote.payloadProtegido) throw new Error('Pacote persistente do lote não encontrado. Desfazer bloqueado para não apagar dado errado.');
    if (pacote.status !== 'confirmado') throw new Error(`Lote não pode ser desfeito no status atual: ${pacote.status}.`);
    const confirmadoEm = pacote.confirmadoEm || pacote.updatedAt;
    const [transacoes, pagamentos, movimentos] = await Promise.all([
      this.transacoesFinanceiras.list(),
      this.pagamentos.list(),
      this.movimentos.list()
    ]);
    const artefatos = pacote.payloadProtegido.artefatosCriados;
    const transacoesDoLote = transacoes.filter(item => artefatos.transacaoIds.includes(item.id));
    const pagamentosDoLote = pagamentos.filter(item => artefatos.pagamentoIds.includes(item.id));
    const movimentosDoLote = movimentos.filter(item => artefatos.movimentoIds.includes(item.id));
    const faltando = artefatos.transacaoIds.length !== transacoesDoLote.length || artefatos.pagamentoIds.length !== pagamentosDoLote.length || artefatos.movimentoIds.length !== movimentosDoLote.length;
    if (faltando) throw new Error('Desfazer bloqueado: algum dado do lote não foi encontrado, indicando alteração externa.');
    const alteradoDepois = [...transacoesDoLote, ...pagamentosDoLote, ...movimentosDoLote].some(item => item.updatedAt > confirmadoEm);
    if (alteradoDepois) throw new Error('Desfazer bloqueado: existe dado do lote alterado depois da confirmação. Revise manualmente.');
    const removidos = await this.removerArtefatos(artefatos);
    const now = this.clock.now().toISOString();
    await Promise.all(pacote.payloadProtegido.planejadas.map(item => this.stagingTransacoes.save({
      ...item.stagingSnapshot,
      status: 'validado',
      updatedAt: now
    })));
    await Promise.all(pacote.payloadProtegido.planejadas.flatMap(item => item.financeirosSnapshot).map(financeiro => this.stagingFinanceiros.save({
      ...financeiro,
      status: 'validado',
      updatedAt: now
    })));
    await this.atualizarPacote(pacote, 'desfeito', now, { desfeitoEm: now });

    return {
      ...(await this.resultadoDoPlano(this.planoVazio(loteId, loteId), 'desfazer_lote')),
      transacoesDesfeitas: removidos.transacoes,
      pagamentosDesfeitos: removidos.pagamentos,
      movimentosDesfeitos: removidos.movimentos
    };
  }

  async execute(input: ConfirmarImportacaoHistoricaFinanceiraInput = { modo: 'previsualizar' }): Promise<ConfirmarImportacaoHistoricaFinanceiraResultado> {
    if (input.modo === 'listar_lotes') return this.resultadoDoPlano(this.planoVazio('lotes', 'lotes'), 'listar_lotes');
    if (input.modo === 'desfazer_lote') return this.desfazerLote(input.loteConfirmacaoId || input.previaId, input.confirmacaoDesfazerTexto);
    if (input.modo === 'recuperar_falha') return this.recuperarFalha(input.loteConfirmacaoId || input.previaId);
    if (input.modo === 'previsualizar') {
      const plano = await this.montarPlano();
      const pacote = await this.congelarPacote(plano);
      return this.resultadoDoPlano(plano, 'previsualizar', { transacoes: 0, pagamentos: 0, movimentos: 0 }, pacote.status);
    }
    this.exigirRemocaoSegura();
    const pacote = await this.validarPacoteCongelado(input.previaId);
    if (!pacote.payloadProtegido?.planejadas.length) return this.resultadoDoPlano(this.planoDoPacote(pacote), 'confirmar');
    await this.reconsultarStagingAtualAntesDeConfirmar(pacote);

    const now = this.clock.now().toISOString();
    const artefatos = pacote.payloadProtegido.artefatosCriados || cloneArtefatos();
    const pacoteConfirmando = await this.atualizarPacote({ ...pacote, payloadProtegido: { ...pacote.payloadProtegido, artefatosCriados: artefatos } }, 'confirmando', now);
    const rollbackConfirmacaoHistorica = async (): Promise<void> => {
      const atual = await this.buscarPacotePorPrevia(pacoteConfirmando.previaId);
      const criados = atual?.payloadProtegido?.artefatosCriados || artefatos;
      await this.removerArtefatos(criados);
    };

    try {
      for (const planejada of pacoteConfirmando.payloadProtegido!.planejadas) {
        const dados = planejada.stagingSnapshot.dadosNormalizados!;
        const transacaoInput = {
          numeroOrigem: planejada.stagingSnapshot.numeroOriginal || dados.numero,
          clienteNome: dados.clienteNome || planejada.stagingSnapshot.clienteNomeImportado || 'Comprador importado',
          dataTransacao: dados.dataTransacao || dados.dataPagamento || now,
          statusOperacional: dados.status || 'historico_importado',
          subtotal: arredondarDinheiro(dados.total + dados.desconto - dados.entrega),
          desconto: dados.desconto,
          entrega: dados.entrega,
          taxa: dados.taxaTransacoes,
          total: dados.total,
          valorPago: dados.valorPago,
          custo: dados.custo,
          lucro: dados.lucro,
          origem: 'importado_csv' as const,
          observacao: `${dados.observacao ? `${dados.observacao} | ` : ''}Histórico importado: não baixa estoque/lote. Lote de confirmação: ${pacoteConfirmando.loteConfirmacaoId}. Origem staging: ${planejada.stagingSnapshot.id}`
        };
        if (planejada.stagingSnapshot.perfilIdResolvido) Object.assign(transacaoInput, { perfilId: planejada.stagingSnapshot.perfilIdResolvido });
        const transacaoId = this.idFactory('transacao-fin');
        const transacaoCriada = criarTransacaoFinanceira(transacaoInput, transacaoId, now);
        artefatos.transacaoIds.push(transacaoId);
        await this.atualizarPacoteAntesDoArtefato(pacoteConfirmando, artefatos, now);
        const transacao = await this.transacoesFinanceiras.save({ ...transacaoCriada, loteConfirmacaoId: pacoteConfirmando.loteConfirmacaoId, assinaturaImportacao: planejada.assinatura, confirmadoEm: now });

        for (const financeiro of planejada.financeirosSnapshot) {
          const movimento = financeiro.dadosNormalizados!;
          const valorPagamento = arredondarDinheiro(movimento.valorPago || movimento.valor || 0);
          const pagamentoId = this.idFactory('pagamento');
          let pagamentoCriado = criarPagamentoTransacao({
            transacaoId: transacao.id,
            clienteNome: transacao.clienteNome,
            valor: valorPagamento,
            tipo: movimento.metodoPagamento || tipoPagamentoPrincipal(dados.tiposPagamento),
            status: statusPagamentoPorValor(valorPagamento, transacao.total),
            dataHora: movimento.dataPagamento || movimento.dataCriacao || transacao.dataTransacao,
            origem: 'importado_csv',
            observacao: movimento.observacao || `Histórico importado vinculado à transação #${transacao.numeroOrigem || dados.numero}.`
          }, pagamentoId, now);
          artefatos.pagamentoIds.push(pagamentoId);
          await this.atualizarPacoteAntesDoArtefato(pacoteConfirmando, artefatos, now);
          let pagamento = await this.pagamentos.save({ ...pagamentoCriado, loteConfirmacaoId: pacoteConfirmando.loteConfirmacaoId });
          const movimentoInput = {
            transacaoId: transacao.id,
            pagamentoId: pagamento.id,
            clienteNome: transacao.clienteNome,
            tipo: 'entrada' as const,
            valor: pagamento.valor,
            dataHora: pagamento.dataHora || transacao.dataTransacao,
            status: movimento.pago ? 'conciliado' as const : 'previsto' as const,
            origem: 'importado_csv' as const,
            observacao: movimento.observacao || 'Movimento criado a partir do histórico confirmado.',
            origensRastreaveis: [{ transacaoId: transacao.id, pagamentoId: pagamento.id, clienteNome: transacao.clienteNome, valorOriginal: pagamento.valor, moedaOriginal: pagamento.moeda }]
          };
          if (movimento.numeroTransacaoReferenciado) Object.assign(movimentoInput, { referenciaExterna: `#${movimento.numeroTransacaoReferenciado}` });
          const movimentoId = this.idFactory('mov-fin');
          const movCriado = criarMovimentoFinanceiro(movimentoInput, movimentoId, now);
          artefatos.movimentoIds.push(movimentoId);
          await this.atualizarPacoteAntesDoArtefato(pacoteConfirmando, artefatos, now);
          const mov = await this.movimentos.save({ ...movCriado, loteConfirmacaoId: pacoteConfirmando.loteConfirmacaoId });
          pagamento = await this.pagamentos.save({ ...pagamento, movimentoFinanceiroId: mov.id, updatedAt: now });
          const financeiroAtualizado: RegistroImportacaoFinanceira = { ...financeiro, status: 'confirmado', movimentoFinanceiroId: mov.id, loteConfirmacaoId: pacoteConfirmando.loteConfirmacaoId, updatedAt: now };
          await this.stagingFinanceiros.save(financeiroAtualizado);
        }

        const transacaoAtualizada: RegistroImportacaoTransacao = { ...planejada.stagingSnapshot, status: 'confirmado', transacaoFinanceiraId: transacao.id, loteConfirmacaoId: pacoteConfirmando.loteConfirmacaoId, updatedAt: now };
        await this.stagingTransacoes.save(transacaoAtualizada);
      }
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Falha desconhecida na confirmação histórica.';
      try {
        await rollbackConfirmacaoHistorica();
        artefatos.transacaoIds = [];
        artefatos.pagamentoIds = [];
        artefatos.movimentoIds = [];
      } catch (_) {
        // pacote com falha/interrupção mantém IDs criados para recuperação persistente obrigatória.
      }
      await this.atualizarPacote({ ...pacoteConfirmando, payloadProtegido: { ...pacoteConfirmando.payloadProtegido!, artefatosCriados: artefatos } }, 'falha_confirmacao', this.clock.now().toISOString(), { falhaMensagem: mensagem });
      throw error;
    }

    const pacoteFinal = await this.atualizarPacote({ ...pacoteConfirmando, payloadProtegido: { ...pacoteConfirmando.payloadProtegido!, artefatosCriados: artefatos } }, 'confirmado', now, { confirmadoEm: now });
    const planoFinal = this.planoDoPacote(pacoteFinal);
    return this.resultadoDoPlano(planoFinal, 'confirmar', { transacoes: artefatos.transacaoIds.length, pagamentos: artefatos.pagamentoIds.length, movimentos: artefatos.movimentoIds.length }, 'confirmado');
  }
}
