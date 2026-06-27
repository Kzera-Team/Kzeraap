import type { BackupExportController } from './backup/BackupExportController';
import type { BackupModalPresenter } from './backup/BackupModalPresenter';
import type { ImportacaoRetomadaController } from './importacao/ImportacaoRetomadaController';
import type { Screen } from './navigation/Screen';

interface AppOverlayControllerParams {
  backupController: BackupExportController;
  backupModal: BackupModalPresenter;
  importacaoRetomada: ImportacaoRetomadaController;
  getCurrentScreen(): Screen;
}

export class AppOverlayController {
  constructor(private readonly params: AppOverlayControllerParams) {}

  async refreshAndBind(root: HTMLElement, appendHtml: (html: string) => void): Promise<void> {
    await this.params.backupController.refreshDecision();
    await this.params.importacaoRetomada.verificar();

    if (this.shouldRenderBackupModal()) {
      appendHtml(this.params.backupModal.render());
      this.params.backupModal.bind(root);
    }

    const retomadaModal = this.params.importacaoRetomada.renderModal();
    if (retomadaModal) {
      appendHtml(retomadaModal);
      this.params.importacaoRetomada.bind(root);
    }
  }

  private shouldRenderBackupModal(): boolean {
    return Boolean(this.params.backupController.decision?.required && !this.isImportacaoCritica());
  }

  private isImportacaoCritica(): boolean {
    const screen = this.params.getCurrentScreen();
    return screen === 'importacao-perfis'
      || screen === 'importacao-itens'
      || screen === 'importacao-transacoes';
  }
}
