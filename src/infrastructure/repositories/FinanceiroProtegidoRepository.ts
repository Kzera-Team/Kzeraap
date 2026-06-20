import type { Repository } from '../../application/ports/Repository';
import { PayloadProvider } from '../../runtime/PayloadProvider';
import { releaseObject } from '../../runtime/RuntimeCleanup';
import type { SessionContext } from '../../runtime/SessionContext';
import type { ContaFinanceira, MovimentoFinanceiro, PagamentoTransacao, TransacaoFinanceira } from '../../domain/financeiro/Financeiro';

type FinanceiroProtegidoPayload<T extends { id: string }> = T;

export interface FinanceiroProtegidoRecord extends Record<string, unknown> {
  id: string;
  tipoRegistro: 'conta_financeira' | 'movimento_financeiro' | 'pagamento_transacao' | 'transacao_financeira';
  payloadProtegido: string;
  loteConfirmacaoId?: string;
  status?: string;
  origem?: string;
  createdAt: string;
  updatedAt: string;
}

function toRecord<T extends { id: string; createdAt: string; updatedAt: string; loteConfirmacaoId?: string; status?: string; origem?: string }>(
  entity: T,
  payloadProtegido: string,
  tipoRegistro: FinanceiroProtegidoRecord['tipoRegistro']
): FinanceiroProtegidoRecord {
  const record: FinanceiroProtegidoRecord = {
    id: entity.id,
    tipoRegistro,
    payloadProtegido,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt
  };
  if (entity.loteConfirmacaoId) record.loteConfirmacaoId = entity.loteConfirmacaoId;
  if (entity.status) record.status = entity.status;
  if (entity.origem) record.origem = entity.origem;
  return record;
}

export class FinanceiroProtegidoRepository<T extends ContaFinanceira | MovimentoFinanceiro | PagamentoTransacao | TransacaoFinanceira> implements Repository<T> {
  private readonly crypto: PayloadProvider;

  constructor(
    private readonly records: Repository<FinanceiroProtegidoRecord>,
    private readonly session: SessionContext,
    private readonly tipoRegistro: FinanceiroProtegidoRecord['tipoRegistro']
  ) {
    this.crypto = new PayloadProvider(session);
  }

  private context(id: string): string {
    return `financeiro-oficial:${this.tipoRegistro}:${id}`;
  }

  async save(entity: T): Promise<T> {
    this.session.touch();
    const payloadProtegido = await this.crypto.packJson<FinanceiroProtegidoPayload<T>>(entity, this.context(entity.id));
    await this.records.save(toRecord(entity, payloadProtegido, this.tipoRegistro));
    return entity;
  }

  async getById(id: string): Promise<T | null> {
    this.session.touch();
    const record = await this.records.getById(id);
    if (!record) return null;
    const payload = await this.crypto.unpackJson<FinanceiroProtegidoPayload<T>>(record.payloadProtegido, this.context(record.id));
    try {
      return payload;
    } finally {
      releaseObject(payload);
    }
  }

  async list(): Promise<T[]> {
    this.session.touch();
    const records = await this.records.list();
    return Promise.all(records.map(async record => {
      const payload = await this.crypto.unpackJson<FinanceiroProtegidoPayload<T>>(record.payloadProtegido, this.context(record.id));
      try {
        return payload;
      } finally {
        releaseObject(payload);
      }
    }));
  }

  async remove(id: string): Promise<void> {
    this.session.touch();
    if (!this.records.remove) throw new Error('Repositório financeiro protegido não permite remoção segura.');
    await this.records.remove(id);
  }
}
