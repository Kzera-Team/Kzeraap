import { bindPasswordVisibilityToggle } from '../../presentation/shared/components/PasswordVisibility/PasswordVisibility';

export function bindAuthPasswordToggles(root: HTMLElement): void {
  root.querySelectorAll('[data-toggle-password]').forEach(button => {
    const targetId = (button as HTMLElement).dataset.togglePassword;
    const input = targetId ? root.querySelector(`#${targetId}`) as HTMLInputElement | null : null;

    if (!(button instanceof HTMLElement) || !input) return;

    bindPasswordVisibilityToggle({ input, toggle: button });
  });
}
