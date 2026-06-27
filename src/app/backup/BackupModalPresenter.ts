import { escaped, fillTemplate } from '../sharedTemplate';
import type { BackupExportController } from './BackupExportController';
import mandatoryMessageTemplate from './backup-mandatory-message.html?raw';
import messageTemplate from './backup-message.html?raw';
import modalTemplate from './backup-modal.html?raw';
import postponeButtonTemplate from './backup-postpone-button.html?raw';

interface BackupModalPresenterParams {
  controller: BackupExportController;
  requestRender(): Promise<void>;
}

export class BackupModalPresenter {
  constructor(private readonly params: BackupModalPresenterParams) {}

  render(): string {
    const decision = this.params.controller.decision;
    if (!decision?.required) return '';

    return fillTemplate(modalTemplate, {
      label: escaped(decision.status.pendingWindowLabel || 'cópia'),
      mandatoryHtml: decision.blocked ? mandatoryMessageTemplate : '',
      messageHtml: this.params.controller.message ? fillTemplate(messageTemplate, { message: escaped(this.params.controller.message) }) : '',
      postponeHtml: decision.canPostpone ? postponeButtonTemplate : ''
    });
  }

  bind(root: HTMLElement): void {
    root.querySelector('[data-backup-export]')?.addEventListener('click', async () => {
      this.params.controller.message = '';
      try {
        await this.params.controller.exportNow();
      } catch (error) {
        this.params.controller.message = error instanceof Error ? error.message : 'Não foi possível salvar a cópia de segurança.';
        await this.params.requestRender();
      }
    });

    root.querySelector('[data-backup-postpone]')?.addEventListener('click', async () => {
      this.params.controller.message = '';
      await this.params.controller.postponeNow();
    });
  }
}
