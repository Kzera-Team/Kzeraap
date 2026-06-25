import { PayloadProvider } from '../../runtime/PayloadProvider';
import type { SessionContext } from '../../runtime/SessionContext';
import type { RuntimeMetadata, RuntimeMetadataStore } from '../../runtime/RuntimeMetadata';
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

export interface BackupEnvelopeV1 {
  schemaVersion: 1;
  runtime?: Pick<RuntimeMetadata, 'version' | 'salt' | 'iterations' | 'hash' | 'probe' | 'createdAt' | 'updatedAt'>;
  encryptedPayload: string;
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
    private readonly session: SessionContext,
    private readonly runtimeStore?: RuntimeMetadataStore
  ) {}

  async execute(payload: BackupPayload, now = new Date()): Promise<BackupFile> {
    const provider = new PayloadProvider(this.session);
    const encryptedPayload = await provider.packJson(payload, 'backup:v1');
    const runtime = await this.runtimeStore?.load();
    const envelope: BackupEnvelopeV1 = runtime
      ? {
        schemaVersion: 1,
        runtime: {
          version: runtime.version,
          salt: runtime.salt,
          iterations: runtime.iterations,
          hash: runtime.hash,
          probe: runtime.probe,
          createdAt: runtime.createdAt,
          updatedAt: runtime.updatedAt
        },
        encryptedPayload
      }
      : { schemaVersion: 1, encryptedPayload };
    const file = { filename: backupFileName(now), encryptedPayload: JSON.stringify(envelope) };
    await this.exporter.exportEncrypted(file);
    return file;
  }
}
