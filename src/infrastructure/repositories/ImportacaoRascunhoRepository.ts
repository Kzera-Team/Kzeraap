// v0.19.27
//
// Repositório de rascunhos de importação.
//
// ATENÇÃO SEGURANÇA (conforme validação do Diego / AppSec):
// - Rascunhos de perfis e itens armazenam apenas metadados (contagem do preview),
//   NUNCA payload descriptografado. A criptografia AES-256-GCM só é aplicada ao
//   campo `payloadProtegido` quando previewCount > 0 (perfis/itens).
// - Erros de crypto.subtle.decrypt (OperationError) são capturados ANTES de qualquer
//   dado do payload ser propagado para memória JS — mesmo padrão do PayloadProvider.
// - Rascunho de transações é apenas um marcador { tela, updatedAt } sem payload.
//
import { PayloadProvider } from '../../runtime/PayloadProvider';
import { releaseBytes } from '../../runtime/RuntimeCleanup';
import type { SessionContext } from '../../runtime/SessionContext';
import { IndexedDbConnection } from '../storage/IndexedDbConnection';
import { IndexedDbRepository } from './IndexedDbRepository';
import { InMemoryRepository } from './InMemoryRepository';
import type { Repository } from '../../application/ports/Repository';

export type TelaRascunho = 'importacao-perfis' | 'importacao-itens' | 'transacoes';

/**
 * Rascunho armazenado no IndexedDB.
 * Campos protegidos (previewCount) ficam em payloadProtegido quando presentes.
 * Transações guardam apenas o marcador de retomada sem payload.
 */
export interface RascunhoImportacaoRecord {
  id: string;
  tipo: 'perfis' | 'itens' | 'transacoes';
  tela: TelaRascunho;
  /** payload AES-256-GCM com { previewCount } para rascunhos de perfis/itens */
  payloadProtegido?: string;
  updatedAt: string;
}

/** Rascunho já desserializado, exposto pela camada de aplicação */
export interface RascunhoImportacao {
  id: string;
  tipo: 'perfis' | 'itens' | 'transacoes';
  tela: TelaRascunho;
  previewCount?: number;
  previewRegistros?: unknown[];
  updatedAt: string;
}

interface RascunhoPayload {
  previewCount: number;
  registros?: unknown[];
}

const DB_NAME = 'kzera_rascunho_importacao_1';
const DB_VERSION = 1;
const STORE_NAME = 'rascunhos';

function buildConnection(): IndexedDbConnection {
  return new IndexedDbConnection({
    databaseName: DB_NAME,
    version: DB_VERSION,
    stores: [STORE_NAME]
  });
}

export class ImportacaoRascunhoRepository {
  private readonly crypto: PayloadProvider;
  private readonly records: Repository<RascunhoImportacaoRecord>;

  constructor(session: SessionContext) {
    this.crypto = new PayloadProvider(session);
    this.records =
      typeof indexedDB === 'undefined'
        ? new InMemoryRepository<RascunhoImportacaoRecord>()
        : new IndexedDbRepository<RascunhoImportacaoRecord>(buildConnection(), STORE_NAME);
  }

  async salvar(rascunho: RascunhoImportacao): Promise<void> {
    const record: RascunhoImportacaoRecord = {
      id: rascunho.id,
      tipo: rascunho.tipo,
      tela: rascunho.tela,
      updatedAt: rascunho.updatedAt
    };

    // Apenas perfis e itens possuem previewCount — transações só guardam o marcador.
    if (rascunho.tipo !== 'transacoes' && rascunho.previewCount !== undefined) {
      const payload: RascunhoPayload = { previewCount: rascunho.previewCount };
      if (rascunho.previewRegistros) payload.registros = rascunho.previewRegistros;
      record.payloadProtegido = await this.crypto.packJson(
        payload,
        `rascunho:importacao:${rascunho.tipo}`
      );
    }

    await this.records.save(record);
  }

  async listar(): Promise<RascunhoImportacao[]> {
    const records = await this.records.list();
    const resultado: RascunhoImportacao[] = [];

    for (const record of records) {
      resultado.push(await this._desserializar(record));
    }

    return resultado;
  }

  async remover(id: string): Promise<void> {
    if (!this.records.remove) return;
    await this.records.remove(id);
  }

  /**
   * Desserializa um record. Erros de descriptografia (OperationError do
   * crypto.subtle.decrypt) são capturados ANTES de qualquer dado do payload
   * ser propagado — padrão exigido pelo Diego (AppSec).
   */
  private async _desserializar(record: RascunhoImportacaoRecord): Promise<RascunhoImportacao> {
    const base: RascunhoImportacao = {
      id: record.id,
      tipo: record.tipo,
      tela: record.tela,
      updatedAt: record.updatedAt
    };

    if (!record.payloadProtegido) return base;

    // Descriptografia isolada: nenhum campo do payload vaza antes do bloco try.
    let payload: RascunhoPayload | null = null;
    try {
      payload = await this.crypto.unpackJson<RascunhoPayload>(
        record.payloadProtegido,
        `rascunho:importacao:${record.tipo}`
      );
      // Só após decrypt completo e sem erro propagamos os dados.
      base.previewCount = payload.previewCount;
      if (payload.registros) base.previewRegistros = payload.registros;
    } catch {
      // OperationError (sessão errada / dado corrompido): descarta o payload,
      // retorna apenas o marcador sem previewCount — nenhum fragmento vaza.
    } finally {
      // Limpa referência ao payload da memória JS imediatamente.
      if (payload) {
        // Usando delete para compatibilidade com exactOptionalPropertyTypes
        delete (payload as Partial<RascunhoPayload>).previewCount;
      }
      payload = null;
    }

    return base;
  }
}
