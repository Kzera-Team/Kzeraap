import { escapeHtml } from './Html';

export function metricCard(label: string, value: string, className = 'metric-card'): string {
  return `<div class="${escapeHtml(className)}"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
}
