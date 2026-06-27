import { escaped, fillTemplate } from '../sharedTemplate';
import authShellTemplate from './auth-shell.html?raw';
import authErrorTemplate from './auth-error.html?raw';
import attentionFormTemplate from './attention-form.html?raw';
import passwordFieldTemplate from './password-field.html?raw';
import setupFormTemplate from './setup-form.html?raw';

interface AuthScreenRendererParams {
  appName: string;
  versionLabel: string;
  getError(): string;
}

export class AuthScreenRenderer {
  constructor(private readonly params: AuthScreenRendererParams) {}

  renderSetup(): string {
    return this.renderShell(fillTemplate(setupFormTemplate, {
      passwordField: this.renderPasswordField('setup-password', 'Senha', 'new-password'),
      confirmationField: this.renderPasswordField('setup-confirmation', 'Confirmar senha', 'new-password')
    }));
  }

  renderAttention(): string {
    return this.renderShell(fillTemplate(attentionFormTemplate, {
      passwordField: this.renderPasswordField('attention-password', 'Entrar com senha')
    }));
  }

  private renderShell(content: string): string {
    const error = this.params.getError();

    return fillTemplate(authShellTemplate, {
      appName: escaped(this.params.appName),
      versionLabel: escaped(this.params.versionLabel),
      errorHtml: error ? fillTemplate(authErrorTemplate, { error: escaped(error) }) : '',
      content
    });
  }

  private renderPasswordField(id: string, label: string, autocomplete: 'current-password' | 'new-password' = 'current-password'): string {
    return fillTemplate(passwordFieldTemplate, {
      id: escaped(id),
      label: escaped(label),
      autocomplete
    });
  }
}
