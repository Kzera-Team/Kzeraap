import type { ResourceScope } from '../../runtime/ResourceScope';

export class BloquearSessaoUseCase {
  constructor(private readonly resourceScope: ResourceScope) {}

  execute(): void {
    this.resourceScope.releaseAll();
  }
}
