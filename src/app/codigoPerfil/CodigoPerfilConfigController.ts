import type { IdentityRule } from '../../domain/identidade/IdentityRule';
import { previewIdentityRule, validateIdentityRule } from '../../domain/identidade/IdentityRuleConfig';
import { cloneIdentityRule } from './CodigoPerfilRuleService';
import { readCodigoPerfilDraftRuleFromDom } from './CodigoPerfilDraftReader';
import { CodigoPerfilScreenRenderer, type CodigoPerfilMode } from './CodigoPerfilScreenRenderer';
import { samplePerfil } from './samplePerfil';

interface CodigoPerfilConfigControllerParams {
  appName: string;
  getError(): string;
  setError(error: string): void;
  clearError(): void;
  saveRule(rule: IdentityRule): Promise<void>;
  configureFaceIdAutomatically(): Promise<void>;
  navigateHome(): Promise<void>;
  requestRender(): Promise<void>;
}

export class CodigoPerfilConfigController {
  private currentDraftRule: IdentityRule | null = null;
  private baseRule: IdentityRule | null = null;
  private readonly renderer: CodigoPerfilScreenRenderer;

  constructor(private readonly params: CodigoPerfilConfigControllerParams) {
    this.renderer = new CodigoPerfilScreenRenderer({
      appName: params.appName,
      getError: params.getError
    });
  }

  render(baseRule: IdentityRule, mode: CodigoPerfilMode): string {
    return this.renderer.render(this.ensureDraft(baseRule), mode);
  }

  bind(root: HTMLElement): void {
    this.bindAddButtons(root);
    this.bindRemoveButtons(root);
    this.bindFields(root);
    this.bindSubmit(root);
  }

  private bindAddButtons(root: HTMLElement): void {
    root.querySelectorAll('[data-code-add]').forEach(button => {
      button.addEventListener('click', async () => {
        const next = this.cloneCurrent();
        if ((button as HTMLElement).dataset.codeAdd === 'text') next.parts.push({ type: 'staticText', value: '', caseFormat: 'original', transform: 'none' });
        else next.parts.push({ type: 'column', column: 'perfil.nome', extraction: 'firstLetter', caseFormat: 'upper', transform: 'none' });
        this.currentDraftRule = next;
        await this.params.requestRender();
      });
    });
  }

  private bindRemoveButtons(root: HTMLElement): void {
    root.querySelectorAll('[data-code-remove]').forEach(button => {
      button.addEventListener('click', async () => {
        const index = Number((button as HTMLElement).dataset.codeRemove);
        const next = this.cloneCurrent();
        next.parts.splice(index, 1);
        this.currentDraftRule = next;
        await this.params.requestRender();
      });
    });
  }

  private bindFields(root: HTMLElement): void {
    root.querySelectorAll('[data-code-field]').forEach(input => {
      input.addEventListener('input', async () => {
        this.currentDraftRule = this.readDraftRuleFromDom(root);
        await this.params.requestRender();
      });
    });
  }

  private bindSubmit(root: HTMLElement): void {
    root.querySelector('[data-testid="codigo-perfil-form"]')?.addEventListener('submit', async event => {
      event.preventDefault();
      await this.saveCurrentRule(root);
    });
  }

  private async saveCurrentRule(root: HTMLElement): Promise<void> {
    this.params.clearError();
    const rule = this.readDraftRuleFromDom(root);
    const errors = validateIdentityRule(rule);
    if (rule.parts.length < 3) errors.push('Configure pelo menos 3 campos para o Código do Perfil.');
    const preview = previewIdentityRule({ rule, perfil: samplePerfil });

    if (errors.length || !preview.valid) {
      this.params.setError([...errors, ...preview.errors].join(' '));
      await this.params.requestRender();
      return;
    }

    await this.params.saveRule(rule);
    await this.params.configureFaceIdAutomatically();
    this.currentDraftRule = null;
    this.baseRule = null;
    await this.params.navigateHome();
  }

  private ensureDraft(baseRule: IdentityRule): IdentityRule {
    if (!this.baseRule || this.baseRule.createdAt !== baseRule.createdAt) {
      this.baseRule = cloneIdentityRule(baseRule);
      this.currentDraftRule = null;
    }

    this.currentDraftRule = this.currentDraftRule || cloneIdentityRule(baseRule);
    return this.currentDraftRule;
  }

  private cloneCurrent(): IdentityRule {
    return this.currentDraftRule ? cloneIdentityRule(this.currentDraftRule) : cloneIdentityRule(this.baseRule as IdentityRule);
  }

  private readDraftRuleFromDom(root: HTMLElement): IdentityRule {
    return readCodigoPerfilDraftRuleFromDom(root, this.currentDraftRule?.createdAt || new Date().toISOString());
  }
}
