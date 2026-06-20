import type { Repository } from '../../application/ports/Repository';
import type { UxEvento, UxFluxoResumo } from '../../domain/uxMetricas/UxMetricas';
import { IndexedDbConnection } from '../storage/IndexedDbConnection';
import { IndexedDbRepository } from './IndexedDbRepository';
import { InMemoryRepository } from './InMemoryRepository';

export function createUxEventosRepository(): Repository<UxEvento> {
  if (typeof indexedDB === 'undefined') return new InMemoryRepository<UxEvento>();
  const connection = new IndexedDbConnection({
    databaseName: 'kzera_ux_metricas_1192',
    version: 1,
    stores: ['uxEventos', 'uxFluxosResumo']
  });
  return new IndexedDbRepository<UxEvento>(connection, 'uxEventos');
}

export function createUxFluxosResumoRepository(): Repository<UxFluxoResumo> {
  if (typeof indexedDB === 'undefined') return new InMemoryRepository<UxFluxoResumo>();
  const connection = new IndexedDbConnection({
    databaseName: 'kzera_ux_metricas_1192',
    version: 1,
    stores: ['uxEventos', 'uxFluxosResumo']
  });
  return new IndexedDbRepository<UxFluxoResumo>(connection, 'uxFluxosResumo');
}
