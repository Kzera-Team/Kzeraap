import type { PerfilUiHandlers, PerfilUiState } from '../PerfilViewTypes';
import { PerfilCardRenderer } from '../renderers/PerfilCardRenderer';
import { emptyState } from '../../shared/ui/EmptyState';

export class PerfilListBinder {
  private readonly cardRenderer = new PerfilCardRenderer();

  bind(root: HTMLElement, state: PerfilUiState, handlers: PerfilUiHandlers): void {
    root.querySelector('[data-action="exportar"]')?.addEventListener('click', async () => handlers.onExportar());

    const slot = root.querySelector('[data-slot="perfil-list"]');
    if (!slot) return;

    if (!state.perfis.length) {
      slot.innerHTML = emptyState('Nenhum perfil encontrado.');
      return;
    }

    state.perfis.forEach(perfil => slot.appendChild(this.cardRenderer.render(perfil)));

    slot.querySelectorAll<HTMLButtonElement>('button[data-action]').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id || '';
        if (button.dataset.action === 'definir-codigo') await handlers.onDefinirCodigo(id);
        if (button.dataset.action === 'arquivar') await handlers.onArquivar(id);
        if (button.dataset.action === 'reativar') await handlers.onReativar(id);
      });
    });
  }
}
