import type { BackupDecision, BackupStatus, BackupGateUseCase } from '../../application/backup/BackupGateUseCase';
import type { BackupExportUseCase, BackupPayload } from '../../application/backup/BackupExportUseCase';

const BACKUP_STATUS_KEY = 'kzera-backup-status';

interface KeyValueStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export interface BackupExportControllerDependencies {
  stateStore: KeyValueStore;
  backupGate: BackupGateUseCase;
  backupExport: BackupExportUseCase;
  buildPayload(): Promise<BackupPayload>;
  releaseResources(): void;
  requestRender(): void | Promise<void>;
}

export class BackupExportController {
  private backupTimer: number | undefined;
  private backupDecision: BackupDecision | null = null;
  private backupMessage = '';

  constructor(private readonly dependencies: BackupExportControllerDependencies) {}

  get decision(): BackupDecision | null {
    return this.backupDecision;
  }

  get message(): string {
    return this.backupMessage;
  }

  set message(value: string) {
    this.backupMessage = value;
  }

  async refreshDecision(): Promise<void> {
    this.backupDecision = await this.dependencies.backupGate.evaluate(await this.loadStatus());
  }

  async exportNow(): Promise<void> {
    await this.dependencies.backupExport.execute(await this.dependencies.buildPayload());
    await this.saveStatus(this.dependencies.backupGate.complete(await this.loadStatus()));
    this.backupMessage = 'Backup salvo neste aparelho.';
    await this.refreshDecision();
    await this.dependencies.requestRender();
  }

  async postponeNow(): Promise<void> {
    const status = await this.loadStatus();
    await this.saveStatus(this.dependencies.backupGate.postpone(status));
    this.backupMessage = 'Lembrete adiado para amanhã.';
    await this.refreshDecision();
    await this.dependencies.requestRender();
  }

  scheduleCheck(): void {
    if (this.backupTimer) window.clearTimeout(this.backupTimer);

    this.backupTimer = window.setTimeout(() => {
      void this.refreshDecision().then(() => this.dependencies.requestRender());
    }, 1000 * 60 * 30);
  }

  private async loadStatus(): Promise<BackupStatus> {
    const raw = await this.dependencies.stateStore.get(BACKUP_STATUS_KEY);
    if (!raw) return { postponesUsed: 0 };

    try {
      return JSON.parse(raw) as BackupStatus;
    } catch {
      return { postponesUsed: 0 };
    }
  }

  private async saveStatus(status: BackupStatus): Promise<void> {
    await this.dependencies.stateStore.set(BACKUP_STATUS_KEY, JSON.stringify(status));
  }
}
