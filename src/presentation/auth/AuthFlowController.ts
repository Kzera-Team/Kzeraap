import type { Controller } from '../contracts/Controller';
import type { ObterAuthStateUseCase } from '../../application/auth/ObterAuthStateUseCase';

export interface AuthViewRouter {
  showFirstAccess(root: HTMLElement): Promise<void>;
  showLogin(root: HTMLElement): Promise<void>;
  showFaceIdRequired(root: HTMLElement): Promise<void>;
  showUnlocked(root: HTMLElement): Promise<void>;
}

export class AuthFlowController implements Controller {
  constructor(
    private readonly authState: ObterAuthStateUseCase,
    private readonly viewRouter: AuthViewRouter
  ) {}

  async mount(root: HTMLElement): Promise<void> {
    const state = await this.authState.execute();

    if (state === 'not_initialized') {
      await this.viewRouter.showFirstAccess(root);
      return;
    }

    if (state === 'faceid_required') {
      await this.viewRouter.showFaceIdRequired(root);
      return;
    }

    if (state === 'unlocked') {
      await this.viewRouter.showUnlocked(root);
      return;
    }

    await this.viewRouter.showLogin(root);
  }
}
