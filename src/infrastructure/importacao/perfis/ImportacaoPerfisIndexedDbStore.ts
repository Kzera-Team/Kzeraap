import type { Repository } from '../../../application/ports/Repository';
import type { ImportacaoPerfisStore } from '../../../application/importacao/perfis/ImportacaoPerfisSeguraPorts';
import {
  ImportacaoPerfisDomainError,
  chaveEscopoImportacaoPerfis,
  escoposImportacaoPerfisIguais,
  type EscopoImportacaoPerfis,
  type ImportacaoPerfisAggregate
} from '../../../domain/importacao/perfis/ImportacaoPerfisSegura';
import { PayloadProvider } from '../../../runtime/PayloadProvider';
import type { SessionContext } from '../../../runtime/SessionContext';
import { IndexedDbConnection } from '../../storage/IndexedDbConnection';
import { IndexedDbRepository } from '../../repositories/IndexedDbRepository';
import { InMemoryRepository } from '../../repositories/InMemoryRepository';

interface ImportacaoPerfisRecord {
  id: string;
  usuarioId: string;
  importacaoId: string;
  loteId: string;
  origem: string;
  payloadProtegido: string;
  updatedAt: string;
}

const DATABASE_NAME = 'kzera_importacao_perfis_segura_1';
const DATABASE_VERSION = 1;
const STORE_NAME = 'importacoes_perfis';

function criarRecordsRepository(): Repository<ImportacaoPerfisRecord> {
  if (typeof indexedDB === 'undefined') {
    return new InMemoryRepository<ImportacaoPerfisRecord>();
  }

  const connection = new IndexedDbConnection({
    databaseName: DATABASE_NAME,
    version: DATABASE_VERSION,
    stores: [STORE_NAME]
  });
  return new IndexedDbRepository<ImportacaoPerfisRecord>(connection, STORE_NAME);
}

function aad(escopo: EscopoImportacaoPerfis): string {
  return `importacao:perfis:${chaveEscopoImportacaoPerfis(escopo)}`;
}

export class ImportacaoPerfisIndexedDbStore implements ImportacaoPerfisStore {
  private readonly crypto: PayloadProvider;
  private readonly records: Repository<ImportacaoPerfisRecord>;

  constructor(session: SessionContext) {
    this.crypto = new PayloadProvider(session);
    this.records = criarRecordsRepository();
  }

  async obter(escopo: EscopoImportacaoPerfis): Promise<ImportacaoPerfisAggregate | null> {
    const id = chaveEscopoImportacaoPerfis(escopo);
    const record = await this.records.getById(id);
    if (!record) return null;

    this.validarRecordNoEscopo(record, escopo);

    let aggregate: ImportacaoPerfisAggregate;
    try {
      aggregate = await this.crypto.unpackJson<ImportacaoPerfisAggregate>(
        record.payloadProtegido,
        aad(escopo)
      );
    } catch (error) {
      throw new ImportacaoPerfisDomainError(
        error instanceof Error
          ? `Falha ao abrir rascunho persistido: ${error.message}`
          : 'Falha ao abrir rascunho persistido.',
        'RASCUNHO_PERSISTIDO_INACESSIVEL'
      );
    }

    if (!escoposImportacaoPerfisIguais(aggregate.escopo, escopo)) {
      throw new ImportacaoPerfisDomainError(
        'O payload persistido pertence a outro escopo.',
        'VIOLACAO_ISOLAMENTO_IMPORTACAO'
      );
    }

    return aggregate;
  }

  async salvar(aggregate: ImportacaoPerfisAggregate): Promise<void> {
    const escopo = aggregate.escopo;
    const id = chaveEscopoImportacaoPerfis(escopo);
    if (aggregate.id !== id) {
      throw new ImportacaoPerfisDomainError(
        'Identificador do aggregate nao corresponde ao escopo.',
        'AGGREGATE_IMPORTACAO_FORA_DO_ESCOPO'
      );
    }

    const payloadProtegido = await this.crypto.packJson(aggregate, aad(escopo));
    await this.records.save({
      id,
      usuarioId: escopo.usuarioId,
      importacaoId: escopo.importacaoId,
      loteId: escopo.loteId,
      origem: escopo.origem,
      payloadProtegido,
      updatedAt: aggregate.atualizadaEm
    });
  }

  async remover(escopo: EscopoImportacaoPerfis): Promise<void> {
    const id = chaveEscopoImportacaoPerfis(escopo);
    const record = await this.records.getById(id);
    if (!record) return;
    this.validarRecordNoEscopo(record, escopo);

    if (!this.records.remove) {
      throw new ImportacaoPerfisDomainError(
        'Persistencia nao suporta remocao segura.',
        'REMOCAO_RASCUNHO_NAO_SUPORTADA'
      );
    }
    await this.records.remove(id);
  }

  private validarRecordNoEscopo(
    record: ImportacaoPerfisRecord,
    escopo: EscopoImportacaoPerfis
  ): void {
    const recordScope: EscopoImportacaoPerfis = {
      usuarioId: record.usuarioId,
      importacaoId: record.importacaoId,
      loteId: record.loteId,
      origem: record.origem
    };

    if (!escoposImportacaoPerfisIguais(recordScope, escopo)) {
      throw new ImportacaoPerfisDomainError(
        'Registro persistido pertence a outro usuario, lote, importacao ou origem.',
        'VIOLACAO_ISOLAMENTO_IMPORTACAO'
      );
    }
  }
}
