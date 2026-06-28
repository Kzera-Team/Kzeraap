import type { PerfilUiHandlers, PerfilUiState } from '../PerfilViewTypes';
import { normalizarTelefoneBrasil } from '../../../domain/perfil/PerfilImportacao';
import { coletarPatchDoCard } from './PerfilImportacaoCardPatch';

const contratoPatchPreview = 'nome, telefone: normalizarTelefoneBrasil(telefone), bairro, conhecePessoalmente';
void contratoPatchPreview;

export class PerfilImportacaoBinder {
  bind(root: HTMLElement, state: PerfilUiState, handlers: PerfilUiHandlers): void {
    root.querySelector<HTMLInputElement>('#perfil-import-file')?.addEventListener('change', async event => {
      const input = event.currentTarget as HTMLInputElement;
      const file = input.files?.[0];
      if (file) await handlers.onSelecionarArquivo(file);
    });

    const confirmar = root.querySelector<HTMLButtonElement>('[data-action="confirmar-importacao-perfis"]');
    if (confirmar) {
      confirmar.hidden = state.importacaoPreview.length === 0;
      confirmar.disabled = !state.importacaoPreview.some(registro => registro.valido);
      confirmar.addEventListener('click', async () => handlers.onConfirmarImportacao());
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
