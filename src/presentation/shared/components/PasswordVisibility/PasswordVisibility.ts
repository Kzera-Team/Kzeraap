export interface PasswordVisibilityToggleOptions {
  input: HTMLInputElement;
  toggle: HTMLElement;
}

export function bindPasswordVisibilityToggle(options: PasswordVisibilityToggleOptions): void {
  options.toggle.addEventListener('click', () => {
    const visible = options.input.type === 'text';

    options.input.type = visible ? 'password' : 'text';
    options.toggle.textContent = visible ? '👁' : '🙈';
    options.toggle.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
    options.input.focus();
  });
}
