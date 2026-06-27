export class AuthenticatedAppRoot {
  private rootElement: HTMLElement | null = null;
  private sessionListenersBound = false;

  get current(): HTMLElement | null {
    return this.rootElement;
  }

  set(root: HTMLElement): void {
    this.rootElement = root;
    this.sessionListenersBound = false;
  }

  main(): HTMLElement {
    const appRoot = this.rootElement?.querySelector('#kzera-main') as HTMLElement | null;
    if (!appRoot) throw new Error('Elemento #kzera-main não encontrado.');
    return appRoot;
  }

  bindSessionTouch(touchSession: () => void): void {
    if (!this.rootElement || this.sessionListenersBound) return;

    this.rootElement.addEventListener('pointerdown', touchSession, { passive: true });
    this.rootElement.addEventListener('keydown', touchSession);
    this.sessionListenersBound = true;
  }
}

export function isTextEntryActive(): boolean {
  const active = document.activeElement;
  return active instanceof HTMLElement && Boolean(active.closest('input, textarea, select, [contenteditable="true"]'));
}
