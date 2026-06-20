export interface RuntimeMetadata {
  id: 'runtime_state';
  version: 1;
  salt: number[];
  iterations: number;
  hash: 'SHA-256' | 'SHA-384' | 'SHA-512';
  probe: string;
  createdAt: string;
  updatedAt: string;
}

export interface RuntimeMetadataStore {
  load(): Promise<RuntimeMetadata | null>;
  save(runtimeState: RuntimeMetadata): Promise<void>;
  clear(): Promise<void>;
}

export class InMemoryRuntimeMetadataStore implements RuntimeMetadataStore {
  private runtimeState: RuntimeMetadata | null = null;

  async load(): Promise<RuntimeMetadata | null> {
    return this.runtimeState;
  }

  async save(runtimeState: RuntimeMetadata): Promise<void> {
    this.runtimeState = runtimeState;
  }

  async clear(): Promise<void> {
    this.runtimeState = null;
  }
}
