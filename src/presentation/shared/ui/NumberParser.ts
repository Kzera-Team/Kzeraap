export function parseNumeroOperacional(value: unknown): number {
  const raw = String(value ?? '').trim();
  if (!raw) return 0;
  const normalized = raw
    .replace(/\s/g, '')
    .replace(/R\$/gi, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function parseNumeroOperacionalObrigatorio(value: unknown, label = 'valor'): number {
  const parsed = parseNumeroOperacional(value);
  if (!Number.isFinite(parsed)) throw new Error(`${label} inválido. Use número como 1,5 ou 1.5.`);
  return parsed;
}
