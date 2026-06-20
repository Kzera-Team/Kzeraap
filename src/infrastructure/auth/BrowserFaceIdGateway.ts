import type { FaceIdGateway } from '../../application/auth/ConfirmarFaceIdUseCase';

const PASSKEY_STORAGE_KEY = 'kzera:passkeyCredentialId';
const PUBLIC_APP_NAME = 'Ve' + 'velt';

function bytesToBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), char => char.charCodeAt(0));
}

function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

export class BrowserFaceIdGateway implements FaceIdGateway {
  private lastFailureReason = '';

  getLastFailureReason(): string {
    return this.lastFailureReason;
  }

  private fail(reason: string): false {
    this.lastFailureReason = reason;
    return false;
  }

  isSupported(): boolean {
    return Boolean('PublicKeyCredential' in globalThis && typeof navigator.credentials?.create === 'function' && typeof navigator.credentials?.get === 'function');
  }

  isConfigured(): boolean {
    return Boolean(globalThis.localStorage?.getItem(PASSKEY_STORAGE_KEY));
  }

  async configure(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const saved = globalThis.localStorage?.getItem(PASSKEY_STORAGE_KEY);
      if (saved) return true;

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: randomBytes(32),
          rp: { name: PUBLIC_APP_NAME },
          user: {
            id: randomBytes(32),
            name: 'kzera-local-user',
            displayName: PUBLIC_APP_NAME
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 }
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            residentKey: 'preferred',
            userVerification: 'required'
          },
          timeout: 60_000,
          attestation: 'none'
        }
      } as CredentialCreationOptions) as PublicKeyCredential | null;

      if (!credential) return false;

      const rawId = new Uint8Array(credential.rawId);
      globalThis.localStorage?.setItem(PASSKEY_STORAGE_KEY, bytesToBase64Url(rawId));
      return true;
    } catch {
      return false;
    }
  }

  async authenticate(reason: string): Promise<boolean> {
    this.lastFailureReason = '';

    try {
      if (!this.isSupported()) return this.fail('Face ID não disponível neste navegador ou aparelho. Entre com senha.');

      const saved = globalThis.localStorage?.getItem(PASSKEY_STORAGE_KEY);
      if (!saved) return this.fail('Face ID ainda não foi configurado neste aparelho. Entre com senha.');

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: randomBytes(32),
          timeout: 60_000,
          userVerification: 'required',
          allowCredentials: [{
            id: base64UrlToBytes(saved),
            type: 'public-key',
            transports: ['internal']
          }]
        }
      } as CredentialRequestOptions);

      if (!credential) return this.fail('Face ID não confirmou o acesso. Entre com senha ou tente novamente.');

      return true;
    } catch (error) {
      const name = error instanceof DOMException ? error.name : '';
      if (name === 'NotAllowedError') return this.fail('Face ID cancelado, expirado ou não autorizado. Tente novamente ou entre com senha.');
      if (name === 'SecurityError') return this.fail('Face ID bloqueado pela origem do app. Verifique se está em HTTPS e tente novamente.');
      if (name === 'AbortError') return this.fail('Face ID interrompido antes da confirmação. Tente novamente ou entre com senha.');
      return this.fail('Face ID não confirmado. Tente novamente ou entre com senha.');
    }
  }
}
