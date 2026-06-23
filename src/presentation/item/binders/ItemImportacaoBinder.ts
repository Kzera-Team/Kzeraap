import type { ItemCatalogoUiHandlers, ItemCatalogoUiState } from '../ItemCatalogoViewTypes';
import type { ItemUnidade } from '../../../domain/item/ItemCatalogo';
import { escapeHtml, inputValue } from '../../shared/ui/Html';
import { badge } from '../../shared/ui/Badge';

export class ItemImportacaoBinder {
  bind(root: HTMLElement, state: ItemCatalogoUiState, handlers: ItemCatalogoUiHandlers): void {
    const fileInput = root.querySelector('#item-import-file') as HTMLInputElement | null;
    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (file) await handlers.onSelecionarArquivo(file);
    });

    const bulk = root.querySelector('[data-testid="item-import-bulk-actions"]') as HTMLElement | null;
    const preview = root.querySelector('[data-testid="item-import-preview"]');
    const confirmar = root.querySelector('[data-action="confirmar-importacao"]') as HTMLButtonElement | null;

    if (bulk) bulk.hidden = state.preview.length === 0;
    if (confirmar) {
      confirmar.hidden = state.preview.length === 0;
      confirmar.addEventListener('click', async () => handlers.onConfirmarImportacao());
    }

    root.querySelector('[data-action="aplicar-categoria"]')?.addEventListener('click', async () => {
      await handlers.onAplicarCategoriaPreviewEmMassa(inputValue(root, '#preview-categoria-massa'));
    });

    root.querySelector('[data-action="limpar-invalidos"]')?.addEventListener('click', async () => {
      await handlers.onLimparPreviewInvalidos();
    });

    if (!preview) return;

    preview.innerHTML = state.preview.map(item => `
      <article class="preview-row compact-preview-row item-import-line ${item.valido ? 'preview-ok' : 'preview-error'}" data-preview-index="${item.index}">
        <strong>${escapeHtml(item.nome || 'Sem nome')}</strong>
        ${badge(item.valido ? '✓ válido' : '✕ erro', item.valido ? 'success' : 'danger')}
        <input id="preview-nome-${item.index}" value="${escapeHtml(item.nome || '')}" placeholder="Item" data-preview-index="${item.index}" data-preview-field="nome" />
        <input id="preview-variacao-${item.index}" value="${escapeHtml(item.variacaoNome || item.categoria || 'Padrão')}" placeholder="Variação" data-preview-index="${item.index}" data-preview-field="variacaoNome" />
        <input id="preview-unidade-${item.index}" value="${escapeHtml(item.unidade || '')}" placeholder="Unidade" data-preview-index="${item.index}" data-preview-field="unidade" />
        <input id="preview-quantidade-${item.index}" value="${escapeHtml(String(item.quantidadeLote ?? 0))}" type="number" step="0.001" placeholder="Quantidade" data-preview-index="${item.index}" data-preview-field="quantidadeLote" />
        <input id="preview-custo-${item.index}" value="${escapeHtml(String(item.custoLote ?? 0))}" type="number" step="0.01" placeholder="Custo" data-preview-index="${item.index}" data-preview-field="custoLote" />
        <input id="preview-preco-${item.index}" value="${escapeHtml(String(item.valorLote ?? 0))}" type="number" step="0.01" placeholder="Valor" data-preview-index="${item.index}" data-preview-field="valorLote" />
        <small class="${item.valido ? 'status-ok' : 'status-error'}">${item.valido ? 'Pronto para importar' : escapeHtml(item.erros.join('; '))}</small>
      </article>
    `).join('');

    preview.querySelectorAll<HTMLInputElement>('input[data-preview-field]').forEach(input => {
      input.addEventListener('input', async () => {
        const index = Number(input.dataset.previewIndex || 0);
        const field = input.dataset.previewField;
        if (field === 'nome') await handlers.onAtualizarPreview(index, { nome: input.value });
        if (field === 'variacaoNome') await handlers.onAtualizarPreview(index, { variacaoNome: input.value });
        if (field === 'unidade') await handlers.onAtualizarPreview(index, { unidade: input.value as ItemUnidade, errosImportacao: [] });
        if (field === 'quantidadeLote') await handlers.onAtualizarPreview(index, { quantidadeLote: Number(input.value || 0) });
        if (field === 'custoLote') await handlers.onAtualizarPreview(index, { custoLote: Number(input.value || 0) });
        if (field === 'valorLote') await handlers.onAtualizarPreview(index, { valorLote: Number(input.value || 0) });
      });
    });
  }
}
