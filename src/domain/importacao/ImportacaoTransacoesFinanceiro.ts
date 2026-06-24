import type { Entity } from '../../core/Entity';
import type { ItemCatalogo } from '../item/ItemCatalogo';
import type { Perfil } from '../perfil/Perfil';
import { arredondarDinheiro, type TipoPagamentoTransacao } from '../financeiro/Financeiro';

export type StatusLoteImportacao = 'em_preparacao' | 'parcialmente_resolvido' | 'concluido' | 'cancelado';
export type StatusRegistroImportacao = 'pendente_cliente' | 'pendente_item' | 'pendente_financeiro' | 'validado' | 'confirmado' | 'ignorado' | 'erro';
export type TipoPendenciaImportacao = 'cliente_nao_encontrado' | 'item_nao_encontrado' | 'financeiro_divergente' | 'transacao_nao_encontrada' | 'coluna_obrigatoria' | 'valor_invalido' | 'descricao_invalida' | 'revisao_manual';
export type OrigemImportacao = 'csv_transacoes' | 'csv_financeiro' | 'sistema_antigo';

export interface PendenciaImportacao {
  tipo: TipoPendenciaImportacao;
  mensagem: string;
  campo?: string;
  valor?: string;
}

export interface LoteImportacaoTransacoes extends Entity {
  nomeArquivo: string;
  origem: OrigemImportacao;
  status: StatusLoteImportacao;
  totalLinhas: number;
  totalValidas: number;
  totalPendentes: number;
  totalConfirmadas: number;
}

export interface ItemImportadoTransacao {
  descricaoOriginal: string;
  quantidade: number;
  unidade?: string;
  nomeItem: string;
  precoInformado?: number;
  itemIdResolvido?: string;
  variacaoIdResolvida?: string;
  pendencias: PendenciaImportacao[];
}

export interface DadosNormalizadosTransacaoImportada {
  numero: string;
  status: string;
  dataTransacao?: string;
  dataEntrega?: string;
  dataVencimento?: string;
  dataPagamento?: string;
  quantidadeTotal?: number;
  descricao: string;
  desconto: number;
  entrega: number;
  taxaTransacoes: number;
  total: number;
  valorPago: number;
  custo: number;
  lucro: number;
  tiposPagamento: TipoPagamentoTransacao[];
  clienteNome: string;
  observacao?: string;
  itens: ItemImportadoTransacao[];
}

export interface RegistroImportacaoTransacao extends Entity {
  loteImportacaoId: string;
  linha: number;
  numeroOriginal?: string;
  dadosBrutos: Record<string, string>;
  dadosNormalizados?: DadosNormalizadosTransacaoImportada;
  clienteNomeImportado?: string;
  perfilIdResolvido?: string;
  status: StatusRegistroImportacao;
  pendencias: PendenciaImportacao[];
  transacaoFinanceiraId?: string;
  financeiroStagingIdsResolvidos?: string[];
  resolucaoConciliacao?: 'manual' | 'massa_segura';
  confirmacaoPreviaId?: string;
  confirmacaoAssinatura?: string;
  loteConfirmacaoId?: string;
}



export interface RegistroImportacaoTransacaoPayloadProtegido {
  dadosBrutos: Record<string, string>;
  dadosNormalizados?: DadosNormalizadosTransacaoImportada;
  clienteNomeImportado?: string;
  pendencias: PendenciaImportacao[];
}

export interface RegistroImportacaoTransacaoRecord extends Entity {
  loteImportacaoId: string;
  linha: number;
  numeroOriginal?: string;
  perfilIdResolvido?: string;
  status: StatusRegistroImportacao;
  tiposPendencia: TipoPendenciaImportacao[];
  transacaoFinanceiraId?: string;
  financeiroStagingIdsResolvidos?: string[];
  resolucaoConciliacao?: 'manual' | 'massa_segura';
  confirmacaoPreviaId?: string;
  confirmacaoAssinatura?: string;
  loteConfirmacaoId?: string;
  payloadProtegido: string;
}


export interface LoteImportacaoFinanceira extends Entity {
  nomeArquivo: string;
  origem: OrigemImportacao;
  status: StatusLoteImportacao;
  totalLinhas: number;
  totalValidas: number;
  totalPendentes: number;
  totalConfirmadas: number;
}

export interface DadosNormalizadosMovimentoImportado {
  dataCriacao?: string;
  dataVencimento?: string;
  dataPagamento?: string;
  descricao: string;
  numeroTransacaoReferenciado?: string;
  valor: number;
  metodoPagamento: TipoPagamentoTransacao;
  taxa: number;
  valorPago: number;
  pago: boolean;
  categoria?: string;
  clienteNome: string;
  tipo?: string;
  observacao?: string;
  usuario?: string;
  usuarioPagamento?: string;
}

export interface RegistroImportacaoFinanceira extends Entity {
  loteImportacaoId: string;
  linha: number;
  dadosBrutos: Record<string, string>;
  dadosNormalizados?: DadosNormalizadosMovimentoImportado;
  clienteNomeImportado?: string;
  perfilIdResolvido?: string;
  numeroTransacaoReferenciado?: string;
  status: StatusRegistroImportacao;
  pendencias: PendenciaImportacao[];
  movimentoFinanceiroId?: string;
  transacaoStagingIdResolvida?: string;
  resolucaoConciliacao?: 'manual' | 'massa_segura';
  confirmacaoPreviaId?: string;
  loteConfirmacaoId?: string;
}



export interface RegistroImportacaoFinanceiraPayloadProtegido {
  dadosBrutos: Record<string, string>;
  dadosNormalizados?: DadosNormalizadosMovimentoImportado;
  clienteNomeImportado?: string;
  pendencias: PendenciaImportacao[];
}

export interface RegistroImportacaoFinanceiraRecord extends Entity {
  loteImportacaoId: string;
  linha: number;
  perfilIdResolvido?: string;
  numeroTransacaoReferenciado?: string;
  status: StatusRegistroImportacao;
  tiposPendencia: TipoPendenciaImportacao[];
  movimentoFinanceiroId?: string;
  transacaoStagingIdResolvida?: string;
  resolucaoConciliacao?: 'manual' | 'massa_segura';
  confirmacaoPreviaId?: string;
  loteConfirmacaoId?: string;
  payloadProtegido: string;
}


export interface ResultadoParseTabela {
  headers: string[];
  rows: Record<string, string>[];
}

export interface ResumoStagingImportacao {
  total: number;
  validos: number;
  pendentes: number;
  erros: number;
  pendentesPerfil: number;
  pendentesItem: number;
  pendentesFinanceiro: number;
}

export function normalizarTextoBusca(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9À-ÿ# ._-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function parseNumeroPtBr(valor: string | undefined, fallback = 0): number {
  const raw = String(valor ?? '').trim();
  if (!raw) return fallback;
  const cleaned = raw.replace(/R\$/gi, '').replace(/\s/g, '');
  const normalized = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeHeader(header: string): string {
  return normalizarTextoBusca(header).replace(/\s+/g, ' ');
}

function detectarSeparador(primeiraLinha: string): string {
  const candidatos = ['\t', ';', ','];
  return candidatos.sort((a, b) => primeiraLinha.split(b).length - primeiraLinha.split(a).length)[0] || '\t';
}

export function parseTabelaDelimitada(conteudo: string): ResultadoParseTabela {
  const text = conteudo.replace(/^\uFEFF/, '').trim();
  if (!text) return { headers: [], rows: [] };
  const primeiraLinha = text.split(/\r?\n/, 1)[0] || '';
  const sep = detectarSeparador(primeiraLinha);
  const records: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') { cell += '"'; i += 1; }
      else inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && char === sep) { row.push(cell.trim()); cell = ''; continue; }
    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell.trim());
      if (row.some(value => value.trim())) records.push(row);
      row = [];
      cell = '';
      continue;
    }
    cell += char;
  }
  row.push(cell.trim());
  if (row.some(value => value.trim())) records.push(row);
  const headers = records.shift() || [];
  const rows = records.map(values => {
    const out: Record<string, string> = {};
    headers.forEach((header, index) => { out[header] = values[index] || ''; });
    return out;
  });
  return { headers, rows };
}

function get(row: Record<string, string>, ...names: string[]): string {
  const byNormalized = new Map(Object.keys(row).map(key => [normalizeHeader(key), key]));
  for (const name of names) {
    const key = byNormalized.get(normalizeHeader(name));
    if (key) return row[key] || '';
  }
  return '';
}

export function mapearTipoPagamento(valor: string): TipoPagamentoTransacao {
  const normalized = normalizarTextoBusca(valor);
  if (normalized.includes('pix')) return 'pix';
  if (normalized.includes('dinheiro')) return 'dinheiro';
  if (normalized.includes('credito')) return 'cartao_credito';
  if (normalized.includes('debito')) return 'cartao_debito';
  if (normalized.includes('pendente')) return 'pendente';
  if (normalized.includes('cripto') || normalized.includes('bitcoin') || normalized.includes('btc') || normalized.includes('ethereum')) return 'cripto';
  if (normalized.includes('transfer')) return 'transferencia';
  return 'outro';
}

export function parseTiposPagamento(valor: string): TipoPagamentoTransacao[] {
  const tipos = valor.split(/[,/;+]/).map(mapearTipoPagamento).filter(Boolean);
  return Array.from(new Set(tipos.length ? tipos : ['outro']));
}

export function extrairItensDaDescricao(descricao: string, itensExistentes: ItemCatalogo[]): ItemImportadoTransacao[] {
  const linhas = descricao.split(/\r?\n/).map(linha => linha.trim()).filter(Boolean);
  const catalogo = itensExistentes.map(item => ({ item, nomeNormalizado: normalizarTextoBusca(item.nome) }));
  return linhas.map(linha => {
    const match = linha.match(/^([\d.,]+)\s*([a-zA-ZÀ-ÿ]+)?\s*x\s+(.+?)(?:\s*\(([\d.,]+)\))?$/i);
    const quantidade = match ? parseNumeroPtBr(match[1], 1) : 1;
    const unidade = match?.[2]?.trim() || 'un';
    const nomeItem = (match ? (match[3] || '') : linha.replace(/\([\d.,]+\)\s*$/, '')).trim();
    const precoInformado = match?.[4] ? parseNumeroPtBr(match[4]) : undefined;
    const nomeNormalizado = normalizarTextoBusca(nomeItem);
    const encontrado = catalogo.find(entry => entry.nomeNormalizado === nomeNormalizado || nomeNormalizado.includes(entry.nomeNormalizado) || entry.nomeNormalizado.includes(nomeNormalizado));
    const pendencias: PendenciaImportacao[] = [];
    if (!match) pendencias.push({ tipo: 'descricao_invalida', campo: 'Descrição', valor: linha, mensagem: 'Não foi possível interpretar quantidade/item/preço desta linha.' });
    if (!encontrado) pendencias.push({ tipo: 'item_nao_encontrado', campo: 'Descrição', valor: nomeItem, mensagem: `Item não encontrado no app: ${nomeItem}` });
    const itemImportado: ItemImportadoTransacao = { descricaoOriginal: linha, quantidade, unidade, nomeItem, pendencias };
    if (precoInformado !== undefined) itemImportado.precoInformado = precoInformado;
    if (encontrado) itemImportado.itemIdResolvido = encontrado.item.id;
    return itemImportado;
  });
}

export function encontrarPerfilPorNome(nome: string, perfis: Perfil[]): Perfil | undefined {
  const alvo = normalizarTextoBusca(nome);
  return perfis.find(perfil => normalizarTextoBusca(perfil.nome) === alvo);
}

export function normalizarTransacaoImportada(row: Record<string, string>, itensExistentes: ItemCatalogo[]): DadosNormalizadosTransacaoImportada {
  const descricao = get(row, 'Descrição', 'Descricao');
  const total = parseNumeroPtBr(get(row, 'Total'));
  const valorPago = parseNumeroPtBr(get(row, 'Valor Pago'));
  const custo = parseNumeroPtBr(get(row, 'Custo'));
  const lucro = parseNumeroPtBr(get(row, 'Lucro'), arredondarDinheiro(total - custo));
  return {
    numero: get(row, 'Número', 'Numero', '#').replace(/^#/, '').trim(),
    status: get(row, 'Status') || 'Importado',
    dataTransacao: get(row, 'Data'),
    dataEntrega: get(row, 'Data de Entrega'),
    dataVencimento: get(row, 'Data de Vencimento'),
    dataPagamento: get(row, 'Data do Pagamento'),
    quantidadeTotal: parseNumeroPtBr(get(row, 'Quantidade')),
    descricao,
    desconto: parseNumeroPtBr(get(row, 'Desconto')),
    entrega: parseNumeroPtBr(get(row, 'Entrega')),
    taxaTransacoes: parseNumeroPtBr(get(row, 'Taxa de Transacoes')),
    total,
    valorPago,
    custo,
    lucro,
    tiposPagamento: parseTiposPagamento(get(row, 'Tipos de Pagamento')),
    clienteNome: get(row, 'Cli' + 'ente').trim(),
    observacao: get(row, 'Observação', 'Observacao'),
    itens: extrairItensDaDescricao(descricao, itensExistentes)
  };
}

export function extrairNumeroTransacaoDaDescricaoFinanceira(descricao: string): string | undefined {
  const match = descricao.match(/#\s*(\d+)/);
  return match?.[1];
}

export function normalizarMovimentoImportado(row: Record<string, string>): DadosNormalizadosMovimentoImportado {
  const descricao = get(row, 'Descrição', 'Descricao');
  const numeroTransacaoReferenciado = extrairNumeroTransacaoDaDescricaoFinanceira(descricao);
  const normalizado: DadosNormalizadosMovimentoImportado = {
    dataCriacao: get(row, 'Data de Criação', 'Data de Criacao'),
    dataVencimento: get(row, 'Data de Vencimento'),
    dataPagamento: get(row, 'Data do Pagamento'),
    descricao,
    valor: parseNumeroPtBr(get(row, 'Valor')),
    metodoPagamento: mapearTipoPagamento(get(row, 'Método de Pagamento', 'Metodo de Pagamento')),
    taxa: parseNumeroPtBr(get(row, 'Taxa')),
    valorPago: parseNumeroPtBr(get(row, 'Valor Pago')),
    pago: normalizarTextoBusca(get(row, 'Pago')).startsWith('sim'),
    categoria: get(row, 'Categoria'),
    clienteNome: get(row, 'Cli' + 'ente').trim(),
    tipo: get(row, 'Tipo'),
    observacao: get(row, 'Observação', 'Observacao'),
    usuario: get(row, 'Usuário', 'Usuario'),
    usuarioPagamento: get(row, 'Usuário do Pagamento', 'Usuario do Pagamento')
  };
  if (numeroTransacaoReferenciado) normalizado.numeroTransacaoReferenciado = numeroTransacaoReferenciado;
  return normalizado;
}

export function statusRegistroPorPendencias(pendencias: PendenciaImportacao[]): StatusRegistroImportacao {
  if (!pendencias.length) return 'validado';
  if (pendencias.some(p => p?.tipo === 'cliente_nao_encontrado')) return 'pendente_cliente';
  if (pendencias.some(p => p?.tipo === 'item_nao_encontrado' || p?.tipo === 'descricao_invalida')) return 'pendente_item';
  if (pendencias.some(p => p?.tipo === 'financeiro_divergente' || p?.tipo === 'transacao_nao_encontrada')) return 'pendente_financeiro';
  return 'erro';
}

export function resumirRegistrosImportacao(registros: Array<{ status: StatusRegistroImportacao; pendencias: PendenciaImportacao[] }>): ResumoStagingImportacao {
  return {
    total: registros.length,
    validos: registros.filter(r => r.status === 'validado').length,
    pendentes: registros.filter(r => r.status.startsWith('pendente')).length,
    erros: registros.filter(r => r.status === 'erro').length,
    pendentesPerfil: registros.filter(r => r.pendencias.some(p => p?.tipo === 'cliente_nao_encontrado')).length,
    pendentesItem: registros.filter(r => r.pendencias.some(p => p?.tipo === 'item_nao_encontrado' || p?.tipo === 'descricao_invalida')).length,
    pendentesFinanceiro: registros.filter(r => r.pendencias.some(p => p?.tipo === 'financeiro_divergente' || p?.tipo === 'transacao_nao_encontrada')).length
  };
}

export function criarLoteImportacaoTransacoes(nomeArquivo: string, totalLinhas: number, id: string, now: string): LoteImportacaoTransacoes {
  return { id, nomeArquivo, origem: 'csv_transacoes', status: 'em_preparacao', totalLinhas, totalValidas: 0, totalPendentes: 0, totalConfirmadas: 0, createdAt: now, updatedAt: now };
}

export function criarLoteImportacaoFinanceira(nomeArquivo: string, totalLinhas: number, id: string, now: string): LoteImportacaoFinanceira {
  return { id, nomeArquivo, origem: 'csv_financeiro', status: 'em_preparacao', totalLinhas, totalValidas: 0, totalPendentes: 0, totalConfirmadas: 0, createdAt: now, updatedAt: now };
}

export type StatusPacoteConfirmacaoHistorica = 'congelado' | 'confirmando' | 'confirmado' | 'falha_confirmacao' | 'desfeito';

export interface ItemPacoteConfirmacaoHistorica {
  registroTransacaoId: string;
  linha: number;
  assinatura: string;
  stagingSnapshot: RegistroImportacaoTransacao;
  financeirosSnapshot: RegistroImportacaoFinanceira[];
}

export interface ArtefatosPacoteConfirmacaoHistorica {
  transacaoIds: string[];
  pagamentoIds: string[];
  movimentoIds: string[];
}

export interface ResumoProtegidoPacoteConfirmacaoHistorica {
  totalTransacoes?: number;
  totalPagamentos?: number;
  totalMovimentos?: number;
  registrosIgnorados?: number;
  registrosBloqueados?: number;
  faturamentoTotal?: number;
  custoTotal?: number;
  lucroTotal?: number;
  valorPagoTotal?: number;
  valorPendenteTotal?: number;
  primeiraData?: string;
  ultimaData?: string;
}

export interface PacoteConfirmacaoHistoricaPayloadProtegido {
  planejadas: ItemPacoteConfirmacaoHistorica[];
  bloqueios: string[];
  avisos: string[];
  artefatosCriados: ArtefatosPacoteConfirmacaoHistorica;
  resumoProtegido?: ResumoProtegidoPacoteConfirmacaoHistorica;
}

export interface PacoteConfirmacaoHistorica extends Entity {
  previaId: string;
  loteConfirmacaoId: string;
  status: StatusPacoteConfirmacaoHistorica;
  assinaturaPacote: string;
  totalTransacoes: number;
  totalPagamentos: number;
  totalMovimentos: number;
  registrosIgnorados: number;
  registrosBloqueados: number;
  faturamentoTotal: number;
  custoTotal: number;
  lucroTotal: number;
  valorPagoTotal: number;
  valorPendenteTotal: number;
  primeiraData?: string;
  ultimaData?: string;
  confirmadoEm?: string;
  falhaMensagem?: string;
  desfeitoEm?: string;
  payloadProtegido?: PacoteConfirmacaoHistoricaPayloadProtegido;
}

export interface PacoteConfirmacaoHistoricaRecord extends Entity {
  previaId: string;
  loteConfirmacaoId: string;
  status: StatusPacoteConfirmacaoHistorica;
  assinaturaPacote: string;
  totalTransacoes?: number;
  totalPagamentos?: number;
  totalMovimentos?: number;
  registrosIgnorados?: number;
  registrosBloqueados?: number;
  faturamentoTotal?: number;
  custoTotal?: number;
  lucroTotal?: number;
  valorPagoTotal?: number;
  valorPendenteTotal?: number;
  primeiraData?: string;
  ultimaData?: string;
  confirmadoEm?: string;
  falhaMensagem?: string;
  desfeitoEm?: string;
  payloadProtegido: string;
}
