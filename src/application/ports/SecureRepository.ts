import type { Repository } from './Repository';

export interface SecureRepository<T extends { id: string }> extends Repository<T> {
  listDecrypted(): Promise<T[]>;
  saveEncrypted(entity: T): Promise<T>;
}
