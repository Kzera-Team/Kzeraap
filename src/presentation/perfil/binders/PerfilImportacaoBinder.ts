import type { PerfilUiHandlers, PerfilUiState } from '../PerfilViewTypes';
import { normalizarTelefoneBrasil } from '../../../domain/perfil/PerfilImportacao';
import { coletarPatchDoCard } from './PerfilImportacaoCardPatch';
import { escapeHtml } from '../../shared/ui/Html';
import { badge } from '../../shared/ui/Badge';

export class PerfilImportacaoBinder {
  bind(root: HTMLElement, state: PerfilUiState, handlers: PerfilUiHandlers): void {
    const fileInput = root.querySelector<HTMLInputElement>('#perfil-import-file');
    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (file) await handlers.onSelecionarArquivo(file);
    });

    const previewHead = root.querySelector<HTMLElement>('[data-testid="perfil-import-preview-head"]');
    const previewCount = root.querySelector<HTMLElement>('[data-preview-count]');
    const confirmar = root.querySelector<HTMLButtonElement>('[data-action="confirmar-importacao"]');

    if (previewHead) previewHead.hidden = state.importacaoPreview.length === 0;
    if (previewCount) previewCount.textContent = `${state.importacaoPreview.length} registros`;
    if (confirmar) {
      confirmar.hidden = state.importacaoPreview.length === 0;
      confirmar.addEventListener('click', async () => handlers.onConfirmarImportacao());
    }

    const preview = root.querySelector<HTMLElement>('[data-testid="perfil-import-preview"]');
    if (preview) {
      preview.innerHTML = state.importacaoPreview.map(reg => `
        <article class="preview-row compact-preview-row perfil-import-line ${reg.valido ? 'preview-ok' : 'preview-error'}" data-preview-index="${reg.index}">
          <strong>${escapeHtml(reg.nome || 'Sem nome')}</strong>
          ${badge(reg.valido ? '✓ válido' : '✕ erro', reg.valido ? 'success' : 'danger')}
          <input value="${escapeHtml(reg.nome || '')}" placeholder="Nome" data-preview-index="${reg.index}" data-preview-field="nome" />
          <input value="${escapeHtml(reg.telefone || '')}" placeholder="Telefone" data-preview-index="${reg.index}" data-preview-field="telefone" />
          <small class="${reg.valido ? 'status-ok' : 'status-error'}">${reg.valido ? 'Pronto' : escapeHtml(reg.erros.join('; '))}</small>
        </article>
      `).join('');
    }

    root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-preview-field]').forEach(input => {
      input.addEventListener('input', () => {
        if (input.dataset.previewField !== 'telefone') return;
        const tel = normalizarTelefoneBrasil(input.value);
        if (input.value !== tel) input.value = tel;
      });

      input.addEventListener('blur', async () => {
        const index = Number(input.dataset.previewIndex || 0);
        const field = input.dataset.previewField;
        if (field === 'nome' || field === 'telefone') {
          await handlers.onAtualizarPreview(index, coletarPatchDoCard(input));
        }
      });

      input.addEventListener('change', async () => {
        const index = Number(input.dataset.previewIndex || 0);
        const field = input.dataset.previewField;
        if (field === 'conhecePessoalmente' || field === 'bairro') {
          await handlers.onAtualizarPreview(index, coletarPatchDoCard(input));
        }
      });
    });
  }
}
