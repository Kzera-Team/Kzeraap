import { AppNavigationController } from '../navigation/AppNavigationController';
import { AppLifecycleController } from '../navigation/AppLifecycleController';
import type { createSecurityComposition } from './createSecurityComposition';
import type { UxDomTracker } from '../../presentation/shared/uxTracking/UxDomTracker';
import type { Screen } from '../navigation/Screen';

type SecurityComposition = ReturnType<typeof createSecurityComposition>;

export interface NavigationLifecycleCompositionDependencies {
  security: SecurityComposition;
  uxTracker: UxDomTracker;
  isTextEntryActive(): boolean;
  clearError(): void;
  requestRender(): Promise<void>;
}

export function createNavigationLifecycleComposition(dependencies: NavigationLifecycleCompositionDependencies) {
  const navigation = new AppNavigationController({
    requestRender: dependencies.requestRender,
    trackScreenChange: (screen: Screen, origin) => { void dependencies.uxTracker.telaMudou(screen, origin); }
  });

  const lifecycle = new AppLifecycleController({
    getAuthState: () => dependencies.security.obterAuthState.execute(),
    isTextEntryActive: dependencies.isTextEntryActive,
    requireAttention: () => dependencies.security.security.session.requireAttention(),
    blockSession: () => dependencies.security.bloquear.execute(),
    clearError: dependencies.clearError,
    requestRender: dependencies.requestRender,
    trackBlocked: () => { void dependencies.uxTracker.appBloqueado(); },
    trackUnlocked: () => { void dependencies.uxTracker.appDesbloqueado(); },
    trackReopened: () => { void dependencies.uxTracker.appReaberto(); }
  });

  return { navigation, lifecycle };
}
