// v0.19.27
import importacaoBottomSheetHtml from './ImportacaoBottomSheet.html?raw';

const TEMPLATE_ID = 'importacao-bottom-sheet-template';

function injetarTemplate(): void {
  if (document.getElementById(TEMPLATE_ID)) return;
  const container = document.createElement('div');
  container.innerHTML = importacaoBottomSheetHtml;
  const template = container.querySelector('template');
  if (template) document.head.appendChild(template);
}

export interface BottomSheetCounts {
  ok: number;
  warning: number;
  error: number;
}

export type ModoImportacao = 'validos' | 'todos';

export interface ImportacaoBottomSheetElement {
  overlay: HTMLElement;
  sheet: HTMLElement;
}

export function criarBottomSheet(
  counts: BottomSheetCounts,
  onConfirmar: (modo: ModoImportacao) => void,
  onCancelar: () => void
): ImportacaoBottomSheetElement {
  injetarTemplate();

  const template = document.getElementById(TEMPLATE_ID) as HTMLTemplateElement | null;
  if (!template) throw new Error(`Template #${TEMPLATE_ID} não encontrado`);

  const clone = template.content.cloneNode(true) as DocumentFragment;

  const overlay = clone.querySelector<HTMLElement>('[data-overlay]');
  if (!overlay) throw new Error('Estrutura do template inválida: [data-overlay] não encontrado');

  const sheet = clone.querySelector<HTMLElement>('.importacao-bottom-sheet');
  if (!sheet) throw new Error('Estrutura do template inválida: .importacao-bottom-sheet não encontrado');

  // Subtitle
  const subtitleEl = sheet.querySelector<HTMLElement>('[data-sheet-subtitle]');
  if (subtitleEl) {
    subtitleEl.textContent = `${counts.ok} válidos · ${counts.warning} com atenção · ${counts.error} erros`;
  }

  // Badge somente válidos
  const badgeValidos = sheet.querySelector<HTMLElement>('[data-badge-validos]');
  if (badgeValidos) badgeValidos.textContent = `${counts.ok} perfis`;

  // Badge válidos + atenção
  const badgeTodos = sheet.querySelector<HTMLElement>('[data-badge-todos]');
  if (badgeTodos) badgeTodos.textContent = `${counts.ok + counts.warning} perfis`;

  // Opção somente válidos
  const btnSomenteValidos = sheet.querySelector<HTMLButtonElement>('[data-action="somente-validos"]');
  if (btnSomenteValidos) {
    btnSomenteValidos.addEventListener('click', () => onConfirmar('validos'));
  }

  // Opção válidos + atenção
  const btnValidosAtencao = sheet.querySelector<HTMLButtonElement>('[data-action="validos-atencao"]');
  if (btnValidosAtencao) {
    btnValidosAtencao.addEventListener('click', () => onConfirmar('todos'));
  }

  // Cancelar
  const btnCancelar = sheet.querySelector<HTMLButtonElement>('[data-action="cancelar"]');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', () => onCancelar());
  }

  // Overlay click also cancels
  overlay.addEventListener('click', () => onCancelar());

  return { overlay, sheet };
}
