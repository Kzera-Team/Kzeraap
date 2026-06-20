import type { PayloadCodec } from '../application/ports/PayloadCodec';
import { releaseBytes } from './RuntimeCleanup';
import { SessionContext } from './SessionContext';

export class PayloadProvider implements PayloadCodec {
  constructor(private readonly session: SessionContext) {}

  async packJson<T>(value: T, context: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const inputBuffer = encoder.encode(JSON.stringify(value));
    const aadBuffer = encoder.encode(context);
    let outputBuffer: Uint8Array | null = null;

    try {
      const packedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv, additionalData: aadBuffer },
        this.session.currentMaterial(),
        inputBuffer
      );

      outputBuffer = new Uint8Array(packedBuffer);

      return JSON.stringify({
        alg: 'AES-256-GCM',
        iv: Array.from(iv),
        data: Array.from(outputBuffer)
      });
    } finally {
      releaseBytes(inputBuffer);
      releaseBytes(outputBuffer);
      releaseBytes(aadBuffer);
      releaseBytes(iv);
    }
  }

  async unpackJson<T>(payload: string, context: string): Promise<T> {
    const parsed = JSON.parse(payload) as { iv: number[]; data: number[] };
    const encoder = new TextEncoder();
    const iv = new Uint8Array(parsed.iv);
    const inputBuffer = new Uint8Array(parsed.data);
    const aadBuffer = encoder.encode(context);
    let workingBuffer: Uint8Array | null = null;

    try {
      const raw = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv, additionalData: aadBuffer },
        this.session.currentMaterial(),
        inputBuffer
      );

      workingBuffer = new Uint8Array(raw);
      return JSON.parse(new TextDecoder().decode(workingBuffer)) as T;
    } finally {
      releaseBytes(workingBuffer);
      releaseBytes(inputBuffer);
      releaseBytes(aadBuffer);
      releaseBytes(iv);
    }
  }
}

// cleanup implementation delegates to releaseBytes, which uses fill(0)
