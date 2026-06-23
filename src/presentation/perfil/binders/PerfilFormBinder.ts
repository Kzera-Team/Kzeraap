import type { PerfilUiHandlers } from '../PerfilViewTypes';
import { checked, inputValue } from '../../shared/ui/Html';
import { listarGruposLocalidade, grupoPadraoLocalidade } from '../../../domain/localidade/LocalidadeCatalogo';

function selectedOptionText(root: HTMLElement, selector: string): string {
  const select = root.querySelector<HTMLSelectElement>(selector);
  const option = select?.selectedOptions?.[0];
  return option?.textContent?.trim() || select?.value || '';
}

function populateLocalidades(root: HTMLElement): void {
  const grupos = listarGruposLocalidade();
  const grupoPadrao = grupoPadraoLocalidade();

  const grupoSelect = root.querySelector<HTMLSelectElement>('[data-localidade-grupo]');
  if (grupoSelect && grupoSelect.options.length === 0) {
    for (const grupo of grupos) {
      const opt = document.createElement('option');
      opt.value = grupo.id;
      opt.textContent = grupo.nome;
      if (grupo.id === grupoPadrao.id) opt.selected = true;
      grupoSelect.appendChild(opt);
    }
  }

  const bairroSelect = root.querySelector<HTMLSelectElement>('[data-localidade-select]');
  if (bairroSelect && bairroSelect.options.length === 0) {
    for (const localidade of grupoPadrao.localidades) {
      const opt = document.createElement('option');
      opt.value = localidade;
      opt.textContent = localidade;
      bairroSelect.appendChild(opt);
    }
  }
}

export class PerfilFormBinder {
  bind(root: HTMLElement, handlers: PerfilUiHandlers): void {
    populateLocalidades(root);

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
