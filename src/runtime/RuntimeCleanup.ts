export function releaseBytes(buffer: Uint8Array | null | undefined): void {
  if (buffer) buffer.fill(0);
}

export function releaseObject(value: unknown): void {
  if (!value || typeof value !== 'object') return;

  for (const key of Object.keys(value as Record<string, unknown>)) {
    const record = value as Record<string, unknown>;
    const current = record[key];

    if (current instanceof Uint8Array) {
      current.fill(0);
    } else if (current && typeof current === 'object') {
      releaseObject(current);
    }

    record[key] = undefined;
  }
}
