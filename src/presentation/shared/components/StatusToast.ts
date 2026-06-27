import { cloneTemplateRoot } from './FeedbackComponents/FeedbackTemplate';

export interface StatusToastOptions {
  timeoutMs?: number | null;
}

const TEMPLATE_ID = 'kzera-status-toast-template';

export function showStatusToast(message: string, options: StatusToastOptions = {}): () => void {
  const toast = cloneTemplateRoot(TEMPLATE_ID, 'StatusToast');

  toast.textContent = message;
  document.body.appendChild(toast);

  if (options.timeoutMs !== null) {
    window.setTimeout(() => toast.remove(), options.timeoutMs ?? 4000);
  }

  return () => toast.remove();
}
