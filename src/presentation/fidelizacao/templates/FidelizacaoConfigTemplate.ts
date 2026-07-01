import { escapeHtml } from '../../shared/ui/Html';
import type { PremioFidelidade, RegraFidelidadeStatus } from '../../../domain/fidelidade/RegraFidelidade';

export interface ConfigTemplateValues {
  nome: string;
  totalPassos: number;
  periodoInicio: string;
  periodoFim: string;
  itemNome: string;
  qtd: number;
  unidade: string;
  passosGerados: number;
}

export interface ConfigTemplateState {
  regraId: string | null;
  status: RegraFidelidadeStatus;
  premios: PremioFidelidade[];
  sheetOpen: boolean;
  mensagem: string;
  erro: string;
}

export function renderToast(mensagem: string, erro: string): string {
  if (mensagem) return `<div class="toast toast-success">${escapeHtml(mensagem)}</div>`;
  if (erro) return `<div class="toast toast-error">${escapeHtml(erro)}</div>`;
  return '';
}

export function renderPremios(premios: PremioFidelidade[]): string {
  return premios.map((p, i) => `
    <div class="prize-card" data-prize="${i}">
      <div class="prize-card-header">
        <span class="prize-step-badge">Passo ${escapeHtml(String(p.passo))}</span>
        <button class="btn-remove" data-remove-prize="${i}" type="button">×</button>
      </div>
      <div class="field">
        <label>Descrição</label>
        <input class="field-input" value="${escapeHtml(p.descricao)}" data-prize-desc="${i}" />
      </div>
      <div class="field">
        <label>Item do prêmio</label>
        <input class="field-input" value="${escapeHtml(p.itemNome || p.itemId)}" data-prize-item="${i}" />
      </div>
      <div class="toggle-row">
        <span class="toggle-label">Ativo</span>
        <div class="toggle${p.ativo ? '' : ' off'}" data-toggle-prize="${i}" role="switch" aria-checked="${p.ativo}"></div>
      </div>
    </div>`).join('');
}

export function renderForm(values: ConfigTemplateValues, state: ConfigTemplateState): string {
  const { nome, totalPassos, periodoInicio, periodoFim, itemNome, qtd, unidade, passosGerados } = values;
  const s = state;
  const toastHtml = renderToast(s.mensagem, s.erro);
  const premiosHtml = renderPremios(s.premios);

  return `
    ${toastHtml}
    <div class="section">
      <div class="section-head">Identificação</div>
      <div class="card">
        <div class="field">
          <label>Nome da regra</label>
          <input class="field-input" id="fc-nome" value="${escapeHtml(nome)}" placeholder="Nome da regra" />
        </div>
        <div class="field">
          <label>Status</label>
          <div class="status-selector">
            <button type="button" class="status-option${s.status === 'ativa' ? ' active-green' : ''}" data-status="ativa">Ativa</button>
            <button type="button" class="status-option${s.status === 'inativa' ? ' active-muted' : ''}" data-status="inativa">Inativa</button>
            <button type="button" class="status-option${s.status === 'arquivada' ? ' active-danger' : ''}" data-status="arquivada">Arquivada</button>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-head">Parâmetros</div>
      <div class="card">
        <div class="field">
          <label>Quantidade de passos do cartão</label>
          <input class="field-input" id="fc-passos" type="number" min="1" value="${escapeHtml(String(totalPassos))}" />
        </div>
        <div class="field">
          <label>Período válido</label>
          <div class="field-row">
            <div>
              <input class="field-input" id="fc-inicio" type="date" value="${escapeHtml(periodoInicio)}" />
              <div class="hint">Início</div>
            </div>
            <div>
              <input class="field-input" id="fc-fim" type="date" value="${escapeHtml(periodoFim)}" placeholder="—" style="color:${periodoFim ? 'var(--text)' : '#B0A8D0'};" />
              <div class="hint">Fim (opcional)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-head">Regra de passo</div>
      <div class="card">
        <div class="field">
          <label>Item</label>
          <input class="field-input" id="fc-item-nome" value="${escapeHtml(itemNome)}" placeholder="Código · Nome do item" />
        </div>
        <div class="field-row">
          <div class="field">
            <label>Quantidade</label>
            <input class="field-input" id="fc-qtd" type="number" min="1" value="${escapeHtml(String(qtd))}" />
          </div>
          <div class="field">
            <label>Unidade</label>
            <input class="field-input" id="fc-unidade" value="${escapeHtml(unidade)}" placeholder="un" />
          </div>
        </div>
        <div class="field" style="margin-top:10px;">
          <label>Passos gerados</label>
          <input class="field-input" id="fc-passos-gerados" type="number" min="1" value="${escapeHtml(String(passosGerados))}" />
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-head">Prêmios por passo</div>
      <div class="card">
        ${premiosHtml}
        <button type="button" class="btn-add" data-open-sheet>+ Adicionar prêmio</button>
      </div>
    </div>

    <div class="section" style="margin-bottom:0;">
      <div class="actions-bar">
        <button type="button" class="btn-primary" data-salvar>Salvar regra</button>
        ${s.regraId ? '<button type="button" class="btn-danger" data-arquivar>Arquivar regra</button>' : ''}
      </div>
    </div>`;
}

export function renderHeader(interactive: boolean): string {
  const toggle = interactive ? ' data-menu-toggle' : '';
  const salvar = interactive ? ' data-salvar type="button"' : '';
  return `
    <div class="app-header">
      <button class="hamburger"${toggle}><span></span><span></span><span></span></button>
      <h1>Config. Fidelidade</h1>
      <button class="btn-header"${salvar}>Salvar</button>
    </div>`;
}

export function renderSheet(totalPassos: number): string {
  return `
    <div class="overlay" data-close-sheet></div>
    <div class="bottom-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-title">Adicionar prêmio</div>
      <div class="sheet-sub">Passo deve estar entre 1 e o total de passos do cartão</div>
      <div class="field">
        <label>Passo</label>
        <input class="field-input" id="fc-sheet-passo" type="number" min="1" max="${totalPassos}" value="" placeholder="Ex: 5" />
        <div class="hint">1 ≤ passo ≤ ${totalPassos}</div>
      </div>
      <div class="field">
        <label>Descrição</label>
        <input class="field-input" id="fc-sheet-desc" value="" placeholder="Ex: Desconto 15%" />
      </div>
      <div class="field">
        <label>Item do prêmio</label>
        <input class="field-input" id="fc-sheet-item" value="" placeholder="Buscar item..." />
        <div class="hint">Apenas itens marcados como prêmio de fidelidade</div>
      </div>
      <div class="toggle-row" style="margin-bottom:20px;">
        <span class="toggle-label">Ativo ao salvar</span>
        <div class="toggle" id="fc-sheet-toggle" data-ativo="true"></div>
      </div>
      <button type="button" class="btn-primary" data-sheet-adicionar>Adicionar</button>
      <button type="button" class="btn-cancel" data-close-sheet>Cancelar</button>
    </div>`;
}

export function renderConfigRoot(formContent: string, sheetOpen: boolean, totalPassos: number): string {
  if (sheetOpen) {
    return `<div class="fc-root">
      <div class="bg-content">${renderHeader(false)}<div class="screen">${formContent}</div></div>
      ${renderSheet(totalPassos)}
    </div>`;
  }
  return `<div class="fc-root">${renderHeader(true)}<div class="screen">${formContent}</div></div>`;
}
