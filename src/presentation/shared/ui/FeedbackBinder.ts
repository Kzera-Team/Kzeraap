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

interface FeedbackSelectors {
  loading: string;
  mensagem: string;
  erro: string;
}

interface FeedbackState {
  loading?: boolean;
  mensagem?: string;
  erro?: string;
}

export function bindFeedback(root: ParentNode, selectors: FeedbackSelectors, state: FeedbackState): void {
  bindText(root, selectors.mensagem, state.mensagem);
  bindText(root, selectors.erro, state.erro);

  const loading = root.querySelector<HTMLElement>(selectors.loading);
  if (loading) {
    loading.hidden = !state.loading;
  }
}

function bindText(root: ParentNode, selector: string, value?: string): void {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) return;

  element.textContent = value ?? '';
  element.hidden = !value;
}
