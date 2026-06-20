import { escapeHtml } from './Html';

export type ToastKind = 'success' | 'error' | 'info';

export function toast(message: string, kind: ToastKind = 'info'): string {
  return `<div class="toast toast-${kind}" data-testid="toast">${escapeHtml(message)}</div>`;
}
