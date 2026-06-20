import type { Repository } from '../application/ports/Repository';
import type { Perfil } from '../domain/perfil/Perfil';
import type { Clock } from '../core/Clock';
import type { SessionContext } from '../runtime/SessionContext';
import type { AccessCoordinator } from '../runtime/AccessCoordinator';
import type { ResourceScope } from '../runtime/ResourceScope';

export interface AppContext {
  clock: Clock;
  idFactory: () => string;
  security: {
    session: SessionContext;
    accessCoordinator: AccessCoordinator;
    resourceScope: ResourceScope;
  };
  auth?: Record<string, unknown>;
  repositories: {
    perfis: Repository<Perfil>;
  };
}
