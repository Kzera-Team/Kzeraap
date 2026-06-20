import { releaseBytes } from './RuntimeCleanup';

export interface MaterialDerivationParams {
  salt: Uint8Array;
  iterations: number;
  hash: 'SHA-256' | 'SHA-384' | 'SHA-512';
}

export interface MaterialService {
  deriveFromPassword(password: string, params: MaterialDerivationParams): Promise<CryptoKey>;
}

export const MATERIAL_DEFAULT_ITERATIONS = 600_000;
export const MATERIAL_DEFAULT_HASH: MaterialDerivationParams['hash'] = 'SHA-256';
export const MATERIAL_SALT_BYTES = 32;

export class WebCryptoMaterialService implements MaterialService {
  async deriveFromPassword(password: string, params: MaterialDerivationParams): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const inputBuffer = encoder.encode(password);
    const saltBuffer = new Uint8Array(params.salt);

    try {
      const material = await crypto.subtle.importKey(
        'raw',
        inputBuffer,
        'PBKDF2',
        false,
        ['deriveKey']
      );

      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations: params.iterations,
          hash: params.hash
        },
        material,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    } finally {
      releaseBytes(inputBuffer);
      releaseBytes(saltBuffer);
    }
  }
}
