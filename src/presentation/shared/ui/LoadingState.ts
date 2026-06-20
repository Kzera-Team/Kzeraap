import { escapeHtml } from './Html';

export function loadingState(message = 'Carregando...'): string {
  return `<div class="loading-state" data-testid="loading-state">${escapeHtml(message)}</div>`;
}
