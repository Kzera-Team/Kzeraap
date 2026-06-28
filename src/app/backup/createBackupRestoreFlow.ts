import { BackupImportUseCase } from '../../application/backup/BackupImportUseCase';
import type { Repository } from '../../application/ports/Repository';
import type { Balanca } from '../../domain/operacao/Balanca';
import type { ItemCatalogo } from '../../domain/item/ItemCatalogo';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { ContaFinanceira, MovimentoFinanceiro, PagamentoTransacao, TransacaoFinanceira } from '../../domain/financeiro/Financeiro';
import type { LoteImportacaoFinanceira, LoteImportacaoTransacoes, RegistroImportacaoFinanceira, RegistroImportacaoTransacao } from '../../domain/importacao/ImportacaoTransacoesFinanceiro';
import type { SessionContext } from '../../runtime/SessionContext';
import type { RuntimeMetadataStore } from '../../runtime/RuntimeMetadata';
import { BackupRestoreFlow } from './BackupRestoreFlow';

export interface BackupRestoreFlowFactoryDependencies {
  perfis: Repository<Perfil>;
  itens: Repository<ItemCatalogo>;
  balancas: Repository<Balanca>;
  contasFinanceiras: Repository<ContaFinanceira>;
  movimentosFinanceiros: Repository<MovimentoFinanceiro>;
  pagamentosTransacao: Repository<PagamentoTransacao>;
  transacoesFinanceiras: Repository<TransacaoFinanceira>;
  lotesImportacaoTransacoes: Repository<LoteImportacaoTransacoes>;
  registrosImportacaoTransacoes: Repository<RegistroImportacaoTransacao>;
  lotesImportacaoFinanceira: Repository<LoteImportacaoFinanceira>;
  registrosImportacaoFinanceira: Repository<RegistroImportacaoFinanceira>;
  session: SessionContext;
  runtimeStore: RuntimeMetadataStore;
}

export function createBackupRestoreFlow(dependencies: BackupRestoreFlowFactoryDependencies): BackupRestoreFlow {
  return new BackupRestoreFlow({
    importer: new BackupImportUseCase({
      perfis: dependencies.perfis,
      itens: dependencies.itens,
      balancas: dependencies.balancas,
      contasFinanceiras: dependencies.contasFinanceiras,
      movimentosFinanceiros: dependencies.movimentosFinanceiros,
      pagamentosTransacao: dependencies.pagamentosTransacao,
      transacoesFinanceiras: dependencies.transacoesFinanceiras,
      lotesImportacaoTransacoes: dependencies.lotesImportacaoTransacoes,
      registrosImportacaoTransacoes: dependencies.registrosImportacaoTransacoes,
      lotesImportacaoFinanceira: dependencies.lotesImportacaoFinanceira,
      registrosImportacaoFinanceira: dependencies.registrosImportacaoFinanceira
    }, dependencies.session),
    session: dependencies.session,
    runtimeStore: dependencies.runtimeStore
  });
}
