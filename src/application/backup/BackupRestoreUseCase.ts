import { PayloadProvider } from '../../runtime/PayloadProvider';
import type { RuntimeMetadata } from '../../runtime/RuntimeMetadata';
import type { SessionContext } from '../../runtime/SessionContext';
import type { BackupPayload } from './BackupExportUseCase';

export interface BackupEnvelopeV1 {
  schemaVersion: 1;
  runtime?: Pick<RuntimeMetadata, 'version' | 'salt' | 'iterations' | 'hash' | 'probe' | 'createdAt' | 'updatedAt'>;
  encryptedPayload: string;
}

export interface BackupRestoreResult {
  payload: BackupPayload;
  runtime?: BackupEnvelopeV1['runtime'];
}

export class BackupRestoreUseCase {
  constructor(private readonly session: SessionContext) {}

  async parseEncryptedBackup(raw: string): Promise<BackupEnvelopeV1> {
    const parsed = JSON.parse(raw) as BackupEnvelopeV1 | { iv: number[]; data: number[] };

    if ('encryptedPayload' in parsed && typeof parsed.encryptedPayload === 'string') {
      return parsed as BackupEnvelopeV1;
    }

    if ('iv' in parsed && 'data' in parsed) {
      return {
        schemaVersion: 1,
        encryptedPayload: raw
      };
    }

    throw new Error('Arquivo de backup inválido.');
  }

  async unlock(raw: string): Promise<BackupRestoreResult> {
    const envelope = await this.parseEncryptedBackup(raw);
    const provider = new PayloadProvider(this.session);
    const payload = await provider.unpackJson<BackupPayload>(envelope.encryptedPayload, 'backup:v1');
    return { payload, runtime: envelope.runtime };
  }
}
