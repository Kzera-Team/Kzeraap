import { escapeHtml } from '../presentation/shared/ui/Html';

export function fillTemplate(template: string, values: Record<string, string | number | boolean | null | undefined>): string {
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{{${key}}}`, value == null ? '' : String(value)), template);
}

export function escaped(value: string | number | boolean | null | undefined): string {
  return escapeHtml(value == null ? '' : String(value));
}
