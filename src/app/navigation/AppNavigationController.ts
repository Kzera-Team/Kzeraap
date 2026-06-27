import type { Screen } from './Screen';

type ScreenOrigin = 'menu' | 'voltar' | 'atalho';

export interface AppNavigationControllerDependencies {
  requestRender(): Promise<void>;
  trackScreenChange(screen: Screen, origin: ScreenOrigin): void;
}

export class AppNavigationController {
  private screen: Screen = 'home';
  private menuOpen = false;
  private historyBound = false;
  private swipeBound = false;

  constructor(private readonly dependencies: AppNavigationControllerDependencies) {}

  get currentScreen(): Screen {
    return this.screen;
  }

  get isMenuOpen(): boolean {
    return this.menuOpen;
  }

  async navigate(screen: Screen, push = true): Promise<void> {
    const origin: ScreenOrigin = push ? 'menu' : 'voltar';

    this.setScreen(screen, origin);
    if (push && typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState({ screen }, '', `#${screen}`);
    }

    await this.dependencies.requestRender();
  }

  async toggleMenu(): Promise<void> {
    this.menuOpen = !this.menuOpen;
    await this.dependencies.requestRender();
  }

  async closeMenu(): Promise<void> {
    this.menuOpen = false;
    await this.dependencies.requestRender();
  }

  async resetToHome(): Promise<void> {
    this.screen = 'home';
    this.menuOpen = false;
    await this.dependencies.requestRender();
  }

  async openQuickAction(screen: Screen): Promise<void> {
    this.setScreen(screen, 'atalho');
    await this.dependencies.requestRender();
  }

  async show(screen: Screen, origin: ScreenOrigin = 'menu'): Promise<void> {
    this.setScreen(screen, origin);
    await this.dependencies.requestRender();
  }

  bindHistory(): void {
    if (this.historyBound || typeof window === 'undefined') return;

    this.historyBound = true;
    window.addEventListener('popstate', event => {
      const screen = (event.state?.screen || 'home') as Screen;
      this.setScreen(screen, 'voltar');
      void this.dependencies.requestRender();
    });
  }

  bindSwipeNavigation(): void {
    if (this.swipeBound || typeof window === 'undefined') return;

    this.swipeBound = true;
    let startX = 0;
    let startY = 0;

    window.addEventListener('touchstart', event => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const touch = event.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });

    window.addEventListener('touchend', event => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      if (Math.abs(deltaX) < 72 || Math.abs(deltaY) > 48) return;

      if (this.menuOpen && deltaX < -72) {
        this.menuOpen = false;
        void this.dependencies.requestRender();
        return;
      }

      if (startX <= 24 && deltaX > 72) {
        if (this.screen === 'home') {
          this.menuOpen = true;
          void this.dependencies.requestRender();
          return;
        }
        window.history.back();
      }
    }, { passive: true });
  }

  private setScreen(screen: Screen, origin: ScreenOrigin): void {
    this.screen = screen;
    this.menuOpen = false;
    this.dependencies.trackScreenChange(screen, origin);
  }
}
