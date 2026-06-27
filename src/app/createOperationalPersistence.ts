import { InMemoryRepository } from '../infrastructure/repositories/InMemoryRepository';
import { IndexedDbRepository } from '../infrastructure/repositories/IndexedDbRepository';
import { IndexedDbConnection } from '../infrastructure/storage/IndexedDbConnection';
import type { Repository } from '../application/ports/Repository';

export type OperationalStoreName =
  | 'perfis'
  | 'itens'
  | 'balancas'
  | 'contasFinanceiras'
  | 'movimentosFinanceiros'
  | 'pagamentosTransacao'
  | 'transacoesFinanceiras'
  | 'lotesImportacaoTransacoes'
  | 'registrosImportacaoTransacoes'
  | 'lotesImportacaoFinanceira'
  | 'registrosImportacaoFinanceira'
  | 'pacotesConfirmacaoHistorica';

const OPERATIONAL_DATABASE_NAME = 'kzera_operacional_1102';
const OPERATIONAL_DATABASE_VERSION = 5;
const OPERATIONAL_STORES: OperationalStoreName[] = [
  'perfis',
  'itens',
  'balancas',
  'contasFinanceiras',
  'movimentosFinanceiros',
  'pagamentosTransacao',
  'transacoesFinanceiras',
  'lotesImportacaoTransacoes',
  'registrosImportacaoTransacoes',
  'lotesImportacaoFinanceira',
  'registrosImportacaoFinanceira',
  'pacotesConfirmacaoHistorica'
];

export function createOperationalPersistence<T extends { id: string }>(storeName: OperationalStoreName): Repository<T> {
  if (typeof indexedDB === 'undefined') {
    return new InMemoryRepository<T>();
  }

  const connection = new IndexedDbConnection({
    databaseName: OPERATIONAL_DATABASE_NAME,
    version: OPERATIONAL_DATABASE_VERSION,
    stores: OPERATIONAL_STORES
  });

  return new IndexedDbRepository<T>(connection, storeName);
}
