import { BackupGateUseCase } from '../../application/backup/BackupGateUseCase';
import { BackupExportUseCase } from '../../application/backup/BackupExportUseCase';
import { BrowserBackupExporter } from '../../infrastructure/backup/BrowserBackupExporter';
import type { createSecurityComposition } from './createSecurityComposition';
import type { createRepositoryComposition } from './createRepositoryComposition';
import { BackupExportController } from '../backup/BackupExportController';
import { createBackupRestoreFlow } from '../backup/createBackupRestoreFlow';
import { BackupRestoreUiFlow } from '../backup/BackupRestoreUiFlow';

type SecurityComposition = ReturnType<typeof createSecurityComposition>;
type RepositoryComposition = ReturnType<typeof createRepositoryComposition>;

export interface BackupCompositionDependencies {
  appName: string;
  versionLabel: string;
  security: SecurityComposition;
  repositories: RepositoryComposition;
  requestRender(): Promise<void>;
}

export function createBackupComposition(dependencies: BackupCompositionDependencies) {
  const { security, repositories } = dependencies;
  const backupGate = new BackupGateUseCase();
  const backupExport = new BackupExportUseCase(new BrowserBackupExporter(), security.security.session, security.stateStore);

  const backupController = new BackupExportController({
    stateStore: security.browserStore,
    backupGate,
    backupExport,
    buildPayload: async () => ({
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      appVersion: dependencies.versionLabel,
      data: {
        perfis: await repositories.perfis.list(),
        itens: await repositories.itens.list(),
        balancas: await repositories.balancas.list(),
        contasFinanceiras: await repositories.contasFinanceiras.list(),
        movimentosFinanceiros: await repositories.movimentosFinanceiros.list(),
        pagamentosTransacao: await repositories.pagamentosTransacao.list(),
        transacoesFinanceiras: await repositories.transacoesFinanceiras.list(),
        lotesImportacaoTransacoes: await repositories.lotesImportacaoTransacoes.list(),
        registrosImportacaoTransacoes: await repositories.registrosImportacaoTransacoes.list(),
        lotesImportacaoFinanceira: await repositories.lotesImportacaoFinanceira.list(),
        registrosImportacaoFinanceira: await repositories.registrosImportacaoFinanceira.list()
      }
    }),
    requestRender: dependencies.requestRender
  });

  const backupRestoreFlow = createBackupRestoreFlow({
    perfis: repositories.perfis,
    itens: repositories.itens,
    balancas: repositories.balancas,
    contasFinanceiras: repositories.contasFinanceiras,
    movimentosFinanceiros: repositories.movimentosFinanceiros,
    pagamentosTransacao: repositories.pagamentosTransacao,
    transacoesFinanceiras: repositories.transacoesFinanceiras,
    lotesImportacaoTransacoes: repositories.lotesImportacaoTransacoes,
    registrosImportacaoTransacoes: repositories.registrosImportacaoTransacoes,
    lotesImportacaoFinanceira: repositories.lotesImportacaoFinanceira,
    registrosImportacaoFinanceira: repositories.registrosImportacaoFinanceira,
    session: security.security.session,
    runtimeStore: security.stateStore
  });

  const backupRestoreUi = new BackupRestoreUiFlow({
    appName: dependencies.appName,
    versionLabel: dependencies.versionLabel,
    flow: backupRestoreFlow,
    requestRender: dependencies.requestRender
  });

  return { backupController, backupRestoreUi };
}
