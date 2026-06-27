import { appClock } from './composition/AppCompositionIds';
import { createSecurityComposition } from './composition/createSecurityComposition';
import { createRepositoryComposition } from './composition/createRepositoryComposition';
import { createImportacaoFinanceiroComposition } from './composition/createImportacaoFinanceiroComposition';
import { createUxComposition } from './composition/createUxComposition';
import { createFeatureAppComposition } from './composition/createFeatureAppComposition';
import { createBackupComposition } from './composition/createBackupComposition';
import { createNavigationLifecycleComposition } from './composition/createNavigationLifecycleComposition';

interface CreateKzeraAppCompositionParams {
  appName: string;
  versionLabel: string;
  requestRender: () => Promise<void>;
  isTextEntryActive: () => boolean;
  clearError: () => void;
}

export function createKzeraAppComposition(params: CreateKzeraAppCompositionParams) {
  const securityComposition = createSecurityComposition(appClock);
  const repositories = createRepositoryComposition(securityComposition.security.session);
  const importacao = createImportacaoFinanceiroComposition(repositories, appClock);
  securityComposition.security.resourceScope.register(importacao.importacaoTransacoesFinanceiroApp);

  const ux = createUxComposition(appClock);
  const features = createFeatureAppComposition({
    repositories,
    clock: appClock,
    codigoPerfilRules: securityComposition.codigoPerfilRules,
    uxTracker: ux.uxTracker
  });

  const backup = createBackupComposition({
    appName: params.appName,
    versionLabel: params.versionLabel,
    security: securityComposition,
    repositories,
    requestRender: params.requestRender
  });

  const navigationLifecycle = createNavigationLifecycleComposition({
    security: securityComposition,
    uxTracker: ux.uxTracker,
    isTextEntryActive: params.isTextEntryActive,
    clearError: params.clearError,
    requestRender: params.requestRender
  });

  return {
    ...securityComposition,
    ...repositories,
    ...importacao,
    ...features,
    ...backup,
    ...ux,
    ...navigationLifecycle
  };
}
