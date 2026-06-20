import { releaseBytes, releaseObject } from './RuntimeCleanup';

export function releaseTextBuffer(value: string): void {
  const buffer = new TextEncoder().encode(value);
  releaseBytes(buffer);
}

export function releaseTransferPayload(value: unknown): void {
  if (typeof value === 'string') {
    releaseTextBuffer(value);
    return;
  }

  if (value instanceof Uint8Array) {
    releaseBytes(value);
    return;
  }

  releaseObject(value);
}
