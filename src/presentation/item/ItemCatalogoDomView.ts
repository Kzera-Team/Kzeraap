import { ITEM_TEMPLATE } from './templates/ItemCatalogoTemplate';

import { ITEM_IMPORT_TEMPLATE } from './templates/ItemImportacaoTemplate';
// Importar itens fica em template externo para manter ItemCatalogoDomView modular e controlado.
import { bindFeedback } from '../shared/ui/FeedbackBinder';
import { ItemFormBinder } from './binders/ItemFormBinder';
import { ItemBuscaBinder } from './binders/ItemBuscaBinder';
import { ItemImportacaoBinder } from './binders/ItemImportacaoBinder';
import { ItemListBinder } from './binders/ItemListBinder';
import { LoteFracionamentoBinder } from './binders/LoteFracionamentoBinder';
import { LotePesagemRapidaBinder } from './binders/LotePesagemRapidaBinder';
import { ItemDashboardRenderer } from './renderers/ItemDashboardRenderer';
import { LoteOperacionalRenderer } from './renderers/LoteOperacionalRenderer';
import { encontrarLoteOperacional } from '../../domain/item/ItemCatalogo';
import type { ItemCatalogoUiHandlers, ItemCatalogoUiState } from './ItemCatalogoViewTypes';


export type { ItemCatalogoUiHandlers, ItemCatalogoUiState } from './ItemCatalogoViewTypes';

export class ItemCatalogoDomView {
  private readonly dashboardRenderer = new ItemDashboardRenderer();
  private readonly formBinder = new ItemFormBinder();
  private readonly buscaBinder = new ItemBuscaBinder();
  private readonly importacaoBinder = new ItemImportacaoBinder();
  private readonly listBinder = new ItemListBinder();
  private readonly loteRenderer = new LoteOperacionalRenderer();
  private readonly loteFracionamentoBinder = new LoteFracionamentoBinder();
  private readonly lotePesagemRapidaBinder = new LotePesagemRapidaBinder();

  private bindCreateScreen(root: HTMLElement, initialPanel: 'lista' | 'cadastro' | 'importacao' = 'lista'): void {
    const listPanel = root.querySelector<HTMLElement>('[data-item-list-panel]');
    const formPanel = root.querySelector<HTMLElement>('[data-item-form-panel]');
    const importPanel = root.querySelector<HTMLElement>('[data-item-import-panel]');
    const showList = () => { if (listPanel) listPanel.hidden = false; if (formPanel) formPanel.hidden = true; if (importPanel) importPanel.hidden = true; };
    const showForm = () => { if (listPanel) listPanel.hidden = true; if (formPanel) formPanel.hidden = false; if (importPanel) importPanel.hidden = true; };
    const showImport = () => { if (listPanel) listPanel.hidden = true; if (formPanel) formPanel.hidden = true; if (importPanel) importPanel.hidden = false; };
    root.querySelector('[data-action="novo-item"]')?.addEventListener('click', showForm);
    root.querySelector('[data-action="importar-itens"]')?.addEventListener('click', showImport);
    root.querySelectorAll('[data-action="voltar-itens"]').forEach(button => button.addEventListener('click', showList));
    if (initialPanel === 'cadastro') showForm();
    if (initialPanel === 'importacao') showImport();
  }

  private bindViewTabs(root: HTMLElement): void {
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-item-view-tab]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-item-view-panel]'));
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.itemViewTab || 'lista';
        buttons.forEach(item => item.classList.toggle('active', item === button));
        panels.forEach(panel => { panel.hidden = panel.dataset.itemViewPanel !== target; });
      });
    });
  }

  private bindFormTabs(root: HTMLElement): void {
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-item-form-tab]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-item-form-tab-panel]'));

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.itemFormTab || 'informacoes';
        buttons.forEach(item => item.classList.toggle('active', item === button));
        panels.forEach(panel => {
          panel.hidden = panel.dataset.itemFormTabPanel !== target;
        });
      });
    });
  }


  private bindLoteTabs(root: HTMLElement): void {
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-lote-view-tab]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-lote-view-panel]'));
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.loteViewTab || 'resumo';
        buttons.forEach(item => item.classList.toggle('active', item === button));
        panels.forEach(panel => {
          panel.hidden = panel.dataset.loteViewPanel !== target;
        });
      });
    });
  }


  private renderLoteOperacional(root: HTMLElement, state: ItemCatalogoUiState, handlers: ItemCatalogoUiHandlers): boolean {
    const selecionado = state.loteSelecionado;
    if (!selecionado) return false;
    const item = state.items.find(atual => atual.id === selecionado.itemId);
    if (!item) return false;
    const resultado = encontrarLoteOperacional(item, selecionado.variacaoId, selecionado.loteId);
    if (!resultado) return false;
    root.innerHTML = this.loteRenderer.render({ item, variacao: resultado.variacao, lote: resultado.lote, balancas: state.balancas });
    root.querySelector('[data-action="voltar-lista-itens"]')?.addEventListener('click', async () => handlers.onFecharLote());
    this.bindLoteTabs(root);
    this.loteFracionamentoBinder.bind(root, handlers);
    this.lotePesagemRapidaBinder.bind(root, handlers);
    return true;
  }

  render(root: HTMLElement, state: ItemCatalogoUiState, handlers: ItemCatalogoUiHandlers, initialPanel: 'lista' | 'cadastro' | 'importacao' = 'lista'): void {
    if (this.renderLoteOperacional(root, state, handlers)) return;

    if (initialPanel === 'importacao') {
      root.innerHTML = ITEM_IMPORT_TEMPLATE;
      bindFeedback(root, { loading: '[data-testid="item-loading"]', mensagem: '[data-testid="item-mensagem"]', erro: '[data-testid="item-erro"]' }, state);
      this.importacaoBinder.bind(root, state, handlers);
      return;
    }

    root.innerHTML = ITEM_TEMPLATE;

    bindFeedback(root, {
      loading: '[data-testid="item-loading"]',
      mensagem: '[data-testid="item-mensagem"]',
      erro: '[data-testid="item-erro"]'
    }, state);

    const dashboardSlot = root.querySelector('[data-slot="dashboard"]');
    if (dashboardSlot) dashboardSlot.innerHTML = this.dashboardRenderer.render(state);

    this.bindCreateScreen(root, initialPanel);
    this.bindViewTabs(root);
    this.bindFormTabs(root);
    this.formBinder.bind(root, handlers);
    this.buscaBinder.bind(root, handlers);
    this.importacaoBinder.bind(root, state, handlers);
    this.listBinder.bind(root, state, handlers);
  }
}

// UI handlers: onCriarItem, onSelecionarArquivo, onConfirmarImportacao, onExportar































// bindCreateScreen(root)
