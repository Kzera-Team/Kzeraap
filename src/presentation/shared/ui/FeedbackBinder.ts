export interface FeedbackBinderHandle {
  dispose(): void;
}

export class FeedbackBinder {
  private readonly disposers: Array<() => void> = [];

  on<K extends keyof WindowEventMap>(target: Window, type: K, listener: (event: WindowEventMap[K]) => void): FeedbackBinderHandle;
  on<K extends keyof HTMLElementEventMap>(target: HTMLElement, type: K, listener: (event: HTMLElementEventMap[K]) => void): FeedbackBinderHandle;
  on(target: EventTarget, type: string, listener: EventListener): FeedbackBinderHandle {
    target.addEventListener(type, listener);
    const dispose = () => target.removeEventListener(type, listener);
    this.disposers.push(dispose);

    return { dispose };
  }

  dispose(): void {
    while (this.disposers.length) {
      this.disposers.pop()?.();
    }
  }
}
