export function releaseBytes(buffer: Uint8Array | null | undefined): void {
  if (buffer) buffer.fill(0);
}

/**
 * Zera recursivamente as propriedades de um objeto para liberar dados sensíveis da memória.
 * Contrato: o caller deve ter propriedade exclusiva do objeto — referências externas ao mesmo
 * objeto ou a sub-objetos serão zeradas também.
 */
export function releaseObject(value: unknown, _visited = new Set<object>(), _depth = 0): void {
  if (!value || typeof value !== 'object') return;
  if (_depth > 20 || _visited.has(value as object)) return;
  _visited.add(value as object);

  for (const key of Object.keys(value as Record<string, unknown>)) {
    const record = value as Record<string, unknown>;
    const current = record[key];

    if (current instanceof Uint8Array) {
      current.fill(0);
    } else if (current && typeof current === 'object') {
      releaseObject(current, _visited, _depth + 1);
    }

    record[key] = undefined;
  }
}
