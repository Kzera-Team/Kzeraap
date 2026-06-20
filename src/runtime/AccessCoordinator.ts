import { DomainError } from '../core/DomainError';
import type { MaterialDerivationParams, MaterialService } from './MaterialService';
import {
  MATERIAL_DEFAULT_HASH,
  MATERIAL_DEFAULT_ITERATIONS,
  MATERIAL_SALT_BYTES,
  WebCryptoMaterialService
} from './MaterialService';
import type { RuntimeMetadata, RuntimeMetadataStore } from './RuntimeMetadata';
import type { SessionContext } from './SessionContext';
import { PayloadProvider } from './PayloadProvider';
import type { Releasable } from './ResourceScope';
import { releaseBytes } from './RuntimeCleanup';

export interface CreateMasterPasswordInput {
  password: string;
  now?: string;
}

export interface UnlockInput {
  password: string;
  now?: number;
}

export interface RotateMasterPasswordInput {
  currentPassword: string;
  nextPassword: string;
  now?: string;
}

export class InvalidMasterPasswordError extends DomainError {
  constructor() {
    super('Credencial inválida.', 'INVALID_ACCESS_CONTEXT');
  }
}

function randomSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(MATERIAL_SALT_BYTES));
}

function paramsFromMetadata(runtimeState: RuntimeMetadata): MaterialDerivationParams {
  return {
    salt: new Uint8Array(runtimeState.salt),
    iterations: runtimeState.iterations,
    hash: runtimeState.hash
  };
}

export class AccessCoordinator implements Releasable {
  private readonly materialService: MaterialService;

  constructor(
    private readonly stateStore: RuntimeMetadataStore,
    private readonly session: SessionContext,
    materialService: MaterialService = new WebCryptoMaterialService()
  ) {
    this.materialService = materialService;
  }

  async isInitialized(): Promise<boolean> {
    return Boolean(await this.stateStore.load());
  }

  async createMasterPassword(input: CreateMasterPasswordInput): Promise<void> {
    if (await this.isInitialized()) {
      throw new DomainError('Credencial já configurada.', 'ACCESS_CONTEXT_ALREADY_CONFIGURED');
    }

    const salt = randomSalt();
    const createdAt = input.now || new Date().toISOString();
    const runtimeStateBase = {
      id: 'runtime_state' as const,
      version: 1 as const,
      salt: Array.from(salt),
      iterations: MATERIAL_DEFAULT_ITERATIONS,
      hash: MATERIAL_DEFAULT_HASH,
      createdAt,
      updatedAt: createdAt
    };

    const key = await this.materialService.deriveFromPassword(input.password, {
      salt,
      iterations: runtimeStateBase.iterations,
      hash: runtimeStateBase.hash
    });

    this.session.open(key);
    const provider = new PayloadProvider(this.session);
    const probe = await provider.packJson({ ok: true, createdAt }, 'runtime:probe');

    await this.stateStore.save({
      ...runtimeStateBase,
      probe
    });

    releaseBytes(salt);
    this.session.close();
  }


private async validatePassword(runtimeState: RuntimeMetadata, password: string): Promise<void> {
  const params = paramsFromMetadata(runtimeState);
  const key = await this.materialService.deriveFromPassword(password, params);
  releaseBytes(params.salt);

  const previous = this.session.state();
  this.session.open(key);

  try {
    const provider = new PayloadProvider(this.session);
    await provider.unpackJson(runtimeState.probe, 'runtime:probe');
  } catch {
    if (previous !== 'ready') this.session.close();
    throw new InvalidMasterPasswordError();
  }

  if (previous !== 'ready') this.session.close();
}

async rotateMasterPassword(input: RotateMasterPasswordInput): Promise<void> {
  const runtimeState = await this.stateStore.load();

  if (!runtimeState) {
    throw new DomainError('Credencial ainda não configurada.', 'ACCESS_CONTEXT_NOT_CONFIGURED');
  }

  await this.validatePassword(runtimeState, input.currentPassword);

  const salt = randomSalt();
  const updatedAt = input.now || new Date().toISOString();

  const nextStateBase = {
    ...runtimeState,
    salt: Array.from(salt),
    iterations: MATERIAL_DEFAULT_ITERATIONS,
    hash: MATERIAL_DEFAULT_HASH,
    updatedAt
  };

  const key = await this.materialService.deriveFromPassword(input.nextPassword, {
    salt,
    iterations: nextStateBase.iterations,
    hash: nextStateBase.hash
  });

  this.session.open(key);
  const provider = new PayloadProvider(this.session);
  const probe = await provider.packJson({ ok: true, updatedAt }, 'runtime:probe');

  await this.stateStore.save({
    ...nextStateBase,
    probe
  });

  releaseBytes(salt);
  this.session.close();
}

  async open(input: UnlockInput): Promise<void> {
    const runtimeState = await this.stateStore.load();

    if (!runtimeState) {
      throw new DomainError('Credencial ainda não configurada.', 'ACCESS_CONTEXT_NOT_CONFIGURED');
    }

    const params = paramsFromMetadata(runtimeState);
    const key = await this.materialService.deriveFromPassword(input.password, params);
    releaseBytes(params.salt);
    this.session.open(key, input.now);

    try {
      const provider = new PayloadProvider(this.session);
      await provider.unpackJson(runtimeState.probe, 'runtime:probe');
    } catch {
      this.session.close();
      throw new InvalidMasterPasswordError();
    }
  }

  async close(): Promise<void> {
    this.release();
  }

  release(): void {
    this.session.close();
  }
}
