import type { PerfilUiHandlers, PerfilUiState } from '../PerfilViewTypes';
import { escapeHtml } from '../../shared/ui/Html';
import { buscarLocalidadesPorGrupo, grupoPadraoLocalidade } from '../../../domain/localidade/LocalidadeCatalogo';
import { normalizarTelefoneBrasil } from '../../../domain/perfil/PerfilImportacao';

function option(value: string, label: string, selected?: string): string {
  return `<option value="${escapeHtml(value)}" ${value === selected ? 'selected' : ''}>${escapeHtml(label)}</option>`;
}

function importarButtonLabel(temPreview: boolean, temErroGrave: boolean): string {
  if (!temPreview) return 'Importe um arquivo primeiro';
  if (temErroGrave) return 'Corrija os inválidos';
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

export class PerfilImportacaoBinder {
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
    const temErroGrave = state.importacaoPreview.some(registro => !registro.valido);

    atualizarResumoArquivo(root, temPreview, state.importacaoPreview.length);

    confirmar.hidden = false;
    confirmar.disabled = !temPreview || temErroGrave;
    confirmar.textContent = importarButtonLabel(temPreview, temErroGrave);
    if (note) note.hidden = !temErroGrave;

    confirmar.addEventListener('click', async () => {
      if (!confirmar.disabled) await handlers.onConfirmarImportacao();
    });

    if (!temPreview) {
      preview.innerHTML = '<p class="perfil-import-empty">Escolha um arquivo para revisar os perfis antes de importar.</p>';
      return;
    }

    const localidadesBrasilia = buscarLocalidadesPorGrupo(grupoPadraoLocalidade().id);

    preview.innerHTML = state.importacaoPreview.map(registro => {
      const bairroSelecionado = registro.bairro || '';
      const telefone = normalizarTelefoneBrasil(registro.telefone || '');
      const statusLabel = registro.valido ? 'Válido' : 'Inválido';
      const statusClass = registro.valido ? 'status-ok' : 'status-error';

      return `
        <article class="perfil-import-card profile-card ${registro.valido ? 'preview-ok' : 'preview-error'}" data-preview-index="${registro.index}">
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

              <strong class="perfil-import-status valid-badge ${statusClass}">${statusLabel}</strong>
            </div>
          </div>

          ${registro.valido ? '' : `
            <p class="perfil-import-error-text">
              <span aria-hidden="true">!</span> ${escapeHtml(registro.erros.join('; '))}
            </p>
          `}
        </article>
      `;
    }).join('');

    preview.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-preview-field]').forEach(input => {
      input.addEventListener('input', () => {
        if (input.dataset.previewField !== 'telefone') return;

        const telefone = normalizarTelefoneBrasil(input.value);
        if (input.value !== telefone) input.value = telefone;
      });

      input.addEventListener('blur', async () => {
        const index = Number(input.dataset.previewIndex || 0);
        const field = input.dataset.previewField;

        if (field === 'nome') {
          await handlers.onAtualizarPreview(index, { nome: input.value });
        }

        if (field === 'telefone') {
          await handlers.onAtualizarPreview(index, { telefone: normalizarTelefoneBrasil(input.value) });
        }
      });

      input.addEventListener('change', async () => {
        const index = Number(input.dataset.previewIndex || 0);

        if (input.dataset.previewField === 'conhecePessoalmente') {
          await handlers.onAtualizarPreview(index, {
            conhecePessoalmente: (input as HTMLInputElement).checked
          });
        }

        if (input.dataset.previewField === 'bairro') {
          await handlers.onAtualizarPreview(index, { bairro: input.value });
        }
      });
    });
  }
}
