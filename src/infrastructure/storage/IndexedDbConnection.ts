export interface IndexedDbConnectionOptions {
  databaseName: string;
  version: number;
  stores: string[];
}

export class IndexedDbConnection {
  private db: IDBDatabase | null = null;

  constructor(private readonly options: IndexedDbConnectionOptions) {}

  async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    this.db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.options.databaseName, this.options.version);

      request.onupgradeneeded = () => {
        const db = request.result;

        for (const store of this.options.stores) {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        }
      };

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });

    return this.db;
  }

  async transaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    run: (store: IDBObjectStore) => IDBRequest<T> | void
  ): Promise<T | undefined> {
    const db = await this.open();

    return new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const request = run(store);
      let result: T | undefined;

      if (request) {
        request.onsuccess = () => {
          result = request.result;
        };
        request.onerror = () => reject(request.error);
      }

      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  close(): void {
    this.db?.close();
    this.db = null;
  }
}
