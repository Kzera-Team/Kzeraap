import type { Clock } from '../core/Clock';
import { DomainError } from '../core/DomainError';
import type { Releasable } from './ResourceScope';

export type SessionState = 'closed' | 'ready' | 'attention_required' | 'context_required';

export interface SessionPolicy {
  attentionAfterIdleMs: number;
  contextAfterActiveMs: number;
}

export const DEFAULT_SESSION_POLICY: SessionPolicy = {
  attentionAfterIdleMs: 60_000,
  contextAfterActiveMs: 5 * 60 * 60 * 1000
};

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

export class SessionLockedError extends DomainError {
  constructor() {
    super('Credencial obrigatória.', 'SESSION_CONTEXT_REQUIRED');
  }
}

export class SessionFaceIdRequiredError extends DomainError {
  constructor() {
    super('Confirmação obrigatória.', 'SESSION_ATTENTION_REQUIRED');
  }
}

export class SessionContext implements Releasable {
  private material: CryptoKey | null = null;
  private openedAt = 0;
  private lastUseAt = 0;

  constructor(
    private readonly policy: SessionPolicy = DEFAULT_SESSION_POLICY,
    private readonly clock: Clock = new SystemClock()
  ) {}

  private nowMs(): number {
    return this.clock.now().getTime();
  }

  open(material: CryptoKey, now = this.nowMs()): void {
    this.material = material;
    this.openedAt = now;
    this.lastUseAt = now;
  }

  confirmAttention(now = this.nowMs()): void {
    if (!this.material) {
      throw new SessionLockedError();
    }

    this.lastUseAt = now;
  }

  touch(now = this.nowMs()): void {
    if (this.material) {
      this.lastUseAt = now;
    }
  }

  requireAttention(now = this.nowMs()): void {
    if (this.material) {
      this.lastUseAt = now - this.policy.attentionAfterIdleMs;
    }
  }

  currentMaterial(now = this.nowMs()): CryptoKey {
    const currentState = this.state(now);

    if (currentState === 'context_required' || currentState === 'closed') {
      throw new SessionLockedError();
    }

    if (currentState === 'attention_required') {
      throw new SessionFaceIdRequiredError();
    }

    return this.material as CryptoKey;
  }

  state(now = this.nowMs()): SessionState {
    if (!this.material) return 'closed';
    if (now - this.openedAt >= this.policy.contextAfterActiveMs) return 'context_required';
    if (now - this.lastUseAt >= this.policy.attentionAfterIdleMs) return 'attention_required';
    return 'ready';
  }

  requiresAttention(now = this.nowMs()): boolean {
    return this.state(now) === 'attention_required';
  }

  requiresContext(now = this.nowMs()): boolean {
    const state = this.state(now);
    return state === 'context_required' || state === 'closed';
  }

  close(): void {
    this.release();
  }

  release(): void {
    this.material = null;
    this.openedAt = 0;
    this.lastUseAt = 0;
  }
}

