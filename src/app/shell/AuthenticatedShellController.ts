import type { ItemCatalogo } from '../../domain/item/ItemCatalogo';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { BackupExportController } from '../backup/BackupExportController';
import type { AppNavigationController } from '../navigation/AppNavigationController';
import { AppShellRenderer } from './AppShellRenderer';

interface ListUseCase<T> {
  list(): Promise<T[]>;
}

interface AuthenticatedShellControllerParams {
  appName: string;
  versionLabel: string;
  perfis: ListUseCase<Perfil>;
  itens: ListUseCase<ItemCatalogo>;
  navigation: AppNavigationController;
  backupController: BackupExportController;
  shellRenderer: AppShellRenderer;
  setRootHtml(html: string): void;
}

export class AuthenticatedShellController {
  constructor(private readonly params: AuthenticatedShellControllerParams) {}

  async render(): Promise<void> {
    if (this.params.navigation.currentScreen === 'home') {
      await this.renderHome();
      return;
    }

    this.renderFrame();
  }

  private async renderHome(): Promise<void> {
    const perfisLista = await this.params.perfis.list();
    const itensLista = await this.params.itens.list();

    this.params.setRootHtml(this.params.shellRenderer.renderHome({
      currentScreen: this.params.navigation.currentScreen,
      isMenuOpen: this.params.navigation.isMenuOpen,
      appName: this.params.appName,
      versionLabel: this.params.versionLabel,
      perfisAtivos: perfisLista.filter(perfil => perfil.status === 'ativo').length,
      itensAtivos: itensLista.filter(item => item.status === 'ativo').length,
      backupRequired: Boolean(this.params.backupController.decision?.required)
    }));
  }

  private renderFrame(): void {
    this.params.setRootHtml(this.params.shellRenderer.renderFrame({
      currentScreen: this.params.navigation.currentScreen,
      isMenuOpen: this.params.navigation.isMenuOpen,
      appName: this.params.appName,
      versionLabel: this.params.versionLabel
    }));
  }
}
