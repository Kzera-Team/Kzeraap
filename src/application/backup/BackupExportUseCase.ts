import { PayloadProvider } from '../../runtime/PayloadProvider';
import type { SessionContext } from '../../runtime/SessionContext';
import { backupFileName } from '../../runtime/BackupPolicy';

export interface BackupPayload {
  schemaVersion: 1;
  exportedAt: string;
  appVersion: string;
  data: {
    perfis: unknown[];
    itens: unknown[];
    balancas?: unknown[];
    contasFinanceiras?: unknown[];
    movimentosFinanceiros?: unknown[];
    pagamentosTransacao?: unknown[];
    transacoesFinanceiras?: unknown[];
    lotesImportacaoTransacoes?: unknown[];
    registrosImportacaoTransacoes?: unknown[];
    lotesImportacaoFinanceira?: unknown[];
    registrosImportacaoFinanceira?: unknown[];
  };
}

export interface BackupFile {
  filename: string;
  encryptedPayload: string;
}

export interface BackupExporter {
  exportEncrypted(file: BackupFile): Promise<void>;
}

export class BackupExportUseCase {
  constructor(
    private readonly exporter: BackupExporter,
    private readonly session: SessionContext
  ) {}

  async execute(payload: BackupPayload, now = new Date()): Promise<BackupFile> {
    const provider = new PayloadProvider(this.session);
    const encryptedPayload = await provider.packJson(payload, 'backup:v1');
    const file = { filename: backupFileName(now), encryptedPayload };
    await this.exporter.exportEncrypted(file);
    return file;
  }
}
