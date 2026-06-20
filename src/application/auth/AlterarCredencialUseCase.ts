import { confirmPassword, validateMasterPassword } from '../../domain/auth/AuthRules';
import type { AccessCoordinator } from '../../runtime/AccessCoordinator';

export interface AlterarCredencialInput {
  currentPassword: string;
  nextPassword: string;
  confirmation: string;
}

export class AlterarCredencialUseCase {
  constructor(private readonly accessCoordinator: AccessCoordinator) {}

  async execute(input: AlterarCredencialInput): Promise<void> {
    const errors = [
      ...validateMasterPassword(input.currentPassword),
      ...validateMasterPassword(input.nextPassword),
      ...confirmPassword(input.nextPassword, input.confirmation)
    ];

    if (input.currentPassword === input.nextPassword) {
      errors.push('A nova credencial deve ser diferente da atual.');
    }

    if (errors.length) {
      throw new Error(errors.join('\n'));
    }

    await this.accessCoordinator.rotateMasterPassword({
      currentPassword: input.currentPassword,
      nextPassword: input.nextPassword
    });
  }
}
