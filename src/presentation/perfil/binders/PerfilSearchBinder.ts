import type { PerfilUiHandlers, PerfilUiState } from '../PerfilViewTypes';
import { escapeHtml, inputValue } from '../../shared/ui/Html';
import { badge } from '../../shared/ui/Badge';

export class PerfilSearchBinder {
  bind(root: HTMLElement, state: PerfilUiState, handlers: PerfilUiHandlers): void {
    const busca = root.querySelector('#perfil-busca') as HTMLInputElement | null;
    if (busca) busca.value = state.termoBusca || '';

    root.querySelector('[data-action="buscar"]')?.addEventListener('click', async () => {
      await handlers.onBuscar(inputValue(root, '#perfil-busca'));
    });

    root.querySelector('[data-action="limpar-busca"]')?.addEventListener('click', async () => {
      await handlers.onLimparBusca();
    });

    const resultados = root.querySelector('[data-testid="perfil-resultados"]');
    if (resultados) {
      resultados.innerHTML = `${state.perfis.length} resultado(s) encontrado(s)${state.termoBusca ? ` ${badge(`Filtro: ${state.termoBusca}`, 'info', { testId: 'perfil-filtro-ativo' })}` : ''}`;
    }
  }
}
