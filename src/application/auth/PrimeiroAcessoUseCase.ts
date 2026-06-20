import type { AccessCoordinator } from '../../runtime/AccessCoordinator';
import { confirmPassword, validateMasterPassword } from '../../domain/auth/AuthRules';

export interface PrimeiroAcessoInput {
  password: string;
  confirmation: string;
}

export class PrimeiroAcessoUseCase {
  constructor(private readonly accessCoordinator: AccessCoordinator) {}

  async execute(input: PrimeiroAcessoInput): Promise<void> {
    const errors = [
      ...validateMasterPassword(input.password),
      ...confirmPassword(input.password, input.confirmation)
    ];

    if (errors.length) {
      throw new Error(errors.join('\n'));
    }

    await this.accessCoordinator.createMasterPassword({
      password: input.password
    });
  }
}
