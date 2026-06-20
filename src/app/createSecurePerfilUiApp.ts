import type { Clock } from '../core/Clock';
import type { Repository } from '../application/ports/Repository';
import type { Perfil } from '../domain/perfil/Perfil';
import type { SessionContext } from '../runtime/SessionContext';
import type { ResourceScope } from '../runtime/ResourceScope';
import { SessionActivityController } from '../runtime/SessionActivityController';
import { createPerfilUiApp } from './createPerfilUiApp';

export interface SecurePerfilUiAppOptions {
  perfis: Repository<Perfil>;
  clock: Clock;
  idFactory: () => string;
  session: SessionContext;
  resourceScope: ResourceScope;
}

export function createSecurePerfilUiApp(options: SecurePerfilUiAppOptions) {
  const app = createPerfilUiApp(options.perfis, options.clock, options.idFactory);
  const activity = new SessionActivityController(options.session, options.resourceScope, options.clock);

  return {
    async mount(root: HTMLElement): Promise<void> {
      activity.bind(document);
      activity.evaluate();
      await app.mount(root);
    },

    unmount(): void {
      activity.unbind(document);
      options.resourceScope.releaseAll();
    }
  };
}
