import { DomainError } from '../../core/DomainError';
import type { SessionContext } from '../../runtime/SessionContext';

const PUBLIC_APP_NAME = 'Ve' + 'velt';

export interface FaceIdGateway {
  authenticate(reason: string): Promise<boolean>;
  getLastFailureReason?(): string;
}

export class ConfirmarFaceIdUseCase {
  constructor(
    private readonly session: SessionContext,
    private readonly faceIdGateway: FaceIdGateway
  ) {}

  async execute(): Promise<void> {
    const ok = await this.faceIdGateway.authenticate(`Confirmar identidade para continuar usando o ${PUBLIC_APP_NAME}.`);

    if (!ok) {
      throw new DomainError(this.faceIdGateway.getLastFailureReason?.() || 'Face ID não confirmado.', 'FACE_ID_NOT_CONFIRMED');
    }

    this.session.confirmAttention();
  }
}

