import { escapeHtml } from './Html';

export type BadgeTone = 'success' | 'warning' | 'info' | 'neutral' | 'danger';

export interface BadgeOptions {
  testId?: string;
}

export function badge(label: string, tone: BadgeTone = 'neutral', options: BadgeOptions = {}): string {
  const testId = options.testId || 'badge';
  return `<span class="badge badge-${tone}" data-testid="${escapeHtml(testId)}">${escapeHtml(label)}</span>`;
}
