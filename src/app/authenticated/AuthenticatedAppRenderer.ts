import { DEFAULT_CODIGO_PERFIL_RULE } from '../codigoPerfil/CodigoPerfilRuleService';
import type { createKzeraAppComposition } from '../createKzeraAppComposition';
import type { AuthenticatedAppRoot } from './AuthenticatedAppRoot';
import type { createAuthenticatedAppControllers } from './AuthenticatedAppControllerFactory';

type AppComposition = ReturnType<typeof createKzeraAppComposition>;
type AuthenticatedAppControllers = ReturnType<typeof createAuthenticatedAppControllers>;
type CodigoPerfilRule = NonNullable<Awaited<ReturnType<AppComposition['codigoPerfilRules']['ensure']>>>;

export interface AuthenticatedAppRendererDependencies {
  root: AuthenticatedAppRoot;
  composition: AppComposition;
  controllers(): AuthenticatedAppControllers;
  setRootHtml(html: string): void;
  insertRootHtml(html: string): void;
  setElementHtml(element: HTMLElement, html: string): void;
}

export class AuthenticatedAppRenderer {
  constructor(private readonly dependencies: AuthenticatedAppRendererDependencies) {}

  async render(): Promise<void> {
    const root = this.dependencies.root.current;
    if (!root) return;

    const { backupRestoreUi, obterAuthState } = this.dependencies.composition;
    const authState = await obterAuthState.execute();

    if (backupRestoreUi.hasPendingFile()) {
      backupRestoreUi.renderPasswordScreen(root);
      return;
    }

    const controllers = this.dependencies.controllers();
    if (controllers.authScreens.renderAuthState(root, authState, html => this.dependencies.setRootHtml(html))) return;

    await this.renderUnlocked();
  }

  mountCodigoPerfilScreen(appRoot: HTMLElement, savedRule: CodigoPerfilRule): void {
    const controllers = this.dependencies.controllers();
    this.dependencies.setElementHtml(appRoot, controllers.codigoPerfilScreens.render(savedRule, 'authenticated'));
    controllers.codigoPerfilScreens.bind(appRoot);
  }

  private async renderUnlocked(): Promise<void> {
    document.getElementById('backup-recovery-shell')?.setAttribute('hidden', '');
    const root = this.dependencies.root.current;
    if (!root) return;

    const savedRule = await this.dependencies.composition.codigoPerfilRules.ensure();
    const controllers = this.dependencies.controllers();

    if (!savedRule) {
      this.dependencies.setRootHtml(controllers.codigoPerfilScreens.render(DEFAULT_CODIGO_PERFIL_RULE, 'onboarding'));
      controllers.codigoPerfilScreens.bind(root);
      return;
    }

    await controllers.authenticatedShell.render();
    await controllers.overlayController.refreshAndBind(root, html => this.dependencies.insertRootHtml(html));
    controllers.navigationBinder.bind(root);
    await this.mountCurrentScreen(savedRule);
    this.dependencies.root.bindSessionTouch(() => controllers.sessionAttention.touch());
    controllers.sessionAttention.schedule();
    this.dependencies.composition.backupController.scheduleCheck();
  }

  private async mountCurrentScreen(savedRule: CodigoPerfilRule): Promise<void> {
    const currentScreen = this.dependencies.composition.navigation.currentScreen;
    if (currentScreen === 'home') return;

    const appRoot = this.dependencies.root.main();
    await this.dependencies.controllers().screenMountController.mount(currentScreen, appRoot, savedRule);
  }
}
