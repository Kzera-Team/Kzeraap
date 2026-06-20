import type { RuntimeMetadataStore } from '../../runtime/RuntimeMetadata';
import type { ResourceScope } from '../../runtime/ResourceScope';

export interface ResetarAcessoLocalInput {
  confirmation: string;
}

export class ResetarAcessoLocalUseCase {
  constructor(
    private readonly stateStore: RuntimeMetadataStore,
    private readonly resourceScope: ResourceScope
  ) {}

  async execute(input: ResetarAcessoLocalInput): Promise<void> {
    if (input.confirmation !== 'RESETAR') {
      throw new Error('Digite RESETAR para confirmar.');
    }

    await this.stateStore.clear();
    this.resourceScope.releaseAll();

    try {
      globalThis.localStorage?.removeItem('kzera:passkeyCredentialId');
    } catch {
      // localStorage pode não estar disponível.
    }
  }
}
