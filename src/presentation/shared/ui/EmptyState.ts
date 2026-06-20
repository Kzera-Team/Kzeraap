import { escapeHtml } from './Html';

export function emptyState(message: string): string {
  return `<p class="empty-state" data-testid="empty-state">${escapeHtml(message)}</p>`;
}
