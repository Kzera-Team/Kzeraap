export interface PasswordVisibilityToggleOptions {
  input: HTMLInputElement;
  toggle: HTMLButtonElement;
}

export function bindPasswordVisibilityToggle(options: PasswordVisibilityToggleOptions): void {
  const { input, toggle } = options;

  toggle.addEventListener('click', () => {
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    toggle.textContent = visible ? '👁' : '🙈';
    toggle.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
    input.focus();
  });
}
