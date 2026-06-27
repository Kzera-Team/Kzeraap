import { renderAuthPasswordForm } from '../../presentation/shared/components/AuthPasswordForm/AuthPasswordForm';
import { showLoadingModal } from '../../presentation/shared/components/LoadingModal';
import { showStatusToast } from '../../presentation/shared/components/StatusToast';
import type { BackupRestoreFlow } from './BackupRestoreFlow';

interface BackupFileSelectedEventDetail {
  file?: File;
}

export interface BackupRestoreUiFlowDependencies {
  appName: string;
  versionLabel: string;
  flow: BackupRestoreFlow;
  requestRender(): void;
}

export class BackupRestoreUiFlow {
  private pendingFile: File | null = null;
  private inProgress = false;
  private error = '';

  constructor(private readonly dependencies: BackupRestoreUiFlowDependencies) {}

  hasPendingFile(): boolean {
    return Boolean(this.pendingFile);
  }

  handleFileSelected(event: Event): void {
    const file = (event as CustomEvent<BackupFileSelectedEventDetail>).detail?.file;
    if (!file) return;

    this.pendingFile = file;
    this.error = '';
    this.dependencies.requestRender();
  }

  renderPasswordScreen(root: HTMLElement): void {
    renderAuthPasswordForm(root, {
      appName: this.dependencies.appName,
      versionLabel: this.dependencies.versionLabel,
      testId: 'backup-restore-password-form',
      title: 'Confirmar senha',
      description: 'Digite a senha para realizar a restauração do backup.',
      inputId: 'backup-restore-password',
      inputLabel: 'Senha do backup',
      buttonLabel: 'Restaurar backup',
      disabled: this.inProgress,
      error: this.error
    }, password => {
      void this.submitPassword(password);
    });
  }

  private async submitPassword(password: string): Promise<void> {
    const file = this.pendingFile;
    if (!file || this.inProgress) return;

    this.inProgress = true;
    this.error = '';
    const loading = showLoadingModal({ message: 'Restaurando backup...' });

    try {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const result = await this.dependencies.flow.restore(file, password);
      this.pendingFile = null;
      showStatusToast(`Backup restaurado: ${result.perfis} perfis, ${result.itens} itens.`);
      window.setTimeout(() => window.location.reload(), 900);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Não foi possível restaurar.';
      this.dependencies.requestRender();
    } finally {
      this.inProgress = false;
      loading.close();
    }
  }
}
