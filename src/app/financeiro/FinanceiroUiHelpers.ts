import { escapeHtml } from '../../presentation/shared/ui/Html';

export function dinheiro(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

export function selected(actual: unknown, expected: string): string {
  return actual === expected ? 'selected' : '';
}

export function toast(message: string): string {
  return fill('{{open}}div class="toast"{{close}}{{message}}{{open}}/div{{close}}', {
    open: '<',
    close: '>',
    message: escapeHtml(message).replaceAll('\n', '<br />')
  });
}

export function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
    template
  );
}
