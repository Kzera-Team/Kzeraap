import type { IdentityRule } from '../../domain/identidade/IdentityRule';
import { previewIdentityRule } from '../../domain/identidade/IdentityRuleConfig';
import { escaped, fillTemplate } from '../sharedTemplate';
import { samplePerfil } from './samplePerfil';
import { CodigoPerfilRulePartRenderer } from './CodigoPerfilRulePartRenderer';
import authenticatedIntroTemplate from './codigo-perfil-authenticated-intro.html?raw';
import emptyTemplate from './codigo-empty.html?raw';
import errorTemplate from './codigo-error.html?raw';
import onboardingIntroTemplate from './codigo-perfil-onboarding-intro.html?raw';
import previewErrorTemplate from './codigo-preview-error.html?raw';
import screenTemplate from './codigo-perfil-screen.html?raw';

export type CodigoPerfilMode = 'onboarding' | 'authenticated';

interface CodigoPerfilScreenRendererParams {
  appName: string;
  getError(): string;
}

export class CodigoPerfilScreenRenderer {
  private readonly rulePartRenderer = new CodigoPerfilRulePartRenderer();

  constructor(private readonly params: CodigoPerfilScreenRendererParams) {}

  render(rule: IdentityRule, mode: CodigoPerfilMode): string {
    const hasParts = rule.parts.length > 0;
    const preview = hasParts ? previewIdentityRule({ rule, perfil: samplePerfil }) : { value: '', valid: false, errors: [] };
    const error = this.params.getError();
    const submitLabel = mode === 'onboarding' ? 'Salvar e entrar' : 'Salvar';

    return fillTemplate(screenTemplate, {
      shellClass: mode === 'onboarding' ? 'kzera-mobile-shell code-rule-shell' : 'kzera-screen code-rule-shell',
      introHtml: mode === 'onboarding' ? fillTemplate(onboardingIntroTemplate, { appName: escaped(this.params.appName) }) : authenticatedIntroTemplate,
      errorHtml: error ? fillTemplate(errorTemplate, { error: escaped(error) }) : '',
      partsHtml: hasParts ? rule.parts.map((part, index) => this.rulePartRenderer.render(part, index)).join('') : emptyTemplate,
      preview: escaped(preview.value || '—'),
      previewErrorHtml: preview.errors.length ? fillTemplate(previewErrorTemplate, { error: escaped(preview.errors.join(' ')) }) : '',
      submitLabel: escaped(submitLabel)
    });
  }
}
