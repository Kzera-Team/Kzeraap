import { cloneTemplateRoot, findTemplateElement } from './FeedbackComponents/FeedbackTemplate';

export interface LoadingModalHandle {
  close(): void;
  update(message: string): void;
}

export interface LoadingModalOptions {
  message: string;
}

const TEMPLATE_ID = 'kzera-loading-modal-template';

export function showLoadingModal(options: LoadingModalOptions): LoadingModalHandle {
  const overlay = cloneTemplateRoot(TEMPLATE_ID, 'LoadingModal');
  const message = findTemplateElement(overlay, '[data-loading-message]', 'Mensagem do loading não encontrada.');

  message.textContent = options.message;
  document.body.appendChild(overlay);

  return {
    close() {
      overlay.remove();
    },
    update(nextMessage: string) {
      message.textContent = nextMessage;
    }
  };
}
