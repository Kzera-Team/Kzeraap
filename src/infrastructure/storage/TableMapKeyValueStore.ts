import type { TableMapStore } from './TableObfuscator';
import type { KeyValueStore } from './KeyValueStore';

const TABLE_MAP_KEY = 'table_map';

export class TableMapKeyValueStore implements TableMapStore {
  constructor(private readonly store: KeyValueStore) {}

  async loadEncryptedMap(): Promise<string | null> {
    return this.store.get(TABLE_MAP_KEY);
  }

  async saveEncryptedMap(payload: string): Promise<void> {
    await this.store.set(TABLE_MAP_KEY, payload);
  }
}
