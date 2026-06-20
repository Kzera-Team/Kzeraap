export interface Controller {
  mount(root: HTMLElement): void | Promise<void>;
  unmount?(): void | Promise<void>;
}
