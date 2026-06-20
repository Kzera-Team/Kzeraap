import { PayloadProvider } from '../../runtime/PayloadProvider';
import type { SessionContext } from '../../runtime/SessionContext';

export interface TableNameMap {
  version: number;
  map: Record<string, string>;
}

export interface TableMapStore {
  loadEncryptedMap(): Promise<string | null>;
  saveEncryptedMap(payload: string): Promise<void>;
}

export class InMemoryTableMapStore implements TableMapStore {
  private payload: string | null = null;

  async loadEncryptedMap(): Promise<string | null> {
    return this.payload;
  }

  async saveEncryptedMap(payload: string): Promise<void> {
    this.payload = payload;
  }
}

export function randomStoreName(prefix = 's'): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const hex = Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
  return `${prefix}_${hex}`;
}

export class TableObfuscator {
  private tableMap: TableNameMap | null = null;
  private readonly crypto: PayloadProvider;

  constructor(
    private readonly logicalStores: string[],
    private readonly mapStore: TableMapStore,
    session: SessionContext
  ) {
    this.crypto = new PayloadProvider(session);
  }

  async initialize(): Promise<TableNameMap> {
    const packedBuffer = await this.mapStore.loadEncryptedMap();

    if (packedBuffer) {
      this.tableMap = await this.crypto.unpackJson<TableNameMap>(packedBuffer, 'storage:table-map');
      return this.tableMap;
    }

    this.tableMap = this.createMap();
    const payload = await this.crypto.packJson(this.tableMap, 'storage:table-map');
    await this.mapStore.saveEncryptedMap(payload);
    return this.tableMap;
  }

  createMap(): TableNameMap {
    const map: Record<string, string> = {};

    for (const store of this.logicalStores) {
      map[store] = randomStoreName();
    }

    return {
      version: 1,
      map
    };
  }

  physicalName(logicalName: string, tableMap = this.tableMap): string {
    if (!tableMap) {
      throw new Error('TableObfuscator ainda não inicializado.');
    }

    const value = tableMap.map[logicalName];

    if (!value) {
      throw new Error(`Tabela lógica não mapeada: ${logicalName}`);
    }

    return value;
  }
}
