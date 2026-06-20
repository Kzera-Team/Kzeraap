import type { Repository } from '../../application/ports/Repository';

export class InMemoryRepository<T extends { id: string }> implements Repository<T> {
  private readonly data = new Map<string, T>();

  async save(entity: T): Promise<T> {
    this.data.set(entity.id, structuredClone(entity));
    return structuredClone(entity);
  }

  async getById(id: string): Promise<T | null> {
    const value = this.data.get(id);
    return value ? structuredClone(value) : null;
  }

  async list(): Promise<T[]> {
    return Array.from(this.data.values()).map(item => structuredClone(item));
  }

  async remove(id: string): Promise<void> {
    this.data.delete(id);
  }
}
