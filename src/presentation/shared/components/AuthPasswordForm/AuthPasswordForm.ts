import { findTemplateElement } from '../FeedbackComponents/FeedbackTemplate';
import { bindPasswordVisibilityToggle } from '../PasswordVisibility/PasswordVisibility';
import markup from './AuthPasswordForm.html?raw';

export interface AuthPasswordFormOptions {
  appName: string;
  versionLabel: string;
  testId: string;
  title: string;
  description: string;
  inputId: string;
  inputLabel: string;
  buttonLabel: string;
  error?: string;
  disabled?: boolean;
  autocomplete?: 'current-password' | 'new-password';
}

export function renderAuthPasswordForm(
  root: HTMLElement,
  options: AuthPasswordFormOptions,
  onSubmit: (password: string) => void
): void {
  const shell = createAuthPasswordShell();
  const form = findTemplateElement<HTMLFormElement>(shell, '[data-auth-password-form]', 'Formulário de senha não encontrado.');
  const input = findTemplateElement<HTMLInputElement>(shell, '[data-auth-password-input]', 'Campo de senha não encontrado.');
  const toggle = findTemplateElement<HTMLButtonElement>(shell, '[data-auth-password-toggle]', 'Controle de senha não encontrado.');
  const submit = findTemplateElement<HTMLButtonElement>(shell, '[data-auth-password-submit]', 'Botão de senha não encontrado.');
  const error = findTemplateElement<HTMLElement>(shell, '[data-auth-password-error]', 'Área de erro de senha não encontrada.');

  setText(shell, '[data-auth-password-app-initial]', options.appName.slice(0, 1));
  setText(shell, '[data-auth-password-app-name]', options.appName);
  setText(shell, '[data-auth-password-title]', options.title);
  setText(shell, '[data-auth-password-description]', options.description);
  setText(shell, '[data-auth-password-input-label]', options.inputLabel);
  setText(shell, '[data-auth-password-submit]', options.buttonLabel);
  setText(shell, '[data-auth-password-version]', options.versionLabel);

  form.setAttribute('data-testid', options.testId);
  input.id = options.inputId;
  input.autocomplete = options.autocomplete ?? 'current-password';
  submit.disabled = Boolean(options.disabled);

  if (options.error) {
    error.textContent = options.error;
    error.hidden = false;
  }

  bindPasswordVisibilityToggle({ input, toggle });

  form.addEventListener('submit', event => {
    event.preventDefault();
    onSubmit(input.value);
  });

  root.replaceChildren(shell);
}

function createAuthPasswordShell(): HTMLElement {
  const range = document.createRange();
  range.selectNode(document.body);

  const fragment = range.createContextualFragment(markup);
  range.detach();

  const shell = fragment.firstElementChild;

  if (!(shell instanceof HTMLElement)) {
    throw new Error('AuthPasswordForm: template inválido.');
  }

  return shell;
}

function setText(root: ParentNode, selector: string, value: string): void {
  findTemplateElement(root, selector, `Elemento ${selector} não encontrado.`).textContent = value;
}
