import type { PerfilUiState } from '../PerfilViewTypes';
import { escapeHtml } from '../../shared/ui/Html';
import { emptyState } from '../../shared/ui/EmptyState';
import { badge } from '../../shared/ui/Badge';

export class PerfilDuplicidadeBinder {
  bind(root: HTMLElement, state: PerfilUiState): void {
    const slot = root.querySelector('[data-slot="duplicidades"]');
    if (!slot) return;

    if (!state.duplicidades.length) {
      slot.innerHTML = emptyState('Nenhuma duplicidade encontrada.');
      return;
    }

    slot.innerHTML = state.duplicidades.map(duplicidade => `
      <article class="kzera-card duplicidade-card">
        <strong>${escapeHtml(duplicidade.perfilAId)} / ${escapeHtml(duplicidade.perfilBId)}</strong>
        ${badge(`Score ${escapeHtml(duplicidade.score)}`, 'warning')}
      </article>
    `).join('');
  }
}
