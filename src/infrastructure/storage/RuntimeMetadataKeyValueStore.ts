import type { RuntimeMetadata, RuntimeMetadataStore } from '../../runtime/RuntimeMetadata';
import type { KeyValueStore } from './KeyValueStore';

const SECURITY_METADATA_KEY = 'runtime_runtimeState';

export class RuntimeMetadataKeyValueStore implements RuntimeMetadataStore {
  constructor(private readonly store: KeyValueStore) {}

  async load(): Promise<RuntimeMetadata | null> {
    const raw = await this.store.get(SECURITY_METADATA_KEY);
    return raw ? JSON.parse(raw) as RuntimeMetadata : null;
  }

  async save(runtimeState: RuntimeMetadata): Promise<void> {
    await this.store.set(SECURITY_METADATA_KEY, JSON.stringify(runtimeState));
  }

  async clear(): Promise<void> {
    await this.store.remove(SECURITY_METADATA_KEY);
  }
}
