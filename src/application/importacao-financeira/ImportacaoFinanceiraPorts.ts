import type {
  AuditoriaRegistroImportacao,
  EscopoImportacaoFinanceira,
  LoteImportacaoFinanceira,
  PlanoArtefatoOficial,
  PreviaConfirmacaoImportacao,
  RegistroImportacaoFinanceira,
  ResultadoEscritaArtefatoOficial
} from '../../domain/importacao-financeira/ImportacaoFinanceira';

export interface ImportacaoFinanceiraStore {
  findLoteByRequestId(usuarioId: string, requestId: string): Promise<LoteImportacaoFinanceira | null>;
  getLote(scope: EscopoImportacaoFinanceira): Promise<LoteImportacaoFinanceira | null>;
  saveLote(lote: LoteImportacaoFinanceira): Promise<LoteImportacaoFinanceira>;
  listRegistros(scope: EscopoImportacaoFinanceira): Promise<RegistroImportacaoFinanceira[]>;
  getRegistro(scope: EscopoImportacaoFinanceira, registroId: string): Promise<RegistroImportacaoFinanceira | null>;
  saveRegistro(registro: RegistroImportacaoFinanceira): Promise<RegistroImportacaoFinanceira>;
  findRegistroByFingerprint(scope: EscopoImportacaoFinanceira, fingerprint: string): Promise<RegistroImportacaoFinanceira | null>;
  getPrevia(scope: EscopoImportacaoFinanceira, previaId: string): Promise<PreviaConfirmacaoImportacao | null>;
  savePrevia(previa: PreviaConfirmacaoImportacao): Promise<PreviaConfirmacaoImportacao>;
  appendAuditoria(entry: AuditoriaRegistroImportacao): Promise<void>;
  listAuditoria(scope: EscopoImportacaoFinanceira): Promise<AuditoriaRegistroImportacao[]>;
}

export interface CatalogoImportacaoFinanceiraPort {
  encontrarPerfilId(usuarioId: string, nome: string): Promise<string | null>;
  validarItens(usuarioId: string, descricao: string): Promise<string[]>;
}

export interface ParsedImportacaoRow {
  tipo: 'transacao' | 'financeiro';
  linha: number;
  dadosBrutos: Record<string, string>;
  dadosNormalizados: Record<string, unknown>;
}

export interface ImportacaoFinanceiraParserPort {
  parseTransacoes(conteudo: string): ParsedImportacaoRow[];
  parseFinanceiro(conteudo: string): ParsedImportacaoRow[];
}

export interface OfficialImportWriter {
  readonly atomicity: 'transactional' | 'compensating';
  write(scope: EscopoImportacaoFinanceira, plan: PlanoArtefatoOficial): Promise<ResultadoEscritaArtefatoOficial>;
  rollback(scope: EscopoImportacaoFinanceira, artifactIds: { transacaoIds: string[]; pagamentoIds: string[]; movimentoIds: string[] }): Promise<void>;
}

export interface ImportacaoConcurrencyPort {
  runExclusive<T>(key: string, operation: () => Promise<T>): Promise<T>;
}
