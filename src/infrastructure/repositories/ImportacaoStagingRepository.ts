import type { Repository } from '../../application/ports/Repository';
import { PayloadProvider } from '../../runtime/PayloadProvider';
import { releaseObject } from '../../runtime/RuntimeCleanup';
import type { SessionContext } from '../../runtime/SessionContext';
import type {
  RegistroImportacaoFinanceira,
  RegistroImportacaoFinanceiraPayloadProtegido,
  RegistroImportacaoFinanceiraRecord,
  RegistroImportacaoTransacao,
  RegistroImportacaoTransacaoPayloadProtegido,
  RegistroImportacaoTransacaoRecord,
  TipoPendenciaImportacao
} from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

function tiposPendencia(pendencias: Array<{ tipo: TipoPendenciaImportacao }>): TipoPendenciaImportacao[] {
  return Array.from(new Set(pendencias.filter(p => p).map(p => p.tipo)));
}

function toTransacaoRecord(registro: RegistroImportacaoTransacao, payloadProtegido: string): RegistroImportacaoTransacaoRecord {
  const record: RegistroImportacaoTransacaoRecord = {
    id: registro.id,
    loteImportacaoId: registro.loteImportacaoId,
    linha: registro.linha,
    status: registro.status,
    tiposPendencia: tiposPendencia(registro.pendencias),
    payloadProtegido,
    createdAt: registro.createdAt,
    updatedAt: registro.updatedAt
  };
  if (registro.numeroOriginal) record.numeroOriginal = registro.numeroOriginal;
  if (registro.perfilIdResolvido) record.perfilIdResolvido = registro.perfilIdResolvido;
  if (registro.transacaoFinanceiraId) record.transacaoFinanceiraId = registro.transacaoFinanceiraId;
  if (registro.financeiroStagingIdsResolvidos?.length) record.financeiroStagingIdsResolvidos = [...registro.financeiroStagingIdsResolvidos];
  if (registro.resolucaoConciliacao) record.resolucaoConciliacao = registro.resolucaoConciliacao;
  if (registro.confirmacaoPreviaId) record.confirmacaoPreviaId = registro.confirmacaoPreviaId;
  if (registro.confirmacaoAssinatura) record.confirmacaoAssinatura = registro.confirmacaoAssinatura;
  if (registro.loteConfirmacaoId) record.loteConfirmacaoId = registro.loteConfirmacaoId;
  return record;
}

function mergeTransacaoPayload(record: RegistroImportacaoTransacaoRecord, payload: RegistroImportacaoTransacaoPayloadProtegido): RegistroImportacaoTransacao {
  const registro: RegistroImportacaoTransacao = {
    id: record.id,
    loteImportacaoId: record.loteImportacaoId,
    linha: record.linha,
    dadosBrutos: payload.dadosBrutos,
    status: record.status,
    pendencias: payload.pendencias,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
  if (record.numeroOriginal) registro.numeroOriginal = record.numeroOriginal;
  if (payload.dadosNormalizados) registro.dadosNormalizados = structuredClone(payload.dadosNormalizados);
  if (payload.clienteNomeImportado) registro.clienteNomeImportado = payload.clienteNomeImportado;
  if (record.perfilIdResolvido) registro.perfilIdResolvido = record.perfilIdResolvido;
  if (record.transacaoFinanceiraId) registro.transacaoFinanceiraId = record.transacaoFinanceiraId;
  if (record.financeiroStagingIdsResolvidos?.length) registro.financeiroStagingIdsResolvidos = [...record.financeiroStagingIdsResolvidos];
  if (record.resolucaoConciliacao) registro.resolucaoConciliacao = record.resolucaoConciliacao;
  if (record.confirmacaoPreviaId) registro.confirmacaoPreviaId = record.confirmacaoPreviaId;
  if (record.confirmacaoAssinatura) registro.confirmacaoAssinatura = record.confirmacaoAssinatura;
  if (record.loteConfirmacaoId) registro.loteConfirmacaoId = record.loteConfirmacaoId;
  return registro;
}

function toFinanceiroRecord(registro: RegistroImportacaoFinanceira, payloadProtegido: string): RegistroImportacaoFinanceiraRecord {
  const record: RegistroImportacaoFinanceiraRecord = {
    id: registro.id,
    loteImportacaoId: registro.loteImportacaoId,
    linha: registro.linha,
    status: registro.status,
    tiposPendencia: tiposPendencia(registro.pendencias),
    payloadProtegido,
    createdAt: registro.createdAt,
    updatedAt: registro.updatedAt
  };
  if (registro.perfilIdResolvido) record.perfilIdResolvido = registro.perfilIdResolvido;
  if (registro.numeroTransacaoReferenciado) record.numeroTransacaoReferenciado = registro.numeroTransacaoReferenciado;
  if (registro.movimentoFinanceiroId) record.movimentoFinanceiroId = registro.movimentoFinanceiroId;
  if (registro.transacaoStagingIdResolvida) record.transacaoStagingIdResolvida = registro.transacaoStagingIdResolvida;
  if (registro.resolucaoConciliacao) record.resolucaoConciliacao = registro.resolucaoConciliacao;
  if (registro.confirmacaoPreviaId) record.confirmacaoPreviaId = registro.confirmacaoPreviaId;
  if (registro.loteConfirmacaoId) record.loteConfirmacaoId = registro.loteConfirmacaoId;
  return record;
}

function mergeFinanceiroPayload(record: RegistroImportacaoFinanceiraRecord, payload: RegistroImportacaoFinanceiraPayloadProtegido): RegistroImportacaoFinanceira {
  const registro: RegistroImportacaoFinanceira = {
    id: record.id,
    loteImportacaoId: record.loteImportacaoId,
    linha: record.linha,
    dadosBrutos: payload.dadosBrutos,
    status: record.status,
    pendencias: payload.pendencias,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
  if (payload.dadosNormalizados) registro.dadosNormalizados = structuredClone(payload.dadosNormalizados);
  if (payload.clienteNomeImportado) registro.clienteNomeImportado = payload.clienteNomeImportado;
  if (record.perfilIdResolvido) registro.perfilIdResolvido = record.perfilIdResolvido;
  if (record.numeroTransacaoReferenciado) registro.numeroTransacaoReferenciado = record.numeroTransacaoReferenciado;
  if (record.movimentoFinanceiroId) registro.movimentoFinanceiroId = record.movimentoFinanceiroId;
  if (record.transacaoStagingIdResolvida) registro.transacaoStagingIdResolvida = record.transacaoStagingIdResolvida;
  if (record.resolucaoConciliacao) registro.resolucaoConciliacao = record.resolucaoConciliacao;
  if (record.confirmacaoPreviaId) registro.confirmacaoPreviaId = record.confirmacaoPreviaId;
  if (record.loteConfirmacaoId) registro.loteConfirmacaoId = record.loteConfirmacaoId;
  return registro;
}

export class RegistroImportacaoTransacaoRepository implements Repository<RegistroImportacaoTransacao> {
  private readonly crypto: PayloadProvider;

  constructor(
    private readonly records: Repository<RegistroImportacaoTransacaoRecord>,
    private readonly session: SessionContext
  ) {
    this.crypto = new PayloadProvider(session);
  }

  async save(registro: RegistroImportacaoTransacao): Promise<RegistroImportacaoTransacao> {
    this.session.touch();
    const payload: RegistroImportacaoTransacaoPayloadProtegido = {
      dadosBrutos: registro.dadosBrutos,
      pendencias: registro.pendencias
    };
    if (registro.dadosNormalizados) payload.dadosNormalizados = registro.dadosNormalizados;
    if (registro.clienteNomeImportado) payload.clienteNomeImportado = registro.clienteNomeImportado;
    const payloadProtegido = await this.crypto.packJson(payload, `importacao:transacao:${registro.id}`);
    await this.records.save(toTransacaoRecord(registro, payloadProtegido));
    return registro;
  }

  async getById(id: string): Promise<RegistroImportacaoTransacao | null> {
    this.session.touch();
    const record = await this.records.getById(id);
    if (!record) return null;
    const payload = await this.crypto.unpackJson<RegistroImportacaoTransacaoPayloadProtegido>(record.payloadProtegido, `importacao:transacao:${record.id}`);
    try {
      return mergeTransacaoPayload(record, payload);
    } finally {
      releaseObject(payload);
    }
  }

  async list(): Promise<RegistroImportacaoTransacao[]> {
    this.session.touch();
    const records = await this.records.list();
    return Promise.all(records.map(async record => {
      const payload = await this.crypto.unpackJson<RegistroImportacaoTransacaoPayloadProtegido>(record.payloadProtegido, `importacao:transacao:${record.id}`);
      try {
        return mergeTransacaoPayload(record, payload);
      } finally {
        releaseObject(payload);
      }
    }));
  }

  async remove(id: string): Promise<void> {
    this.session.touch();
    if (!this.records.remove) throw new Error('Repositório de staging não permite remoção segura.');
    await this.records.remove(id);
  }
}

export class RegistroImportacaoFinanceiraRepository implements Repository<RegistroImportacaoFinanceira> {
  private readonly crypto: PayloadProvider;

  constructor(
    private readonly records: Repository<RegistroImportacaoFinanceiraRecord>,
    private readonly session: SessionContext
  ) {
    this.crypto = new PayloadProvider(session);
  }

  async save(registro: RegistroImportacaoFinanceira): Promise<RegistroImportacaoFinanceira> {
    this.session.touch();
    const payload: RegistroImportacaoFinanceiraPayloadProtegido = {
      dadosBrutos: registro.dadosBrutos,
      pendencias: registro.pendencias
    };
    if (registro.dadosNormalizados) payload.dadosNormalizados = registro.dadosNormalizados;
    if (registro.clienteNomeImportado) payload.clienteNomeImportado = registro.clienteNomeImportado;
    const payloadProtegido = await this.crypto.packJson(payload, `importacao:financeiro:${registro.id}`);
    await this.records.save(toFinanceiroRecord(registro, payloadProtegido));
    return registro;
  }

  async getById(id: string): Promise<RegistroImportacaoFinanceira | null> {
    this.session.touch();
    const record = await this.records.getById(id);
    if (!record) return null;
    const payload = await this.crypto.unpackJson<RegistroImportacaoFinanceiraPayloadProtegido>(record.payloadProtegido, `importacao:financeiro:${record.id}`);
    try {
      return mergeFinanceiroPayload(record, payload);
    } finally {
      releaseObject(payload);
    }
  }

  async list(): Promise<RegistroImportacaoFinanceira[]> {
    this.session.touch();
    const records = await this.records.list();
    return Promise.all(records.map(async record => {
      const payload = await this.crypto.unpackJson<RegistroImportacaoFinanceiraPayloadProtegido>(record.payloadProtegido, `importacao:financeiro:${record.id}`);
      try {
        return mergeFinanceiroPayload(record, payload);
      } finally {
        releaseObject(payload);
      }
    }));
  }

  async remove(id: string): Promise<void> {
    this.session.touch();
    if (!this.records.remove) throw new Error('Repositório de staging não permite remoção segura.');
    await this.records.remove(id);
  }
}
