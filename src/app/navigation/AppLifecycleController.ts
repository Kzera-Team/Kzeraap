export interface AppLifecycleControllerDependencies {
  getAuthState(): Promise<string>;
  isTextEntryActive(): boolean;
  requireAttention(): void;
  blockSession(): void;
  clearError(): void;
  requestRender(): Promise<void>;
  trackBlocked(): void;
  trackUnlocked(): void;
  trackReopened(): void;
}

export class AppLifecycleController {
  private bound = false;
  private resumeInProgress = false;

  constructor(private readonly dependencies: AppLifecycleControllerDependencies) {}

  bind(): void {
    if (this.bound || typeof window === 'undefined') return;

    this.bound = true;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.dependencies.trackBlocked();
        this.dependencies.blockSession();
        return;
      }

      if (document.visibilityState === 'visible') {
        this.dependencies.trackUnlocked();
        void this.requireAttentionOnResume();
      }
    });

    window.addEventListener('pageshow', () => {
      this.dependencies.trackReopened();
      void this.requireAttentionOnResume();
    });

    window.addEventListener('focus', () => {
      void this.requireAttentionOnResume();
    });
  }

  private async requireAttentionOnResume(): Promise<void> {
    if (this.resumeInProgress) return;

    this.resumeInProgress = true;

    try {
      const state = await this.dependencies.getAuthState();
      if (state !== 'unlocked') {
        await this.dependencies.requestRender();
        return;
      }
      if (this.dependencies.isTextEntryActive()) return;

      this.dependencies.requireAttention();
      this.dependencies.clearError();
      await this.dependencies.requestRender();
    } finally {
      this.resumeInProgress = false;
    }
  }
}
