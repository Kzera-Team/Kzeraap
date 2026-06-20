import type { KeyValueStore } from './KeyValueStore';

export class BrowserKeyValueStore implements KeyValueStore {
  constructor(private readonly prefix = 'kzera') {}

  async get(key: string): Promise<string | null> {
    return globalThis.localStorage?.getItem(`${this.prefix}:${key}`) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    globalThis.localStorage?.setItem(`${this.prefix}:${key}`, value);
  }

  async remove(key: string): Promise<void> {
    globalThis.localStorage?.removeItem(`${this.prefix}:${key}`);
  }
}
