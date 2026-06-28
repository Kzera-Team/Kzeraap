import type { ConfirmarFaceIdUseCase } from '../../application/auth/ConfirmarFaceIdUseCase';
import type { LoginUseCase } from '../../application/auth/LoginUseCase';
import type { PrimeiroAcessoUseCase } from '../../application/auth/PrimeiroAcessoUseCase';
import { renderAuthPasswordForm } from '../../presentation/shared/components/AuthPasswordForm/AuthPasswordForm';
import { bindAuthPasswordToggles } from './AuthPasswordToggleBinder';
import { AuthScreenRenderer } from './AuthScreenRenderer';

interface AuthScreenControllerParams {
  appName: string;
  versionLabel: string;
  primeiroAcesso: PrimeiroAcessoUseCase;
  login: LoginUseCase;
  confirmarAtencao: ConfirmarFaceIdUseCase;
  getError(): string;
  setError(error: string): void;
  clearError(): void;
  resetAutoFaceIdAttempt(): void;
  configureFaceIdAutomatically(): Promise<void>;
  confirmAttentionAutomatically(): Promise<void>;
  showCodigo(): Promise<void>;
  requestRender(): Promise<void>;
}

export class AuthScreenController {
  private readonly renderer: AuthScreenRenderer;

  constructor(private readonly params: AuthScreenControllerParams) {
    this.renderer = new AuthScreenRenderer({
      appName: params.appName,
      versionLabel: params.versionLabel,
      getError: params.getError
    });
  }

  renderAuthState(root: HTMLElement, authState: string, setRootHtml: (html: string) => void): boolean {
    if (authState === 'not_initialized') {
      setRootHtml(this.renderer.renderSetup());
      this.bindSetup(root);
      return true;
    }

    if (authState === 'faceid_required') {
      setRootHtml(this.renderer.renderAttention());
      this.bindAttention(root);
      return true;
    }

    if (authState !== 'unlocked') {
      this.renderLogin(root);
      return true;
    }

    return false;
  }

  private bindRecoveryReveal(root: HTMLElement): void {
    const trigger = root.querySelector<HTMLElement>('[data-auth-recovery-trigger]');
    const panel = root.querySelector<HTMLElement>('#backup-recovery-shell');
    if (!trigger || !panel) return;

    let taps = 0;
    let lastTapAt = 0;

    trigger.addEventListener('click', () => {
      const now = Date.now();
      taps = now - lastTapAt > 2000 ? 1 : taps + 1;
      lastTapAt = now;

      if (taps >= 10) {
        panel.hidden = false;
        taps = 0;
      }
    });
  }

  private bindSetup(root: HTMLElement): void {
    bindAuthPasswordToggles(root);
    this.bindRecoveryReveal(root);
    root.querySelector('[data-testid="setup-form"]')?.addEventListener('submit', async event => {
      event.preventDefault();
      this.params.clearError();
      const password = (root.querySelector('#setup-password') as HTMLInputElement | null)?.value || '';
      const confirmation = (root.querySelector('#setup-confirmation') as HTMLInputElement | null)?.value || '';

      try {
        await this.params.primeiroAcesso.execute({ password, confirmation });
        await this.params.login.execute({ password });
        this.params.resetAutoFaceIdAttempt();
        await this.params.showCodigo();
      } catch (error) {
        this.params.setError(error instanceof Error ? error.message : 'Não foi possível configurar o acesso.');
        await this.params.requestRender();
      }
    });
  }

  private bindAttention(root: HTMLElement): void {
    bindAuthPasswordToggles(root);
    void this.params.confirmAttentionAutomatically();

    root.querySelector('[data-testid="attention-button"]')?.addEventListener('click', async () => {
      await this.confirmAttentionByFaceId();
    });

    root.querySelector('[data-testid="attention-form"]')?.addEventListener('submit', async event => {
      event.preventDefault();
      const password = (root.querySelector('#attention-password') as HTMLInputElement | null)?.value || '';
      await this.loginWithPassword(password);
    });
  }

  private renderLogin(root: HTMLElement): void {
    renderAuthPasswordForm(root, {
      appName: this.params.appName,
      versionLabel: this.params.versionLabel,
      testId: 'login-form',
      title: 'Entrar',
      description: 'Digite a senha. Sem pressa.',
      inputId: 'login-password',
      inputLabel: 'Senha',
      buttonLabel: 'Entrar',
      error: this.params.getError()
    }, password => {
      void this.loginWithPassword(password);
    });
  }

  private async confirmAttentionByFaceId(): Promise<void> {
    this.params.clearError();
    this.params.resetAutoFaceIdAttempt();

    try {
      await this.params.confirmarAtencao.execute();
      this.params.resetAutoFaceIdAttempt();
      await this.params.requestRender();
    } catch (error) {
      this.params.setError(error instanceof Error ? error.message : 'Não foi possível confirmar a identidade.');
      await this.params.requestRender();
    }
  }

  private async loginWithPassword(password: string): Promise<void> {
    this.params.clearError();

    try {
      await this.params.login.execute({ password });
      this.params.resetAutoFaceIdAttempt();
      await this.params.configureFaceIdAutomatically();
      await this.params.requestRender();
    } catch (error) {
      this.params.setError(error instanceof Error ? error.message : 'Senha inválida.');
      await this.params.requestRender();
    }
  }
}
