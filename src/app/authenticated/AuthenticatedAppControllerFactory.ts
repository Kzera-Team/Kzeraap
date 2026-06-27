import { AuthScreenController } from '../auth/AuthScreenController';
import { AppSessionAttentionController } from '../auth/AppSessionAttentionController';
import { BackupModalPresenter } from '../backup/BackupModalPresenter';
import { CodigoPerfilConfigController } from '../codigoPerfil/CodigoPerfilConfigController';
import { FinanceiroScreensController } from '../financeiro/FinanceiroScreensController';
import { ImportacaoRetomadaController } from '../importacao/ImportacaoRetomadaController';
import { AppNavigationBinder } from '../navigation/AppNavigationBinder';
import { AppScreenMountController } from '../navigation/AppScreenMountController';
import { AppOverlayController } from '../AppOverlayController';
import { AppShellRenderer } from '../shell/AppShellRenderer';
import { AuthenticatedShellController } from '../shell/AuthenticatedShellController';
import type { createKzeraAppComposition } from '../createKzeraAppComposition';

type AppComposition = ReturnType<typeof createKzeraAppComposition>;

export interface AuthenticatedAppControllerFactoryDependencies {
  appName: string;
  versionLabel: string;
  composition: AppComposition;
  getError(): string;
  setError(error: string): void;
  clearError(): void;
  isTextEntryActive(): boolean;
  requestRender(): Promise<void>;
  setRootHtml(html: string): void;
  mountCodigoPerfilScreen(appRoot: HTMLElement, savedRule: NonNullable<Awaited<ReturnType<AppComposition['codigoPerfilRules']['ensure']>>>): void;
  setElementHtml(element: HTMLElement, html: string): void;
}

export function createAuthenticatedAppControllers(dependencies: AuthenticatedAppControllerFactoryDependencies) {
  const { composition } = dependencies;

  const sessionAttention = new AppSessionAttentionController({
    getAuthState: composition.obterAuthState,
    confirmFaceId: composition.confirmarAtencao,
    faceIdGateway: composition.faceIdGateway,
    blockSession: composition.bloquear,
    touchSession: () => composition.security.session.touch(),
    requireAttention: () => composition.security.session.requireAttention(),
    isTextEntryActive: dependencies.isTextEntryActive,
    requestRender: dependencies.requestRender
  });

  const authScreens = new AuthScreenController({
    appName: dependencies.appName,
    versionLabel: dependencies.versionLabel,
    primeiroAcesso: composition.primeiroAcesso,
    login: composition.login,
    confirmarAtencao: composition.confirmarAtencao,
    getError: dependencies.getError,
    setError: dependencies.setError,
    clearError: dependencies.clearError,
    resetAutoFaceIdAttempt: () => sessionAttention.resetAutoFaceIdAttempt(),
    configureFaceIdAutomatically: () => sessionAttention.configureFaceIdAutomatically(),
    confirmAttentionAutomatically: () => sessionAttention.confirmAttentionAutomatically(),
    showCodigo: () => composition.navigation.show('codigo'),
    requestRender: dependencies.requestRender
  });

  const codigoPerfilScreens = new CodigoPerfilConfigController({
    appName: dependencies.appName,
    getError: dependencies.getError,
    setError: dependencies.setError,
    clearError: dependencies.clearError,
    saveRule: rule => composition.codigoPerfilRules.save(rule),
    configureFaceIdAutomatically: () => sessionAttention.configureFaceIdAutomatically(),
    navigateHome: () => composition.navigation.navigate('home'),
    requestRender: dependencies.requestRender
  });

  const navigationBinder = new AppNavigationBinder({
    navigation: composition.navigation,
    perfilApp: composition.perfilApp,
    itemApp: composition.itemApp,
    blockSession: composition.bloquear,
    clearError: dependencies.clearError
  });

  const financeiroScreens = new FinanceiroScreensController({
    resumoFinanceiro: composition.resumoFinanceiro,
    relatorioOperacional: composition.relatorioOperacional,
    requestRender: dependencies.requestRender
  });

  const importacaoRetomada = new ImportacaoRetomadaController({
    importacaoRascunho: composition.importacaoRascunho,
    perfilApp: composition.perfilApp,
    itemApp: composition.itemApp,
    navigation: composition.navigation,
    requestRender: dependencies.requestRender
  });

  const backupModal = new BackupModalPresenter({
    controller: composition.backupController,
    requestRender: dependencies.requestRender
  });

  const shellRenderer = new AppShellRenderer();

  const authenticatedShell = new AuthenticatedShellController({
    appName: dependencies.appName,
    versionLabel: dependencies.versionLabel,
    perfis: composition.perfis,
    itens: composition.itens,
    navigation: composition.navigation,
    backupController: composition.backupController,
    shellRenderer,
    setRootHtml: dependencies.setRootHtml
  });

  const screenMountController = new AppScreenMountController({
    perfilApp: composition.perfilApp,
    itemApp: composition.itemApp,
    importacaoTransacoesFinanceiroApp: composition.importacaoTransacoesFinanceiroApp,
    configuracoesApp: composition.configuracoesApp,
    financeiroScreens,
    renderCodigoPerfil: dependencies.mountCodigoPerfilScreen,
    renderTransacoes: dependencies.setElementHtml,
    renderRelatorios: dependencies.setElementHtml
  });

  const overlayController = new AppOverlayController({
    backupController: composition.backupController,
    backupModal,
    importacaoRetomada,
    getCurrentScreen: () => composition.navigation.currentScreen
  });

  return {
    sessionAttention,
    authScreens,
    codigoPerfilScreens,
    navigationBinder,
    authenticatedShell,
    screenMountController,
    overlayController
  };
}
