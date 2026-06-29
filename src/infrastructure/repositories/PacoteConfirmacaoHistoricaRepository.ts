import type { Repository } from '../../application/ports/Repository';
import { PayloadProvider } from '../../runtime/PayloadProvider';
import { releaseObject } from '../../runtime/RuntimeCleanup';
import type { SessionContext } from '../../runtime/SessionContext';
import type {
  PacoteConfirmacaoHistorica,
  PacoteConfirmacaoHistoricaPayloadProtegido,
  PacoteConfirmacaoHistoricaRecord,
  ResumoProtegidoPacoteConfirmacaoHistorica
} from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

function resumoProtegido(pacote: PacoteConfirmacaoHistorica): ResumoProtegidoPacoteConfirmacaoHistorica {
  const resumo: ResumoProtegidoPacoteConfirmacaoHistorica = {
    totalTransacoes: pacote.totalTransacoes,
    totalPagamentos: pacote.totalPagamentos,
    totalMovimentos: pacote.totalMovimentos,
    registrosIgnorados: pacote.registrosIgnorados,
    registrosBloqueados: pacote.registrosBloqueados,
    faturamentoTotal: pacote.faturamentoTotal,
    custoTotal: pacote.custoTotal,
    lucroTotal: pacote.lucroTotal,
    valorPagoTotal: pacote.valorPagoTotal,
    valorPendenteTotal: pacote.valorPendenteTotal
  };
  if (pacote.primeiraData) resumo.primeiraData = pacote.primeiraData;
  if (pacote.ultimaData) resumo.ultimaData = pacote.ultimaData;
  return resumo;
}

function toRecord(pacote: PacoteConfirmacaoHistorica, payloadProtegido: string): PacoteConfirmacaoHistoricaRecord {
  const record: PacoteConfirmacaoHistoricaRecord = {
    id: pacote.id,
    previaId: pacote.previaId,
    loteConfirmacaoId: pacote.loteConfirmacaoId,
    status: pacote.status,
    assinaturaPacote: pacote.assinaturaPacote,
    payloadProtegido,
    createdAt: pacote.createdAt,
    updatedAt: pacote.updatedAt
  };
  if (pacote.confirmadoEm) record.confirmadoEm = pacote.confirmadoEm;
  if (pacote.falhaMensagem) record.falhaMensagem = pacote.falhaMensagem;
  if (pacote.desfeitoEm) record.desfeitoEm = pacote.desfeitoEm;
  return record;
}

function fromLegacyNumber(value: number | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function mergeRecord(record: PacoteConfirmacaoHistoricaRecord, payload: PacoteConfirmacaoHistoricaPayloadProtegido): PacoteConfirmacaoHistorica {
  const resumo = payload.resumoProtegido || {
    totalTransacoes: fromLegacyNumber(record.totalTransacoes),
    totalPagamentos: fromLegacyNumber(record.totalPagamentos),
    totalMovimentos: fromLegacyNumber(record.totalMovimentos),
    registrosIgnorados: fromLegacyNumber(record.registrosIgnorados),
    registrosBloqueados: fromLegacyNumber(record.registrosBloqueados),
    faturamentoTotal: fromLegacyNumber(record.faturamentoTotal),
    custoTotal: fromLegacyNumber(record.custoTotal),
    lucroTotal: fromLegacyNumber(record.lucroTotal),
    valorPagoTotal: fromLegacyNumber(record.valorPagoTotal),
    valorPendenteTotal: fromLegacyNumber(record.valorPendenteTotal),
    primeiraData: record.primeiraData,
    ultimaData: record.ultimaData
  };
  const pacote: PacoteConfirmacaoHistorica = {
    id: record.id,
    previaId: record.previaId,
    loteConfirmacaoId: record.loteConfirmacaoId,
    status: record.status,
    assinaturaPacote: record.assinaturaPacote,
    totalTransacoes: fromLegacyNumber(resumo.totalTransacoes),
    totalPagamentos: fromLegacyNumber(resumo.totalPagamentos),
    totalMovimentos: fromLegacyNumber(resumo.totalMovimentos),
    registrosIgnorados: fromLegacyNumber(resumo.registrosIgnorados),
    registrosBloqueados: fromLegacyNumber(resumo.registrosBloqueados),
    faturamentoTotal: fromLegacyNumber(resumo.faturamentoTotal),
    custoTotal: fromLegacyNumber(resumo.custoTotal),
    lucroTotal: fromLegacyNumber(resumo.lucroTotal),
    valorPagoTotal: fromLegacyNumber(resumo.valorPagoTotal),
    valorPendenteTotal: fromLegacyNumber(resumo.valorPendenteTotal),
    payloadProtegido: structuredClone(payload),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
  if (resumo.primeiraData) pacote.primeiraData = resumo.primeiraData;
  if (resumo.ultimaData) pacote.ultimaData = resumo.ultimaData;
  if (record.confirmadoEm) pacote.confirmadoEm = record.confirmadoEm;
  if (record.falhaMensagem) pacote.falhaMensagem = record.falhaMensagem;
  if (record.desfeitoEm) pacote.desfeitoEm = record.desfeitoEm;
  return pacote;
}

export class PacoteConfirmacaoHistoricaRepository implements Repository<PacoteConfirmacaoHistorica> {
  private readonly crypto: PayloadProvider;

  constructor(
    private readonly records: Repository<PacoteConfirmacaoHistoricaRecord>,
    private readonly session: SessionContext
  ) {
    this.crypto = new PayloadProvider(session);
  }

  private context(id: string): string {
    return `pacote-confirmacao-historica:${id}`;
  }

  async save(pacote: PacoteConfirmacaoHistorica): Promise<PacoteConfirmacaoHistorica> {
    this.session.touch();
    const basePayload = pacote.payloadProtegido || { planejadas: [], bloqueios: [], avisos: [], artefatosCriados: { transacaoIds: [], pagamentoIds: [], movimentoIds: [] } };
    const payload: PacoteConfirmacaoHistoricaPayloadProtegido = {
      ...basePayload,
      resumoProtegido: resumoProtegido(pacote)
    };
    const payloadProtegido = await this.crypto.packJson<PacoteConfirmacaoHistoricaPayloadProtegido>(payload, this.context(pacote.id));
    await this.records.save(toRecord({ ...pacote, payloadProtegido: payload }, payloadProtegido));
    return { ...pacote, payloadProtegido: payload };
  }

  async getById(id: string): Promise<PacoteConfirmacaoHistorica | null> {
    this.session.touch();
    const record = await this.records.getById(id);
    if (!record) return null;
    const payload = await this.crypto.unpackJson<PacoteConfirmacaoHistoricaPayloadProtegido>(record.payloadProtegido, this.context(record.id));
    try {
      return mergeRecord(record, payload);
    } finally {
      releaseObject(payload);
    }
  }

  async list(): Promise<PacoteConfirmacaoHistorica[]> {
    this.session.touch();
    const records = await this.records.list();
    return Promise.all(records.map(async record => {
      const payload = await this.crypto.unpackJson<PacoteConfirmacaoHistoricaPayloadProtegido>(record.payloadProtegido, this.context(record.id));
      try {
        return mergeRecord(record, payload);
      } finally {
        releaseObject(payload);
      }
    }));
  }

  async remove(id: string): Promise<void> {
    this.session.touch();
    if (!this.records.remove) throw new Error('Repositório de pacote histórico não permite remoção segura.');
    await this.records.remove(id);
  }
}
