import type { BloquearSessaoUseCase } from '../../application/auth/BloquearSessaoUseCase';
import type { Screen } from './Screen';
import type { AppNavigationController } from './AppNavigationController';

interface QuickMountApp {
  mountNovo(root: HTMLElement): Promise<void>;
}

interface AppNavigationBinderParams {
  navigation: AppNavigationController;
  perfilApp: QuickMountApp;
  itemApp: QuickMountApp;
  blockSession: BloquearSessaoUseCase;
  clearError: () => void;
}

export class AppNavigationBinder {
  constructor(private readonly params: AppNavigationBinderParams) {}

  bind(root: HTMLElement): void {
    root.querySelectorAll('[data-nav]').forEach(button => {
      button.addEventListener('click', async () => {
        await this.params.navigation.navigate(((button as HTMLElement).dataset.nav as Screen) || 'home');
      });
    });
    root.querySelectorAll('[data-menu-toggle]').forEach(button => {
      button.addEventListener('click', async () => this.params.navigation.toggleMenu());
    });
    root.querySelectorAll('[data-menu-close]').forEach(button => {
      button.addEventListener('click', async () => this.params.navigation.closeMenu());
    });
    root.querySelectorAll('[data-quick="novo-perfil"]').forEach(button => {
      button.addEventListener('click', async () => {
        await this.params.navigation.openQuickAction('perfis');
        const main = root.querySelector('#kzera-main') as HTMLElement | null;
        if (main) await this.params.perfilApp.mountNovo(main);
      });
    });
    root.querySelectorAll('[data-quick="novo-item"]').forEach(button => {
      button.addEventListener('click', async () => {
        await this.params.navigation.openQuickAction('itens');
        const main = root.querySelector('#kzera-main') as HTMLElement | null;
        if (main) await this.params.itemApp.mountNovo(main);
      });
    });
    root.querySelectorAll('[data-testid="logout-button"]').forEach(button => {
      button.addEventListener('click', async () => {
        this.params.blockSession.execute();
        this.params.clearError();
        await this.params.navigation.resetToHome();
      });
    });
  }
}
