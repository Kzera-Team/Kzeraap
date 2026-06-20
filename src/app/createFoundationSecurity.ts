import type { Clock } from '../core/Clock';
import { SessionContext, DEFAULT_SESSION_POLICY } from '../runtime/SessionContext';
import { AccessCoordinator } from '../runtime/AccessCoordinator';
import { ResourceScope } from '../runtime/ResourceScope';
import type { RuntimeMetadataStore } from '../runtime/RuntimeMetadata';

export function createFoundationSecurity(stateStore: RuntimeMetadataStore, clock?: Clock) {
  const session = new SessionContext(DEFAULT_SESSION_POLICY, clock);
  const resourceScope = new ResourceScope();

  const accessCoordinator = new AccessCoordinator(stateStore, session);

  resourceScope.register(session);
  resourceScope.register(accessCoordinator);

  return {
    session,
    resourceScope,
    accessCoordinator
  };
}
