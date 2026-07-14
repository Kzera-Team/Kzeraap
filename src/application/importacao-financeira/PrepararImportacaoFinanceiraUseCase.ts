import type { Clock } from '../../core/Clock';
import {
  ImportacaoFinanceiraError,
  type LoteImportacaoFinanceira,
  type MovimentoImportadoNormalizado,
  type PendenciaImportacaoFinanceira,
  type RegistroImportacaoFinanceira,
  type TransacaoImportadaNormalizada
} from '../../domain/importacao-financeira/ImportacaoFinanceira';
import { fingerprintRegistro } from '../../domain/importacao-financeira/ImportacaoFinanceiraInvariants';
import type {
  CatalogoImportacaoFinanceiraPort,
  ImportacaoFinanceiraParserPort,
  ImportacaoFinanceiraStore,
  ParsedImportacaoRow
} from './ImportacaoFinanceiraPorts';

export interface PrepararImportacaoFinanceiraInput {
  usuarioId: string;
  requestId: string;
  transacoes?: { nomeArquivo: string; conteudo: string };
  financeiro?: { nomeArquivo: string; conteudo: string };
}

export interface PrepararImportacaoFinanceiraOutput {
  lote: LoteImportacaoFinanceira;
  registros: RegistroImportacaoFinanceira[];
  reutilizado: boolean;
}

export class PrepararImportacaoFinanceiraUseCase {
  constructor(
    private readonly store: ImportacaoFinanceiraStore,
    private readonly parser: ImportacaoFinanceiraParserPort,
    private readonly catalogo: CatalogoImportacaoFinanceiraPort,
    private readonly clock: Clock,
    private readonly idFactory: (prefix: string) => string
  ) {}

  async execute(input: PrepararImportacaoFinanceiraInput): Promise<PrepararImportacaoFinanceiraOutput> {
    if (!input.usuarioId.trim()) throw new ImportacaoFinanceiraError('USUARIO_OBRIGATORIO', 'Usuária obrigatória.');
    if (!input.requestId.trim()) throw new ImportacaoFinanceiraError('REQUEST_ID_OBRIGATORIO', 'requestId obrigatório para idempotência.');
    if (!input.transacoes && !input.financeiro) throw new ImportacaoFinanceiraError('ARQUIVO_OBRIGATORIO', 'Informe ao menos um arquivo de importação.');

    const existing = await this.store.findLoteByRequestId(input.usuarioId, input.requestId);
    if (existing) return { lote: existing, registros: await this.store.listRegistros(existing), reutilizado: true };

    const now = this.clock.now().toISOString();
    const loteId = this.idFactory('lote-importacao-financeira');
    const parsed = [
      ...(input.transacoes ? this.parser.parseTransacoes(input.transacoes.conteudo) : []),
      ...(input.financeiro ? this.parser.parseFinanceiro(input.financeiro.conteudo) : [])
    ];
    const lote: LoteImportacaoFinanceira = {
      id: loteId,
      loteId,
      usuarioId: input.usuarioId,
      requestId: input.requestId,
      status: 'preparando',
      totalRegistros: parsed.length,
      totalPendentes: 0,
      totalValidos: 0,
      totalConfirmados: 0,
      createdAt: now,
      updatedAt: now,
      ...(input.transacoes ? { nomeArquivoTransacoes: input.transacoes.nomeArquivo } : {}),
      ...(input.financeiro ? { nomeArquivoFinanceiro: input.financeiro.nomeArquivo } : {})
    };
    await this.store.saveLote(lote);

    const registros: RegistroImportacaoFinanceira[] = [];
    for (const row of parsed) {
      const registro = await this.toRegistro(lote, row, now);
      const duplicate = await this.store.findRegistroByFingerprint(lote, registro.fingerprint);
      if (duplicate) { registros.push(duplicate); continue; }
      registros.push(await this.store.saveRegistro(registro));
      await this.store.appendAuditoria({ id: this.idFactory('audit-importacao'), usuarioId: lote.usuarioId, loteId: lote.loteId, operacao: 'preparacao', registroId: registro.id, depois: registro, createdAt: now, updatedAt: now });
    }

    const totalPendentes = registros.filter(item => item.status !== 'validado').length;
    const finalLote = await this.store.saveLote({
      ...lote,
      status: totalPendentes ? 'pendente' : 'pronto',
      totalPendentes,
      totalValidos: registros.length - totalPendentes,
      updatedAt: this.clock.now().toISOString()
    });
    return { lote: finalLote, registros, reutilizado: false };
  }

  private async toRegistro(lote: LoteImportacaoFinanceira, row: ParsedImportacaoRow, now: string): Promise<RegistroImportacaoFinanceira> {
    const pendencias: PendenciaImportacaoFinanceira[] = [];
    if (row.tipo === 'transacao') {
      const data = row.dadosNormalizados as unknown as TransacaoImportadaNormalizada;
      if (!data.clienteNome) pendencias.push({ codigo: 'campo_obrigatorio', campo: 'Cliente', mensagem: 'Cliente obrigatório.' });
      if (data.total <= 0) pendencias.push({ codigo: 'valor_invalido', campo: 'Total', mensagem: 'Total precisa ser maior que zero.' });
      if (data.clienteNome) {
        const perfilId = await this.catalogo.encontrarPerfilId(lote.usuarioId, data.clienteNome);
        if (perfilId) data.perfilId = perfilId;
        else pendencias.push({ codigo: 'perfil_nao_encontrado', mensagem: `Perfil não encontrado: ${data.clienteNome}` });
      }
      for (const item of await this.catalogo.validarItens(lote.usuarioId, data.descricao || '')) pendencias.push({ codigo: 'item_nao_encontrado', mensagem: item });
    } else {
      const data = row.dadosNormalizados as unknown as MovimentoImportadoNormalizado;
      if (!data.clienteNome) pendencias.push({ codigo: 'campo_obrigatorio', campo: 'Cliente', mensagem: 'Cliente obrigatório.' });
      if ((data.valorPago || data.valor) <= 0) pendencias.push({ codigo: 'valor_invalido', campo: 'Valor', mensagem: 'Valor precisa ser maior que zero.' });
      if (data.clienteNome) {
        const perfilId = await this.catalogo.encontrarPerfilId(lote.usuarioId, data.clienteNome);
        if (perfilId) data.perfilId = perfilId;
        else pendencias.push({ codigo: 'perfil_nao_encontrado', mensagem: `Perfil não encontrado: ${data.clienteNome}` });
      }
    }

    return {
      id: this.idFactory(`registro-${row.tipo}`),
      usuarioId: lote.usuarioId,
      loteId: lote.loteId,
      tipo: row.tipo,
      linha: row.linha,
      fingerprint: fingerprintRegistro(row.tipo, row.dadosNormalizados),
      dadosBrutos: row.dadosBrutos,
      dadosNormalizados: row.dadosNormalizados as never,
      status: pendencias.length ? 'pendente' : 'validado',
      pendencias,
      createdAt: now,
      updatedAt: now
    };
  }
}
