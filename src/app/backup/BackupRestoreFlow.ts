import type { BackupImportResult, BackupImportUseCase } from '../../application/backup/BackupImportUseCase';
import type { SessionContext } from '../../runtime/SessionContext';
import type { RuntimeMetadata, RuntimeMetadataStore } from '../../runtime/RuntimeMetadata';
import {
  MATERIAL_DEFAULT_HASH,
  MATERIAL_DEFAULT_ITERATIONS,
  WebCryptoMaterialService,
  type MaterialDerivationParams,
  type MaterialService
} from '../../runtime/MaterialService';
import { releaseBytes } from '../../runtime/RuntimeCleanup';

type BackupRuntimeMetadata = Omit<RuntimeMetadata, 'id'> & Partial<Pick<RuntimeMetadata, 'id'>>;

interface BackupEnvelopeRuntime {
  runtime?: BackupRuntimeMetadata;
}

export interface BackupRestoreFlowDependencies {
  importer: BackupImportUseCase;
  session: SessionContext;
  runtimeStore: RuntimeMetadataStore;
  materialService?: MaterialService;
}

function legacyDerivationCandidates(): MaterialDerivationParams[] {
  const encoder = new TextEncoder();

  return [
    {
      salt: encoder.encode('kzera:legacy-backup:v1'),
      iterations: MATERIAL_DEFAULT_ITERATIONS,
      hash: MATERIAL_DEFAULT_HASH
    },
    {
      salt: new Uint8Array(),
      iterations: MATERIAL_DEFAULT_ITERATIONS,
      hash: MATERIAL_DEFAULT_HASH
    }
  ];
}

export class BackupRestoreFlow {
  private readonly materialService: MaterialService;

  constructor(private readonly dependencies: BackupRestoreFlowDependencies) {
    this.materialService = dependencies.materialService ?? new WebCryptoMaterialService();
  }

  async restore(file: File, password: string): Promise<BackupImportResult> {
    const fileText = await file.text();
    const runtime = this.getRuntime(fileText);

    if (runtime) {
      await this.openRuntimeSession(runtime, password);
      const result = await this.importWithOpenSession(fileText);
      await this.dependencies.runtimeStore.save(this.toRuntimeMetadata(runtime));
      return result;
    }

    return this.restoreLegacyBackup(fileText, password);
  }

  private async importWithOpenSession(fileText: string): Promise<BackupImportResult> {
    try {
      return await this.dependencies.importer.execute(fileText);
    } catch {
      this.dependencies.session.close();
      throw new Error('Não foi possível abrir o backup com esta senha.');
    }
  }

  private async restoreLegacyBackup(fileText: string, password: string): Promise<BackupImportResult> {
    let lastError: unknown;

    for (const params of legacyDerivationCandidates()) {
      try {
        const material = await this.materialService.deriveFromPassword(password, params);
        this.dependencies.session.open(material);
        return await this.dependencies.importer.execute(fileText);
      } catch (error) {
        this.dependencies.session.close();
        lastError = error;
      } finally {
        releaseBytes(params.salt);
      }
    }

    if (lastError instanceof SyntaxError) {
      throw new Error('Arquivo de backup inválido.');
    }

    throw new Error('Não foi possível abrir o backup com esta senha.');
  }

  private toRuntimeMetadata(runtime: BackupRuntimeMetadata): RuntimeMetadata {
    return {
      id: 'runtime_state',
      version: runtime.version,
      salt: runtime.salt,
      iterations: runtime.iterations,
      hash: runtime.hash,
      probe: runtime.probe,
      createdAt: runtime.createdAt,
      updatedAt: runtime.updatedAt
    };
  }

  private async openRuntimeSession(
    runtime: Pick<RuntimeMetadata, 'salt' | 'iterations' | 'hash'>,
    password: string
  ): Promise<void> {
    const salt = new Uint8Array(runtime.salt);

    try {
      const material = await this.materialService.deriveFromPassword(password, {
        salt,
        iterations: runtime.iterations,
        hash: runtime.hash
      });

      this.dependencies.session.open(material);
    } finally {
      releaseBytes(salt);
    }
  }

  private getRuntime(fileText: string): BackupEnvelopeRuntime['runtime'] {
    const envelope = JSON.parse(fileText) as BackupEnvelopeRuntime;
    return envelope.runtime;
  }
}
