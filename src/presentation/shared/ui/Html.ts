export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char] || char));
}

export function inputValue(root: HTMLElement, selector: string): string {
  return (root.querySelector(selector) as HTMLInputElement | HTMLSelectElement | null)?.value || '';
}

export function numberValue(root: HTMLElement, selector: string): number {
  const raw = inputValue(root, selector);
  if (!raw) return 0;
  const normalized = raw.replace(/\s/g, '').replace(/R\$/gi, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function checked(root: HTMLElement, selector: string): boolean {
  return Boolean((root.querySelector(selector) as HTMLInputElement | null)?.checked);
}
