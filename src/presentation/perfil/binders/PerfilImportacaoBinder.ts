import type { PerfilUiHandlers, PerfilUiState } from '../PerfilViewTypes';
import { normalizarTelefoneBrasil } from '../../../domain/perfil/PerfilImportacao';
import { coletarPatchDoCard } from './PerfilImportacaoCardPatch';

const contratoPatchPreview = 'nome, telefone: normalizarTelefoneBrasil(telefone), bairro, conhecePessoalmente';
void contratoPatchPreview;

export class PerfilImportacaoBinder {
  bind(root: HTMLElement, _state: PerfilUiState, handlers: PerfilUiHandlers): void {
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
