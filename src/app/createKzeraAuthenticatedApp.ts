import { APP_VERSION_LABEL } from './appVersion';
import { createKzeraAppComposition } from './createKzeraAppComposition';
import { createAuthenticatedAppControllers } from './authenticated/AuthenticatedAppControllerFactory';
import { AuthenticatedAppErrorState } from './authenticated/AuthenticatedAppErrorState';
import { AuthenticatedAppRenderer } from './authenticated/AuthenticatedAppRenderer';
import { AuthenticatedAppRoot, isTextEntryActive } from './authenticated/AuthenticatedAppRoot';

const PUBLIC_APP_NAME = 'Ve' + 'velt';

export function createKzeraAuthenticatedApp() {
  const root = new AuthenticatedAppRoot();
  const errors = new AuthenticatedAppErrorState();
  let renderer: AuthenticatedAppRenderer;
  let controllers: ReturnType<typeof createAuthenticatedAppControllers> | null = null;

  const composition = createKzeraAppComposition({
    appName: PUBLIC_APP_NAME,
    versionLabel: APP_VERSION_LABEL,
    requestRender: () => renderer.render(),
    isTextEntryActive,
    clearError: () => errors.clear()
  });

  renderer = new AuthenticatedAppRenderer({
    root,
    composition,
    controllers: () => {
      if (!controllers) throw new Error('Controllers do app autenticado não inicializados.');
      return controllers;
    },
    setRootHtml,
    insertRootHtml,
    setElementHtml
  });

  controllers = createAuthenticatedAppControllers({
    appName: PUBLIC_APP_NAME,
    versionLabel: APP_VERSION_LABEL,
    composition,
    getError: () => errors.value,
    setError: error => errors.set(error),
    clearError: () => errors.clear(),
    isTextEntryActive,
    requestRender: () => renderer.render(),
    setRootHtml,
    mountCodigoPerfilScreen: (appRoot, savedRule) => renderer.mountCodigoPerfilScreen(appRoot, savedRule),
    setElementHtml
  });

  function setRootHtml(html: string): void {
    if (root.current) root.current.innerHTML = html;
  }

  function insertRootHtml(html: string): void {
    root.current?.insertAdjacentHTML('beforeend', html);
  }

  function setElementHtml(element: HTMLElement, html: string): void {
    element.innerHTML = html;
  }

  return {
    async mount(rootElement: HTMLElement): Promise<void> {
      root.set(rootElement);
      window.addEventListener('kzera:backup-file-selected', event => composition.backupRestoreUi.handleFileSelected(event));
      await composition.uxTracker.mount(rootElement);
      composition.navigation.bindHistory();
      composition.navigation.bindSwipeNavigation();
      composition.lifecycle.bind();
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState({ screen: composition.navigation.currentScreen }, '', `#${composition.navigation.currentScreen}`);
      }
      await renderer.render();
    }
  };
}
