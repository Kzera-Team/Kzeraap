import type { PerfilUiHandlers } from '../PerfilViewTypes';
import { checked, inputValue } from '../../shared/ui/Html';

function selectedOptionText(root: HTMLElement, selector: string): string {
  const select = root.querySelector<HTMLSelectElement>(selector);
  const option = select?.selectedOptions?.[0];
  return option?.textContent?.trim() || select?.value || '';
}

export class PerfilFormBinder {
  bind(root: HTMLElement, handlers: PerfilUiHandlers): void {
    root.querySelector('[data-testid="perfil-form"]')?.addEventListener('submit', async event => {
      event.preventDefault();

      const input: {
        nome: string;
        telefone?: string;
        email?: string;
        bairro?: string;
        municipio?: string;
        conhecePessoalmente: boolean;
      } = {
        nome: inputValue(root, '#perfil-nome'),
        municipio: selectedOptionText(root, '#perfil-municipio') || 'Brasília',
        conhecePessoalmente: checked(root, '#perfil-conhece')
      };

      const telefone = inputValue(root, '#perfil-telefone');
      const email = inputValue(root, '#perfil-email');
      const bairro = inputValue(root, '#perfil-bairro');

      if (telefone) input.telefone = telefone;
      if (email) input.email = email;
      if (bairro) input.bairro = bairro;

      await handlers.onCriarPerfil(input);
    });
  }
}
