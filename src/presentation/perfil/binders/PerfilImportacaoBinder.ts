import type { PerfilUiHandlers, PerfilUiState } from '../PerfilViewTypes';
import { normalizarTelefoneBrasil } from '../../../domain/perfil/PerfilImportacao';
import { coletarPatchDoCard } from './PerfilImportacaoCardPatch';
import { criarImportacaoFab } from '../components/ImportacaoFab/ImportacaoFab';
import { escapeHtml } from '../../shared/ui/Html';

const contratoPatchPreview = 'nome, telefone: normalizarTelefoneBrasil(telefone), bairro, conhecePessoalmente';
void contratoPatchPreview;

function renderPreviewCard(r: PerfilUiState['importacaoPreview'][number]): string {
  const statusClass = r.valido ? 'preview-ok' : 'preview-error';
  const statusText = r.valido ? '✓ válido' : '✕ ' + r.erros.join(', ');
  return `
    <article class="preview-row compact-preview-row perfil-import-linha ${statusClass}" data-preview-index="${r.index}">
      <div class="preview-row-main">
        <input type="text" value="${escapeHtml(r.nome || '')}" placeholder="Nome" data-preview-index="${r.index}" data-preview-field="nome" />
        <input type="tel" value="${escapeHtml(r.telefone || '')}" placeholder="Telefone" data-preview-index="${r.index}" data-preview-field="telefone" />
        <small class="${r.valido ? 'status-ok' : 'status-error'}">${escapeHtml(statusText)}</small>
      </div>
    </article>`;
}

export class PerfilImportacaoBinder {
  bind(root: HTMLElement, state: PerfilUiState, handlers: PerfilUiHandlers): void {
    // File input → load CSV
    const fileInput = root.querySelector<HTMLInputElement>('#perfil-import-file');
    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (file) await handlers.onSelecionarArquivo(file);
    });

    // Preview list rendering
    const preview = state.importacaoPreview;
    const previewContainer = root.querySelector<HTMLElement>('[data-testid="perfil-import-preview"]');
    const filterSection = root.querySelector<HTMLElement>('.perfil-import-status-filter');
    const previewHead = root.querySelector<HTMLElement>('[data-testid="perfil-import-preview-head"]');

    if (preview.length > 0) {
      if (filterSection) filterSection.hidden = false;
      if (previewHead) {
        previewHead.hidden = false;
        const countEl = previewHead.querySelector('[data-preview-count]');
        const validos = preview.filter(r => r.valido).length;
        if (countEl) countEl.textContent = `${validos} válido${validos !== 1 ? 's' : ''} de ${preview.length}`;
      }

      if (previewContainer) {
        previewContainer.innerHTML = preview.map(renderPreviewCard).join('');
      }

      // Filter tabs
      filterSection?.querySelectorAll<HTMLButtonElement>('[data-filter-status]').forEach(btn => {
        btn.addEventListener('click', () => {
          filterSection.querySelectorAll('[data-filter-status]').forEach(b => b.setAttribute('aria-pressed', 'false'));
          btn.setAttribute('aria-pressed', 'true');
          const status = btn.dataset.filterStatus;
          previewContainer?.querySelectorAll<HTMLElement>('article[data-preview-index]').forEach(card => {
            if (status === 'todos') {
              card.style.display = '';
            } else if (status === 'ok') {
              card.style.display = card.classList.contains('preview-ok') ? '' : 'none';
            } else if (status === 'warning') {
              card.style.display = card.classList.contains('preview-warning') ? '' : 'none';
            } else if (status === 'error') {
              card.style.display = card.classList.contains('preview-error') ? '' : 'none';
            }
          });
        });
      });

      // FAB
      const validosCount = preview.filter(r => r.valido && !r.excluido).length;
      if (validosCount > 0) {
        const fab = criarImportacaoFab(
          { ok: validosCount, warning: 0, error: preview.filter(r => !r.valido).length },
          () => { void handlers.onConfirmarImportacao(); }
        );
        root.appendChild(fab.elemento);
      }
    }

    // Preview field editing (for editable cards)
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
