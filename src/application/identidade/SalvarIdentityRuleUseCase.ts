import type { Repository } from '../ports/Repository';
import type { IdentityRule } from '../../domain/identidade/IdentityRule';
import { validateIdentityRule } from '../../domain/identidade/IdentityRuleConfig';

export class SalvarIdentityRuleUseCase {
  constructor(private readonly rules: Repository<IdentityRule>) {}

  async execute(rule: IdentityRule): Promise<IdentityRule> {
    const errors = validateIdentityRule(rule);

    if (errors.length) {
      throw new Error(errors.join('\n'));
    }

    return this.rules.save(rule);
  }
}
