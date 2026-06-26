import type { LoginUseCase } from '../../application/auth/LoginUseCase';
import type { BackupImportResult, BackupImportUseCase } from '../../application/backup/BackupImportUseCase';
import type { SessionContext } from '../../runtime/SessionContext';
import type { RuntimeMetadata } from '../../runtime/RuntimeMetadata';
import { WebCryptoMaterialService, type MaterialService } from '../../runtime/MaterialService';

interface BackupEnvelopeRuntime {
  runtime?: Pick<RuntimeMetadata, 'salt' | 'iterations' | 'hash'>;
}

export interface BackupRestoreFlowDependencies {
  importer: BackupImportUseCase;
  legacyLogin: LoginUseCase;
  session: SessionContext;
  materialService?: MaterialService;
}

export class BackupRestoreFlow {
  private readonly materialService: MaterialService;

  constructor(private readonly dependencies: BackupRestoreFlowDependencies) {
    this.materialService = dependencies.materialService ?? new WebCryptoMaterialService();
  }

  async restore(file: File, password: string): Promise<BackupImportResult> {
    const fileText = await file.text();
    await this.openSession(fileText, password);

    return this.dependencies.importer.execute(fileText);
  }

  private async openSession(fileText: string, password: string): Promise<void> {
    const runtime = this.getRuntime(fileText);

    if (!runtime) {
      await this.dependencies.legacyLogin.execute({ password });
      return;
    }

    const material = await this.materialService.deriveFromPassword(password, {
      salt: new Uint8Array(runtime.salt),
      iterations: runtime.iterations,
      hash: runtime.hash
    });

    this.dependencies.session.open(material);
  }

  private getRuntime(fileText: string): BackupEnvelopeRuntime['runtime'] {
    const envelope = JSON.parse(fileText) as BackupEnvelopeRuntime;
    return envelope.runtime;
  }
}
