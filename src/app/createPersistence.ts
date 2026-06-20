import type { PerfilRecord } from '../runtime/PerfilPayloadFields';
import type { SessionContext } from '../runtime/SessionContext';
import { PerfilRepository } from '../infrastructure/repositories/PerfilRepository';
import { InMemoryRepository } from '../infrastructure/repositories/InMemoryRepository';
import { IndexedDbConnection } from '../infrastructure/storage/IndexedDbConnection';
import { IndexedDbRepository } from '../infrastructure/repositories/IndexedDbRepository';
import { TableObfuscator, type TableMapStore } from '../infrastructure/storage/TableObfuscator';

export interface PersistenceOptions {
  mode: 'memory' | 'indexeddb';
  databaseName?: string;
  tableMapStore?: TableMapStore;
  session: SessionContext;
}

export async function createPerfilRepository(options: PersistenceOptions) {
  if (options.mode === 'memory') {
    return new PerfilRepository(
      new InMemoryRepository<PerfilRecord>(),
      options.session
    );
  }

  if (!options.tableMapStore) {
    throw new Error('tableMapStore é obrigatório para persistência IndexedDB ofuscada.');
  }

  const obfuscator = new TableObfuscator(['perfis'], options.tableMapStore, options.session);
  const tableMap = await obfuscator.initialize();
  const perfisStore = obfuscator.physicalName('perfis', tableMap);

  const connection = new IndexedDbConnection({
    databaseName: options.databaseName || 'kzera_foundation',
    version: 1,
    stores: [perfisStore]
  });

  return new PerfilRepository(
    new IndexedDbRepository<PerfilRecord>(connection, perfisStore),
    options.session
  );
}
