export interface Repository<T extends { id: string }> {
  save(entity: T): Promise<T>;
  getById(id: string): Promise<T | null>;
  list(): Promise<T[]>;
  remove?(id: string): Promise<void>;
}
