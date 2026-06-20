import type { AccessCoordinator } from '../../runtime/AccessCoordinator';
import { validateMasterPassword } from '../../domain/auth/AuthRules';

export interface LoginInput {
  password: string;
}

export class LoginUseCase {
  constructor(private readonly accessCoordinator: AccessCoordinator) {}

  async execute(input: LoginInput): Promise<void> {
    const errors = validateMasterPassword(input.password);

    if (errors.length) {
      throw new Error(errors.join('\n'));
    }

    await this.accessCoordinator.open({
      password: input.password
    });
  }
}

