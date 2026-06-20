import { escapeHtml } from './Html';

export function infoItem(label: string, value: string, className = ''): string {
  return `<div class="info-item ${escapeHtml(className)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}
