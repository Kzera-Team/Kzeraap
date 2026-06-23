// v0.19.27
import type { PerfilUiHandlers, PerfilUiState } from '../PerfilViewTypes';
import type { PerfilImportacaoPreviewRegistro } from '../../../domain/perfil/PerfilImportacao';
import { normalizarTelefoneBrasil } from '../../../domain/perfil/PerfilImportacao';
import { criarPerfilCard } from '../components/PerfilCard/PerfilCard';
import { criarImportacaoFab } from '../components/ImportacaoFab/ImportacaoFab';
import { criarBottomSheet } from '../components/ImportacaoBottomSheet/ImportacaoBottomSheet';
import type { ModoImportacao } from '../components/ImportacaoBottomSheet/ImportacaoBottomSheet';

type StatusCard = 'ok' | 'warning' | 'error';

function statusRegistro(registro: PerfilImportacaoPreviewRegistro): StatusCard {
  if (!registro.valido) return 'error';
  if (!registro.bairro?.trim()) return 'warning';
  return 'ok';
}

function atualizarResumoArquivo(root: HTMLElement, temPreview: boolean, quantidade: number): void {
  const status = root.querySelector<HTMLElement>('[data-file-status]');
  const nome = root.querySelector<HTMLElement>('[data-file-name]');
  const meta = root.querySelector<HTMLElement>('[data-file-meta]');
  const count = root.querySelector<HTMLElement>('[data-preview-count]');
  const head = root.querySelector<HTMLElement>('[data-testid="perfil-import-preview-head"]');

  if (status) status.textContent = temPreview ? 'Arquivo selecionado' : 'Arquivo';
  if (nome) nome.textContent = temPreview ? 'perfis_importacao.csv' : 'Escolher arquivo';
  if (meta) meta.textContent = temPreview ? `${quantidade} registro${quantidade === 1 ? '' : 's'} encontrado${quantidade === 1 ? '' : 's'}` : 'CSV de perfis';
  if (count) count.textContent = temPreview ? `${quantidade} perf${quantidade === 1 ? 'il' : 'is'} encontrado${quantidade === 1 ? '' : 's'}` : '';
  if (head) head.hidden = !temPreview;
}

function atualizarFiltroStatus(
  root: HTMLElement,
  temPreview: boolean,
  counts: { ok: number; warning: number; error: number }
): void {
  const filter = root.querySelector<HTMLElement>('.perfil-import-status-filter');
  if (!filter) return;
  filter.hidden = !temPreview;
  if (!temPreview) return;
  const total = counts.ok + counts.warning + counts.error;
  const [btnTodos, btnOk, btnWarning, btnError] = Array.from(
    filter.querySelectorAll<HTMLButtonElement>('button')
  );
  if (btnTodos) btnTodos.textContent = `Todos (${total})`;
  if (btnOk) btnOk.textContent = `Válidos (${counts.ok})`;
  if (btnWarning) btnWarning.textContent = `Atenção (${counts.warning})`;
  if (btnError) btnError.textContent = `Erros (${counts.error})`;
}

function aplicarFiltro(preview: Element, chosen: string): void {
  preview.querySelectorAll<HTMLElement>('[data-card-status]').forEach(card => {
    card.hidden = chosen !== 'todos' && card.dataset.cardStatus !== chosen;
  });
}

function wiredFilterButtons(root: HTMLElement, preview: Element, filtroAtivo: string, onFiltroChange: (chosen: string) => void): void {
  const filter = root.querySelector<HTMLElement>('.perfil-import-status-filter');
  if (!filter) return;
  const buttons = Array.from(filter.querySelectorAll<HTMLButtonElement>('button'));
  buttons.forEach(button => {
    const isActive = (button.dataset.filterStatus || 'todos') === filtroAtivo;
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    button.onclick = () => {
      const chosen = button.dataset.filterStatus || 'todos';
      onFiltroChange(chosen);
      buttons.forEach(b => b.setAttribute('aria-pressed', b === button ? 'true' : 'false'));
      aplicarFiltro(preview, chosen);
    };
  });
  aplicarFiltro(preview, filtroAtivo);
}

function removerBottomSheet(root: HTMLElement): void {
  root.querySelector('.importacao-overlay')?.remove();
  root.querySelector('.importacao-bottom-sheet')?.remove();
}

export class PerfilImportacaoBinder {
  private filtroAtivo = 'todos';

  bind(root: HTMLElement, state: PerfilUiState, handlers: PerfilUiHandlers): void {
    const fileInput = root.querySelector('#perfil-import-file') as HTMLInputElement | null;
    fileInput?.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (file) await handlers.onSelecionarArquivo(file);
    });

    const preview = root.querySelector('[data-testid="perfil-import-preview"]');

    if (!preview) return;

    const temPreview = state.importacaoPreview.length > 0;
    const statuses = state.importacaoPreview.map(statusRegistro);
    const counts = {
      ok: statuses.filter(s => s === 'ok').length,
      warning: statuses.filter(s => s === 'warning').length,
      error: statuses.filter(s => s === 'error').length,
    };

    atualizarResumoArquivo(root, temPreview, state.importacaoPreview.length);
    atualizarFiltroStatus(root, temPreview, counts);

    // Remove existing FAB/sheet if re-binding
    root.querySelector('.fab-importar')?.remove();
    removerBottomSheet(root);

    if (temPreview) {
      const fab = criarImportacaoFab(counts, () => {
        removerBottomSheet(root);

        const sheet = criarBottomSheet(
          counts,
          async (modo: ModoImportacao) => {
            removerBottomSheet(root);

            if (modo === 'validos') {
              // Exclude warning and error entries before confirming
              const indexesNaoValidos = statuses
                .map((s, i) => (s !== 'ok' ? i : -1))
                .filter((i): i is number => i !== -1)
                .reverse();
              for (const idx of indexesNaoValidos) {
                await handlers.onAtualizarPreview(idx, { valido: false, erros: ['excluído do modo somente válidos'] });
              }
            } else {
              // 'todos' = válidos + atenção — exclude only errors
              const indexesErro = statuses
                .map((s, i) => (s === 'error' ? i : -1))
                .filter((i): i is number => i !== -1)
                .reverse();
              for (const idx of indexesErro) {
                await handlers.onAtualizarPreview(idx, { valido: false, erros: ['não importável'] });
              }
            }

            await handlers.onConfirmarImportacao();
          },
          () => {
            removerBottomSheet(root);
          }
        );

        root.appendChild(sheet.overlay);
        root.appendChild(sheet.sheet);
      });

      root.appendChild(fab.elemento);
    }

    if (!temPreview) {
      this.filtroAtivo = 'todos';
      preview.innerHTML = '<p class="perfil-import-empty">Escolha um arquivo para revisar os perfis antes de importar.</p>';
      return;
    }

    preview.innerHTML = '';
    state.importacaoPreview.forEach(registro => {
      const card = criarPerfilCard(registro);
      preview.appendChild(card);
    });

    wiredFilterButtons(root, preview, this.filtroAtivo, (chosen) => { this.filtroAtivo = chosen; });

    preview.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-preview-field]').forEach(input => {
      input.addEventListener('input', () => {
        if (input.dataset.previewField !== 'telefone') return;
        const tel = normalizarTelefoneBrasil(input.value);
        if (input.value !== tel) input.value = tel;
      });

      input.addEventListener('blur', async () => {
        const index = Number(input.dataset.previewIndex || 0);
        const field = input.dataset.previewField;
        if (field === 'nome') await handlers.onAtualizarPreview(index, { nome: input.value });
        if (field === 'telefone') await handlers.onAtualizarPreview(index, { telefone: normalizarTelefoneBrasil(input.value) });
      });

      input.addEventListener('change', async () => {
        const index = Number(input.dataset.previewIndex || 0);
        if (input.dataset.previewField === 'conhecePessoalmente') {
          await handlers.onAtualizarPreview(index, { conhecePessoalmente: (input as HTMLInputElement).checked });
        }
        if (input.dataset.previewField === 'bairro') {
          await handlers.onAtualizarPreview(index, { bairro: input.value });
        }
      });
    });
  }
}
