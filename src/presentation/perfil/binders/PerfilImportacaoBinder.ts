import type { PerfilUiHandlers, PerfilUiState } from '../PerfilViewTypes';
import type { PerfilImportacaoPreviewRegistro } from '../../../domain/perfil/PerfilImportacao';
import { escapeHtml } from '../../shared/ui/Html';
import { buscarLocalidadesPorGrupo, grupoPadraoLocalidade } from '../../../domain/localidade/LocalidadeCatalogo';
import { normalizarTelefoneBrasil } from '../../../domain/perfil/PerfilImportacao';

type StatusCard = 'ok' | 'warning' | 'error';

function option(value: string, label: string, selected?: string): string {
  return `<option value="${escapeHtml(value)}" ${value === selected ? 'selected' : ''}>${escapeHtml(label)}</option>`;
}

function statusRegistro(registro: PerfilImportacaoPreviewRegistro): StatusCard {
  if (!registro.valido) return 'error';
  if (!registro.bairro?.trim()) return 'warning';
  return 'ok';
}

function importarButtonLabel(temPreview: boolean, temErro: boolean): string {
  if (!temPreview) return 'Importe um arquivo primeiro';
  if (temErro) return 'Corrija os erros';
  return 'Importar perfis';
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

function renderCard(
  registro: PerfilImportacaoPreviewRegistro,
  status: StatusCard,
  localidadesBrasilia: string[]
): string {
  const statusLabel = status === 'ok' ? '✓ Válido' : status === 'warning' ? '! Atenção' : '× Erro';
  const bairroSelecionado = registro.bairro || '';
  const telefone = normalizarTelefoneBrasil(registro.telefone || '');
  const linhaNumero = registro.index + 2;

  const helpMsg = status === 'warning'
    ? `<p class="perfil-import-help warning">Bairro não informado</p>`
    : status === 'error'
    ? `<p class="perfil-import-help error">${escapeHtml(registro.erros.join('; '))}</p>`
    : '';

  return `
    <article class="perfil-import-card profile-card preview-${status}" data-preview-index="${registro.index}" data-card-status="${status}">
      <div class="perfil-import-status-row">
        <strong class="perfil-import-status valid-badge status-${status}">${statusLabel}</strong>
        <span class="perfil-import-line-number">Linha ${linhaNumero}</span>
      </div>
      <div class="perfil-import-card-main">
        <label class="perfil-import-field perfil-import-field-name">
          <span>Nome</span>
          <input
            class="input-like"
            data-preview-index="${registro.index}"
            data-preview-field="nome"
            value="${escapeHtml(registro.nome)}"
            placeholder="Digite o nome"
            aria-label="Nome"
          />
        </label>

        <div class="perfil-import-card-pair">
          <label class="perfil-import-field">
            <span>Telefone</span>
            <input
              class="input-like"
              data-preview-index="${registro.index}"
              data-preview-field="telefone"
              value="${escapeHtml(telefone)}"
              placeholder="(61) 99999-9999"
              inputmode="tel"
              autocomplete="tel"
              aria-label="Telefone"
            />
          </label>

          <label class="perfil-import-field">
            <span>Bairro</span>
            <select
              class="input-like"
              data-preview-index="${registro.index}"
              data-preview-field="bairro"
              aria-label="Bairro"
            >
              <option value="">Bairro</option>
              ${localidadesBrasilia.map(localidade => option(localidade, localidade, bairroSelecionado)).join('')}
            </select>
          </label>
        </div>

        ${helpMsg}

        <div class="perfil-import-card-footer profile-footer">
          <label class="perfil-import-check checkbox-label">
            <input
              type="checkbox"
              data-preview-index="${registro.index}"
              data-preview-field="conhecePessoalmente"
              ${registro.conhecePessoalmente ? 'checked' : ''}
            />
            <span>Conhece Pessoalmente</span>
          </label>
        </div>
      </div>
    </article>
  `;
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
    const confirmar = root.querySelector('[data-action="confirmar-importacao"]') as HTMLButtonElement | null;
    const note = root.querySelector<HTMLElement>('[data-testid="perfil-import-note"]');

    if (!preview || !confirmar) return;

    const temPreview = state.importacaoPreview.length > 0;
    const statuses = state.importacaoPreview.map(statusRegistro);
    const counts = {
      ok: statuses.filter(s => s === 'ok').length,
      warning: statuses.filter(s => s === 'warning').length,
      error: statuses.filter(s => s === 'error').length,
    };
    const temErro = counts.error > 0;

    atualizarResumoArquivo(root, temPreview, state.importacaoPreview.length);
    atualizarFiltroStatus(root, temPreview, counts);

    confirmar.hidden = false;
    confirmar.disabled = !temPreview || temErro;
    confirmar.textContent = importarButtonLabel(temPreview, temErro);
    if (note) note.hidden = !temErro;

    confirmar.addEventListener('click', async () => {
      if (!confirmar.disabled) await handlers.onConfirmarImportacao();
    });

    if (!temPreview) {
      this.filtroAtivo = 'todos';
      preview.innerHTML = '<p class="perfil-import-empty">Escolha um arquivo para revisar os perfis antes de importar.</p>';
      return;
    }

    const localidadesBrasilia = buscarLocalidadesPorGrupo(grupoPadraoLocalidade().id);

    preview.innerHTML = state.importacaoPreview
      .map((registro, i) => renderCard(registro, statuses[i] ?? 'ok', localidadesBrasilia))
      .join('');

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
