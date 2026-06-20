import { escapeHtml } from './Html';

export type FeedbackTone = 'success' | 'error' | 'info';

export function feedbackMessage(message: string, tone: FeedbackTone = 'info'): string {
  return `<div class="feedback-message feedback-${tone}" data-testid="feedback-message">${escapeHtml(message)}</div>`;
}
