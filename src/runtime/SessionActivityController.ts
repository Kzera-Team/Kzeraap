import type { Clock } from '../core/Clock';
import type { SessionContext } from './SessionContext';
import type { ResourceScope } from './ResourceScope';

export class SessionActivityController {
  private listening = false;
  private readonly activityEvents = ['click', 'input', 'keydown', 'touchstart', 'visibilitychange'];

  constructor(
    private readonly session: SessionContext,
    private readonly resourceScope: ResourceScope,
    private readonly clock: Clock = { now: () => new Date() }
  ) {}

  bind(target: Document | HTMLElement = document): void {
    if (this.listening) return;

    for (const event of this.activityEvents) {
      target.addEventListener(event, this.handleActivity, { passive: true });
    }

    this.listening = true;
  }

  unbind(target: Document | HTMLElement = document): void {
    if (!this.listening) return;

    for (const event of this.activityEvents) {
      target.removeEventListener(event, this.handleActivity);
    }

    this.listening = false;
  }

  evaluate(): void {
    const now = this.clock.now().getTime();
    if (this.session.requiresContext(now)) {
      this.resourceScope.releaseAll();
    }
  }

  private readonly handleActivity = (): void => {
    const now = this.clock.now().getTime();

    if (this.session.state(now) === 'ready') {
      this.session.touch(now);
    }
  };
}
