import type { BloquearSessaoUseCase } from '../../application/auth/BloquearSessaoUseCase';
import type { ConfirmarFaceIdUseCase } from '../../application/auth/ConfirmarFaceIdUseCase';
import type { ObterAuthStateUseCase } from '../../application/auth/ObterAuthStateUseCase';
import type { BrowserFaceIdGateway } from '../../infrastructure/auth/BrowserFaceIdGateway';

interface AppSessionAttentionControllerParams {
  getAuthState: ObterAuthStateUseCase;
  confirmFaceId: ConfirmarFaceIdUseCase;
  faceIdGateway: BrowserFaceIdGateway;
  blockSession: BloquearSessaoUseCase;
  touchSession: () => void;
  requireAttention: () => void;
  isTextEntryActive: () => boolean;
  requestRender: () => Promise<void>;
}

export class AppSessionAttentionController {
  private activityTimer: number | undefined;
  private autoFaceIdTried = false;

  constructor(private readonly params: AppSessionAttentionControllerParams) {}

  touch(): void {
    this.params.touchSession();
    this.schedule();
  }

  resetAutoFaceIdAttempt(): void {
    this.autoFaceIdTried = false;
  }

  async configureFaceIdAutomatically(): Promise<void> {
    if (this.params.faceIdGateway.isConfigured()) return;
    await this.params.faceIdGateway.configure();
  }

  async confirmAttentionAutomatically(): Promise<void> {
    if (this.autoFaceIdTried || this.params.isTextEntryActive()) return;
    this.autoFaceIdTried = true;
    try {
      await this.params.confirmFaceId.execute();
      this.autoFaceIdTried = false;
      await this.params.requestRender();
    } catch {
      // fallback por senha/botão
    }
  }

  schedule(): void {
    if (this.activityTimer) window.clearTimeout(this.activityTimer);
    this.activityTimer = window.setTimeout(async () => {
      const state = await this.params.getAuthState.execute();
      if (state !== 'unlocked') {
        if (this.params.isTextEntryActive()) {
          this.schedule();
          return;
        }
        await this.params.requestRender();
        return;
      }
      this.schedule();
    }, 1_000);
  }

  block(): void {
    this.params.blockSession.execute();
  }

  requireAttention(): void {
    this.params.requireAttention();
  }
}
