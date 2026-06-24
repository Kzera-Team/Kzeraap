// v0.19.27
import importacaoFabHtml from './ImportacaoFab.html?raw';
import { injetarTemplate } from '../../../shared/ui/InjetarTemplate';

const TEMPLATE_ID = 'importacao-fab-template';

export interface ImportacaoFabCounts {
  ok: number;
  warning: number;
  error: number;
}

export interface ImportacaoFabElement {
  elemento: HTMLElement;
  atualizarCounts(counts: ImportacaoFabCounts): void;
}

export function criarImportacaoFab(
  counts: ImportacaoFabCounts,
  onOpen: () => void
): ImportacaoFabElement {
  injetarTemplate(TEMPLATE_ID, importacaoFabHtml);

  const template = document.getElementById(TEMPLATE_ID) as HTMLTemplateElement | null;
  if (!template) throw new Error(`Template #${TEMPLATE_ID} não encontrado`);

  const clone = template.content.cloneNode(true) as DocumentFragment;
  const button = clone.querySelector<HTMLButtonElement>('.fab-importar');
  if (!button) throw new Error('Estrutura do template inválida: .fab-importar não encontrado');

  const countEl = button.querySelector<HTMLElement>('[data-fab-count]');
  if (countEl) countEl.textContent = String(counts.ok);

  button.addEventListener('click', () => onOpen());

  return {
    elemento: button,
    atualizarCounts(newCounts: ImportacaoFabCounts): void {
      if (countEl) countEl.textContent = String(newCounts.ok);
    },
  };
}
