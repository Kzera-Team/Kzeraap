import type { AppContext } from './AppContext';
import type { Controller } from '../presentation/contracts/Controller';

export class AppBootstrap {
  constructor(
    private readonly context: AppContext,
    private readonly controllers: Record<string, Controller>
  ) {}

  async start(root: HTMLElement, initialRoute = 'perfis'): Promise<void> {
    const controller = this.controllers[initialRoute];

    if (!controller) {
      throw new Error(`Controller não registrado: ${initialRoute}`);
    }

    await controller.mount(root);
  }
}
