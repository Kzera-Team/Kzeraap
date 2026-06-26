import { LoginUseCase } from '../application/auth/LoginUseCase';
import { BackupImportUseCase } from '../application/backup/BackupImportUseCase';
import { InMemoryRepository } from '../infrastructure/repositories/InMemoryRepository';
import { IndexedDbRepository } from '../infrastructure/repositories/IndexedDbRepository';
import { IndexedDbConnection } from '../infrastructure/storage/IndexedDbConnection';
import type { Repository } from '../application/ports/Repository';
import { BrowserKeyValueStore } from '../infrastructure/storage/BrowserKeyValueStore';
import { RuntimeMetadataKeyValueStore } from '../infrastructure/storage/RuntimeMetadataKeyValueStore';
import { createFoundationSecurity } from './createFoundationSecurity';
import type { Perfil } from '../domain/perfil/Perfil';
import type { PerfilRecord } from '../runtime/PerfilPayloadFields';
import { PerfilRepository } from '../infrastructure/repositories/PerfilRepository';
import type { ItemCatalogo } from '../domain/item/ItemCatalogo';
import type { Balanca } from '../domain/operacao/Balanca';
import type { ContaFinanceira, MovimentoFinanceiro, PagamentoTransacao, TransacaoFinanceira } from '../domain/financeiro/Financeiro';
import { FinanceiroProtegidoRepository, type FinanceiroProtegidoRecord } from '../infrastructure/repositories/FinanceiroProtegidoRepository';
import type { LoteImportacaoFinanceira, LoteImportacaoTransacoes, RegistroImportacaoFinanceira, RegistroImportacaoFinanceiraRecord, RegistroImportacaoTransacao, RegistroImportacaoTransacaoRecord } from '../domain/importacao/ImportacaoTransacoesFinanceiro';
import { RegistroImportacaoFinanceiraRepository, RegistroImportacaoTransacaoRepository } from '../infrastructure/repositories/ImportacaoStagingRepository';

const clock = { now: () => new Date() };

type StoreName = 'perfis' | 'itens' | 'balancas' | 'contasFinanceiras' | 'movimentosFinanceiros' | 'pagamentosTransacao' | 'transacoesFinanceiras' | 'lotesImportacaoTransacoes' | 'registrosImportacaoTransacoes' | 'lotesImportacaoFinanceira' | 'registrosImportacaoFinanceira' | 'pacotesConfirmacaoHistorica';

function createOperationalRepository<T extends { id: string }>(storeName: StoreName): Repository<T> {
  if (typeof indexedDB === 'undefined') return new InMemoryRepository<T>();
  const connection = new IndexedDbConnection({
    databaseName: 'kzera_operacional_1102',
    version: 5,
    stores: ['perfis', 'itens', 'balancas', 'contasFinanceiras', 'movimentosFinanceiros', 'pagamentosTransacao', 'transacoesFinanceiras', 'lotesImportacaoTransacoes', 'registrosImportacaoTransacoes', 'lotesImportacaoFinanceira', 'registrosImportacaoFinanceira', 'pacotesConfirmacaoHistorica']
  });
  return new IndexedDbRepository<T>(connection, storeName);
}

function showRestoreStatus(message: string): void {
  const existing = document.querySelector('[data-backup-restore-status]');
  existing?.remove();
  const box = document.createElement('div');
  box.setAttribute('data-backup-restore-status', 'true');
  box.textContent = message;
  box.style.position = 'fixed';
  box.style.left = '16px';
  box.style.right = '16px';
  box.style.bottom = '74px';
  box.style.zIndex = '100000';
  box.style.padding = '12px 14px';
  box.style.borderRadius = '14px';
  box.style.background = '#ffffff';
  box.style.color = '#111827';
  box.style.boxShadow = '0 12px 30px rgba(0,0,0,.25)';
  document.body.appendChild(box);
}

function readSelectedFile(event: Event): File | null {
  const custom = event as CustomEvent<{ file?: File }>;
  return custom.detail?.file || null;
}

async function restore(file: File): Promise<void> {
  const password = window.prompt('Digite a mesma senha de login para restaurar este backup.');
  if (!password) return;

  const stateStore = new RuntimeMetadataKeyValueStore(new BrowserKeyValueStore('kzera-runtime'));
  const security = createFoundationSecurity(stateStore, clock);
  const login = new LoginUseCase(security.accessCoordinator);
  await login.execute({ password });

  const perfisBase = new IndexedDbRepository<PerfilRecord>(new IndexedDbConnection({
    databaseName: 'kzera_operacional_perfis_seguro_1133',
    version: 1,
    stores: ['perfis']
  }), 'perfis');

  const perfis = new PerfilRepository(perfisBase, security.session);
  const contasFinanceirasBase = createOperationalRepository<FinanceiroProtegidoRecord>('contasFinanceiras');
  const movimentosFinanceirosBase = createOperationalRepository<FinanceiroProtegidoRecord>('movimentosFinanceiros');
  const pagamentosTransacaoBase = createOperationalRepository<FinanceiroProtegidoRecord>('pagamentosTransacao');
  const transacoesFinanceirasBase = createOperationalRepository<FinanceiroProtegidoRecord>('transacoesFinanceiras');
  const registrosImportacaoTransacoesBase = createOperationalRepository<RegistroImportacaoTransacaoRecord>('registrosImportacaoTransacoes');
  const registrosImportacaoFinanceiraBase = createOperationalRepository<RegistroImportacaoFinanceiraRecord>('registrosImportacaoFinanceira');

  const importar = new BackupImportUseCase({
    perfis,
    itens: createOperationalRepository<ItemCatalogo>('itens'),
    balancas: createOperationalRepository<Balanca>('balancas'),
    contasFinanceiras: new FinanceiroProtegidoRepository<ContaFinanceira>(contasFinanceirasBase, security.session, 'conta_financeira'),
    movimentosFinanceiros: new FinanceiroProtegidoRepository<MovimentoFinanceiro>(movimentosFinanceirosBase, security.session, 'movimento_financeiro'),
    pagamentosTransacao: new FinanceiroProtegidoRepository<PagamentoTransacao>(pagamentosTransacaoBase, security.session, 'pagamento_transacao'),
    transacoesFinanceiras: new FinanceiroProtegidoRepository<TransacaoFinanceira>(transacoesFinanceirasBase, security.session, 'transacao_financeira'),
    lotesImportacaoTransacoes: createOperationalRepository<LoteImportacaoTransacoes>('lotesImportacaoTransacoes'),
    registrosImportacaoTransacoes: new RegistroImportacaoTransacaoRepository(registrosImportacaoTransacoesBase, security.session),
    lotesImportacaoFinanceira: createOperationalRepository<LoteImportacaoFinanceira>('lotesImportacaoFinanceira'),
    registrosImportacaoFinanceira: new RegistroImportacaoFinanceiraRepository(registrosImportacaoFinanceiraBase, security.session)
  }, security.session);

  const result = await importar.execute(await file.text());
  security.resourceScope.release();
  showRestoreStatus(`Backup restaurado: ${result.perfis} perfis, ${result.itens} itens, ${result.financeiros} registros financeiros.`);
  window.setTimeout(() => window.location.reload(), 900);
}

window.addEventListener('kzera:backup-file-selected', event => {
  const file = readSelectedFile(event);
  if (!file) return;
  showRestoreStatus('Restaurando backup...');
  restore(file).catch(error => {
    showRestoreStatus(error instanceof Error ? error.message : 'Não foi possível restaurar o backup.');
  });
});
