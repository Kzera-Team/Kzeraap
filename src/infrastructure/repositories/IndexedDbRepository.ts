import type { Repository } from '../../application/ports/Repository';
import { IndexedDbConnection } from '../storage/IndexedDbConnection';

export class IndexedDbRepository<T extends { id: string }> implements Repository<T> {
  constructor(
    private readonly connection: IndexedDbConnection,
    private readonly storeName: string
  ) {}

  async save(entity: T): Promise<T> {
    await this.connection.transaction(this.storeName, 'readwrite', store => store.put(entity));
    return entity;
  }

  async getById(id: string): Promise<T | null> {
    const value = await this.connection.transaction<T | undefined>(
      this.storeName,
      'readonly',
      store => store.get(id)
    );

    return value || null;
  }

  async list(): Promise<T[]> {
    const values = await this.connection.transaction<T[]>(
      this.storeName,
      'readonly',
      store => store.getAll()
    );

    return values || [];
  }

  async remove(id: string): Promise<void> {
    await this.connection.transaction(this.storeName, 'readwrite', store => store.delete(id));
  }
}
