import type { Perfil } from '../../domain/perfil/Perfil';
import type { IdentityRule } from '../../domain/identidade/IdentityRule';
import { previewIdentityRule, type IdentityRulePreviewResult } from '../../domain/identidade/IdentityRuleConfig';

export class PreviewIdentityRuleUseCase {
  execute(rule: IdentityRule, perfil: Perfil): IdentityRulePreviewResult {
    return previewIdentityRule({
      rule,
      perfil
    });
  }
}
