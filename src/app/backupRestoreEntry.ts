import { LoginUseCase } from '../application/auth/LoginUseCase';
import { BackupImportUseCase } from '../application/backup/BackupImportUseCase';
import { IndexedDbRepository } from '../infrastructure/repositories/IndexedDbRepository';
import { IndexedDbConnection } from '../infrastructure/storage/IndexedDbConnection';
import { BrowserKeyValueStore } from '../infrastructure/storage/BrowserKeyValueStore';
import { RuntimeMetadataKeyValueStore } from '../infrastructure/storage/RuntimeMetadataKeyValueStore';
import { createFoundationSecurity } from './createFoundationSecurity';
import type { PerfilRecord } from '../runtime/PerfilPayloadFields';
import { PerfilRepository } from '../infrastructure/repositories/PerfilRepository';
import { FinanceiroProtegidoRepository, type FinanceiroProtegidoRecord } from '../infrastructure/repositories/FinanceiroProtegidoRepository';
import { RegistroImportacaoFinanceiraRepository, RegistroImportacaoTransacaoRepository } from '../infrastructure/repositories/ImportacaoStagingRepository';
import { showLoadingModal } from '../presentation/shared/components/LoadingModal';
const stores = ['perfis', 'itens', 'balancas', 'contasFinanceiras', 'movimentosFinanceiros', 'pagamentosTransacao', 'transacoesFinanceiras', 'lotesImportacaoTransacoes', 'registrosImportacaoTransacoes', 'lotesImportacaoFinanceira', 'registrosImportacaoFinanceira', 'pacotesConfirmacaoHistorica'];
const clock = { now: () => new Date() };
function repo(storeName: string) {
  return new IndexedDbRepository(new IndexedDbConnection({ databaseName: 'kzera_operacional_1102', version: 5, stores }), storeName);
}
function status(message: string, options: { timeoutMs?: number | null } = {}) {
  const box = document.createElement('div');
  box.textContent = message;
  box.style.position = 'fixed';
  box.style.left = '16px';
  box.style.right = '16px';
  box.style.bottom = '74px';
  box.style.zIndex = '100000';
  box.style.padding = '12px';
  box.style.borderRadius = '12px';
  box.style.background = '#fff';
  box.style.color = '#111';
  document.body.appendChild(box);
  if (options.timeoutMs !== null) {
    window.setTimeout(() => box.remove(), options.timeoutMs ?? 4000);
  }
  return () => box.remove();
}
async function restore(file: File) {
  const password = window.prompt('Digite a mesma senha de login para restaurar este backup.');
  if (!password) return;
  const security = createFoundationSecurity(new RuntimeMetadataKeyValueStore(new BrowserKeyValueStore('kzera-runtime')), clock);
  await new LoginUseCase(security.accessCoordinator).execute({ password });
  const perfisBase = new IndexedDbRepository<PerfilRecord>(new IndexedDbConnection({ databaseName: 'kzera_operacional_perfis_seguro_1133', version: 1, stores: ['perfis'] }), 'perfis');
  const importer = new BackupImportUseCase({
    perfis: new PerfilRepository(perfisBase, security.session),
    itens: repo('itens'),
    balancas: repo('balancas'),
    contasFinanceiras: new FinanceiroProtegidoRepository(repo('contasFinanceiras') as unknown as IndexedDbRepository<FinanceiroProtegidoRecord>, security.session, 'conta_financeira'),
    movimentosFinanceiros: new FinanceiroProtegidoRepository(repo('movimentosFinanceiros') as unknown as IndexedDbRepository<FinanceiroProtegidoRecord>, security.session, 'movimento_financeiro'),
    pagamentosTransacao: new FinanceiroProtegidoRepository(repo('pagamentosTransacao') as unknown as IndexedDbRepository<FinanceiroProtegidoRecord>, security.session, 'pagamento_transacao'),
    transacoesFinanceiras: new FinanceiroProtegidoRepository(repo('transacoesFinanceiras') as unknown as IndexedDbRepository<FinanceiroProtegidoRecord>, security.session, 'transacao_financeira'),
    lotesImportacaoTransacoes: repo('lotesImportacaoTransacoes'),
    registrosImportacaoTransacoes: new RegistroImportacaoTransacaoRepository(repo('registrosImportacaoTransacoes') as never, security.session),
    lotesImportacaoFinanceira: repo('lotesImportacaoFinanceira'),
    registrosImportacaoFinanceira: new RegistroImportacaoFinanceiraRepository(repo('registrosImportacaoFinanceira') as never, security.session)
  }, security.session);
  const result = await importer.execute(await file.text());
  security.resourceScope.releaseAll();
  status(`Backup restaurado: ${result.perfis} perfis, ${result.itens} itens.`);
  window.setTimeout(() => window.location.reload(), 900);
}
window.addEventListener('kzera:backup-file-selected', event => {
  const file = (event as CustomEvent<{ file?: File }>).detail?.file;
  if (!file) return;
  const loading = showLoadingModal({ message: 'Restaurando backup...' });
  restore(file)
    .catch(error => status(error instanceof Error ? error.message : 'Não foi possível restaurar.'))
    .finally(() => loading.close());
});
