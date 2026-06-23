import type { PerfilImportacaoPreviewRegistro } from '../../../domain/perfil/PerfilImportacao';
import { normalizarTelefoneBrasil } from '../../../domain/perfil/PerfilImportacao';

export function coletarPatchDoCard(input: HTMLInputElement | HTMLSelectElement): Partial<PerfilImportacaoPreviewRegistro> {
  const card = input.closest<HTMLElement>('[data-preview-index]');
  if (!card) return {};

  const nome = card.querySelector<HTMLInputElement>('[data-preview-field="nome"]')?.value ?? '';
  const telefone = card.querySelector<HTMLInputElement>('[data-preview-field="telefone"]')?.value ?? '';
  const bairro = card.querySelector<HTMLSelectElement>('[data-preview-field="bairro"]')?.value ?? '';
  const conhecePessoalmente = card.querySelector<HTMLInputElement>('[data-preview-field="conhecePessoalmente"]')?.checked ?? false;

  return {
    nome,
    telefone: normalizarTelefoneBrasil(telefone),
    bairro,
    conhecePessoalmente
  };
}
