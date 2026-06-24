import perfilTemplateHtml from './templates/PerfilTemplate.html?raw';
import perfilImportacaoTemplateHtml from './templates/PerfilImportacaoTemplate.html?raw';
import { bindFeedback } from '../shared/ui/FeedbackBinder';
import { PerfilFormBinder } from './binders/PerfilFormBinder';
import { PerfilSearchBinder } from './binders/PerfilSearchBinder';
import { PerfilImportacaoBinder } from './binders/PerfilImportacaoBinder';
import { PerfilListBinder } from './binders/PerfilListBinder';
import { PerfilDuplicidadeBinder } from './binders/PerfilDuplicidadeBinder';
import { PerfilDashboardRenderer } from './renderers/PerfilDashboardRenderer';
import { PerfilTimelineRenderer } from './renderers/PerfilTimelineRenderer';
import type { PerfilUiHandlers, PerfilUiState } from './PerfilViewTypes';
import { buscarLocalidadesPorGrupo, listarGruposLocalidade, grupoPadraoLocalidade } from '../../domain/localidade/LocalidadeCatalogo';

export type { PerfilTimelineItem, PerfilUiHandlers, PerfilUiState } from './PerfilViewTypes';

export class PerfilDomView {
  private readonly dashboardRenderer = new PerfilDashboardRenderer();
  private readonly timelineRenderer = new PerfilTimelineRenderer();
  private readonly formBinder = new PerfilFormBinder();
  private readonly searchBinder = new PerfilSearchBinder();
  private readonly importacaoBinder = new PerfilImportacaoBinder();
  private readonly listBinder = new PerfilListBinder();
  private readonly duplicidadeBinder = new PerfilDuplicidadeBinder();

  private bindCreateScreen(root: HTMLElement, initialPanel: 'lista' | 'cadastro' | 'importacao' = 'lista'): void {
    const listSelectors = '[data-perfil-list-panel], [data-perfil-list-panel-continue], [data-testid="perfil-actions"]';
    const formPanel = root.querySelector<HTMLElement>('[data-perfil-form-panel]');
    const importPanel = root.querySelector<HTMLElement>('[data-perfil-import-panel]');
    const showList = () => {
      root.querySelectorAll<HTMLElement>(listSelectors).forEach(el => { el.hidden = false; });
      if (formPanel) formPanel.hidden = true;
      if (importPanel) importPanel.hidden = true;
    };
    const showForm = () => {
      root.querySelectorAll<HTMLElement>(listSelectors).forEach(el => { el.hidden = true; });
      if (formPanel) formPanel.hidden = false;
      if (importPanel) importPanel.hidden = true;
    };
    const showImport = () => {
      root.querySelectorAll<HTMLElement>(listSelectors).forEach(el => { el.hidden = true; });
      if (formPanel) formPanel.hidden = true;
      if (importPanel) importPanel.hidden = false;
    };
    root.querySelector('[data-action="novo-perfil"]')?.addEventListener('click', showForm);
    root.querySelector('[data-action="importar-perfis"]')?.addEventListener('click', showImport);
    root.querySelectorAll('[data-action="voltar-perfis"]').forEach(button => button.addEventListener('click', showList));
    if (initialPanel === 'cadastro') showForm();
    if (initialPanel === 'importacao') showImport();
  }

  private bindViewTabs(root: HTMLElement): void {
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-perfil-view-tab]'));
    const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-perfil-view-panel]'));
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.perfilViewTab || 'lista';
        buttons.forEach(item => item.classList.toggle('active', item === button));
        panels.forEach(panel => { panel.hidden = panel.dataset.perfilViewPanel !== target; });
      });
    });
  }

  private bindLocalidadeSelectors(root: HTMLElement): void {
    const grupo = root.querySelector<HTMLSelectElement>('[data-localidade-grupo]');
    const bairro = root.querySelector<HTMLSelectElement>('[data-localidade-select]');
    if (!grupo || !bairro) return;

    const grupoPadrao = grupoPadraoLocalidade();
    for (const g of listarGruposLocalidade()) {
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.nome;
      opt.selected = g.id === grupoPadrao.id;
      grupo.appendChild(opt);
    }

    const update = () => {
      const current = bairro.value;
      bairro.replaceChildren();
      for (const localidade of buscarLocalidadesPorGrupo(grupo.value)) {
        const opt = document.createElement('option');
        opt.value = localidade;
        opt.textContent = localidade;
        opt.selected = localidade === current;
        bairro.appendChild(opt);
      }
    };
    grupo.addEventListener('change', update);
    update();
  }

  render(root: HTMLElement, state: PerfilUiState, handlers: PerfilUiHandlers, initialPanel: 'lista' | 'cadastro' | 'importacao' = 'lista'): void {
    if (initialPanel === 'importacao') {
      root.innerHTML = perfilImportacaoTemplateHtml;
      bindFeedback(root, { loading: '[data-testid="perfil-loading"]', mensagem: '[data-testid="perfil-mensagem"]', erro: '[data-testid="perfil-erro"]' }, state);
      this.importacaoBinder.bind(root, state, handlers);
      return;
    }

    root.innerHTML = perfilTemplateHtml;

    bindFeedback(root, {
      loading: '[data-testid="perfil-loading"]',
      mensagem: '[data-testid="perfil-mensagem"]',
      erro: '[data-testid="perfil-erro"]'
    }, state);

    this.fillDashboard(root, state);
    this.bindCreateScreen(root, initialPanel);
    this.bindViewTabs(root);
    this.bindLocalidadeSelectors(root);
    this.formBinder.bind(root, handlers);
    this.searchBinder.bind(root, state, handlers);
    this.importacaoBinder.bind(root, state, handlers);
    this.listBinder.bind(root, state, handlers);
    this.fillTimeline(root, state);
    this.duplicidadeBinder.bind(root, state);
  }
  private fillDashboard(root: HTMLElement, state: PerfilUiState): void {
    const headerSlot = root.querySelector('[data-slot="header-metrics"]');
    const dashboardSlot = root.querySelector('[data-slot="dashboard"]');

    if (headerSlot) headerSlot.innerHTML = this.dashboardRenderer.renderHeaderMetrics(state);
    if (dashboardSlot) dashboardSlot.innerHTML = this.dashboardRenderer.renderDashboard(state);
  }
  private fillTimeline(root: HTMLElement, state: PerfilUiState): void {
    const slot = root.querySelector('[data-slot="timeline"]');
    if (slot) slot.innerHTML = this.timelineRenderer.render(state.timeline);
  }
}

