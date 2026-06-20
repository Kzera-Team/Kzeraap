import type { AuthState } from '../../domain/auth/AuthState';
import type { SessionContext } from '../../runtime/SessionContext';
import type { AccessCoordinator } from '../../runtime/AccessCoordinator';

export class ObterAuthStateUseCase {
  constructor(
    private readonly accessCoordinator: AccessCoordinator,
    private readonly session: SessionContext
  ) {}

  async execute(now = Date.now()): Promise<AuthState> {
    if (!(await this.accessCoordinator.isInitialized())) {
      return 'not_initialized';
    }

    const state = this.session.state(now);

    if (state === 'closed') return 'locked';
    if (state === 'ready') return 'unlocked';
    if (state === 'attention_required') return 'faceid_required';
    if (state === 'context_required') return 'password_required';

    return 'locked';
  }
}
