import { escapeHtml, inputValue, numberValue } from '../shared/ui/Html';
import type { ObterRegraFidelidadeUseCase } from '../../application/fidelidade/ObterRegraFidelidadeUseCase';
import type { SalvarRegraFidelidadeUseCase } from '../../application/fidelidade/SalvarRegraFidelidadeUseCase';
import type { ArquivarRegraFidelidadeUseCase } from '../../application/fidelidade/ArquivarRegraFidelidadeUseCase';
import type { PremioFidelidade, RegraFidelidadeStatus } from '../../domain/fidelidade/RegraFidelidade';

export interface FidelizacaoConfigModule {
  obterRegra: ObterRegraFidelidadeUseCase;
  salvarRegra: SalvarRegraFidelidadeUseCase;
  arquivarRegra: ArquivarRegraFidelidadeUseCase;
}

const CSS = `
.fc-root *, .fc-root *::before, .fc-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

.fc-root {
  --purple:      #7B4DFF;
  --purple-dark: #5B2ECC;
  --bg:          #F7F3FF;
  --white:       #ffffff;
  --text:        #120B35;
  --muted:       #766BA8;
  --border:      #DDD6EE;
  --danger:      #C62828;
  --danger-bg:   #FFF5F5;
  --danger-bdr:  #FFCDD2;
  --green:       #087A36;
  --green-bg:    #DDF8E7;
  --green-bdr:   #A8E8BF;
  position: fixed; inset: 0; z-index: 5;
  background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  color: var(--text);
  display: flex; flex-direction: column; overflow: hidden;
}

.fc-root button { cursor: pointer; font-family: inherit; border: none; background: none; padding: 0; color: inherit; }

.fc-root .app-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px 12px; background: #120B35; flex-shrink: 0; z-index: 10;
}
.fc-root .hamburger { display: flex; flex-direction: column; gap: 4px; width: 28px; height: 28px; background: none; border: none; padding: 2px; cursor: pointer; justify-content: center; }
.fc-root .hamburger span { display: block; width: 18px; height: 2px; border-radius: 2px; background: #fff; }
.fc-root .app-header h1 { color: #fff; font-size: 16px; font-weight: 800; letter-spacing: -0.02em; }
.fc-root .btn-header { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22); border-radius: 10px; color: #fff; font-size: 13px; font-weight: 800; padding: 6px 12px; cursor: pointer; }

.fc-root .screen { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 20px 16px 60px; }
.fc-root .section { margin-bottom: 28px; }
.fc-root .section-head { font-size: 13px; font-weight: 900; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px; }
.fc-root .card { background: var(--white); border: 1px solid var(--border); border-radius: 18px; padding: 16px; box-shadow: 0 2px 10px rgba(30,14,70,0.06); }

.fc-root .field { margin-bottom: 14px; }
.fc-root .field:last-child { margin-bottom: 0; }
.fc-root .field label { display: block; font-size: 13px; font-weight: 800; color: var(--muted); margin-bottom: 6px; }
.fc-root .field-input {
  width: 100%; height: 48px; padding: 0 14px;
  border: 1px solid #C4BAE4; border-radius: 13px;
  background: var(--white); color: var(--text);
  font-size: 15px; font-weight: 700; font-family: inherit;
  outline: none; appearance: none; display: block;
}
.fc-root .field-input::placeholder { color: #B0A8D0; font-weight: 700; }
.fc-root .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.fc-root .hint { font-size: 11px; font-weight: 700; color: #B0A8D0; margin-top: 5px; padding-left: 2px; }

.fc-root .status-selector { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.fc-root .status-option { height: 40px; border-radius: 11px; border: 1px solid var(--border); background: var(--bg); color: var(--muted); font-size: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.fc-root .status-option.active-green  { background: var(--green-bg);  border-color: var(--green-bdr); color: var(--green); }
.fc-root .status-option.active-muted  { background: #F0EDF8; border-color: #C4BAE4; color: #4A3880; }
.fc-root .status-option.active-danger { background: var(--danger-bg); border-color: var(--danger-bdr); color: var(--danger); }

.fc-root .prize-card { background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 14px; margin-bottom: 10px; }
.fc-root .prize-card:last-of-type { margin-bottom: 0; }
.fc-root .prize-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.fc-root .prize-step-badge { font-size: 12px; font-weight: 900; color: #8B6B2A; background: #FFF3CC; border: 1px solid #DDB84A; border-radius: 8px; padding: 3px 10px; }
.fc-root .btn-remove { background: none; border: none; color: #B0A8D0; font-size: 18px; cursor: pointer; line-height: 1; padding: 0 4px; }

.fc-root .toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.fc-root .toggle-label { font-size: 13px; font-weight: 700; color: var(--muted); }
.fc-root .toggle { width: 42px; height: 24px; border-radius: 12px; background: var(--green-bg); border: 1px solid var(--green-bdr); position: relative; cursor: pointer; flex-shrink: 0; }
.fc-root .toggle::after { content: ''; position: absolute; top: 3px; right: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--green); }
.fc-root .toggle.off { background: #F0EDF8; border-color: var(--border); }
.fc-root .toggle.off::after { right: auto; left: 3px; background: #C4BAE4; }

.fc-root .btn-add { width: 100%; height: 46px; border-radius: 13px; border: 1px dashed #C4BAE4; background: transparent; color: var(--purple); font-size: 14px; font-weight: 800; cursor: pointer; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; }

.fc-root .actions-bar { display: flex; flex-direction: column; gap: 8px; }
.fc-root .btn-primary { width: 100%; height: 54px; border-radius: 16px; border: none; background: linear-gradient(180deg, var(--purple) 0%, var(--purple-dark) 100%); color: #fff; font-size: 16px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 24px rgba(91,46,204,0.35); }
.fc-root .btn-danger  { width: 100%; height: 48px; border-radius: 14px; border: 1px solid var(--danger-bdr); background: var(--white); color: var(--danger); font-size: 14px; font-weight: 800; cursor: pointer; }

.fc-root .toast { font-size: 13px; font-weight: 700; border-radius: 12px; padding: 10px 14px; margin-bottom: 16px; }
.fc-root .toast-success { background: var(--green-bg); border: 1px solid var(--green-bdr); color: var(--green); }
.fc-root .toast-error   { background: var(--danger-bg); border: 1px solid var(--danger-bdr); color: var(--danger); }

/* Sheet state */
.fc-root .bg-content { opacity: 0.35; pointer-events: none; filter: blur(1px); overflow: hidden; max-height: 100vh; }
.fc-root .overlay { position: fixed; inset: 0; background: rgba(8,4,22,0.5); z-index: 20; }
.fc-root .bottom-sheet { position: fixed; bottom: 0; left: 0; right: 0; background: var(--bg); border-radius: 28px 28px 0 0; padding: 12px 16px 40px; box-shadow: 0 -12px 48px rgba(18,8,45,0.3); z-index: 30; }
.fc-root .sheet-handle { width: 40px; height: 4px; border-radius: 2px; background: #C4BAE4; margin: 0 auto 20px; }
.fc-root .sheet-title { color: var(--text); font-size: 20px; font-weight: 900; letter-spacing: -0.3px; margin-bottom: 4px; }
.fc-root .sheet-sub { color: var(--muted); font-size: 13px; font-weight: 700; margin-bottom: 20px; line-height: 1.4; }
.fc-root .btn-cancel { width: 100%; height: 44px; border: none; background: transparent; color: var(--purple); font-size: 14px; font-weight: 800; cursor: pointer; }
`;

interface ConfigState {
  regraId: string | null;
  status: RegraFidelidadeStatus;
  premios: PremioFidelidade[];
  sheetOpen: boolean;
  mensagem: string;
  erro: string;
}

export class FidelizacaoConfigView {
  private root: HTMLElement | null = null;
  private state: ConfigState = {
    regraId: null,
    status: 'ativa',
    premios: [],
    sheetOpen: false,
    mensagem: '',
    erro: '',
  };

  constructor(private readonly module: FidelizacaoConfigModule) {}

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    this.state = { regraId: null, status: 'ativa', premios: [], sheetOpen: false, mensagem: '', erro: '' };
    await this.load();
  }

  private async load(): Promise<void> {
    const regra = await this.module.obterRegra.execute();
    if (regra) {
      this.state.regraId = regra.id;
      this.state.status = regra.status;
      this.state.premios = structuredClone(regra.premios);
    }
    this.render(regra);
  }

  private render(regra?: { nome: string; totalPassos: number; periodoInicio: string; periodoFim?: string; regraPassoItemId: string; regraPassoItemNome: string; regraPassoQuantidade: number; regraPassoUnidade: string; regraPassoPassosGerados: number } | null): void {
    if (!this.root) return;
    const s = this.state;
    const nome        = regra?.nome ?? '';
    const totalPassos = regra?.totalPassos ?? 10;
    const inicio      = regra?.periodoInicio ?? '';
    const fim         = regra?.periodoFim ?? '';
    const itemId      = regra?.regraPassoItemId ?? '';
    const itemNome    = regra?.regraPassoItemNome ?? '';
    const qtd         = regra?.regraPassoQuantidade ?? 1;
    const unidade     = regra?.regraPassoUnidade ?? 'un';
    const passosGerados = regra?.regraPassoPassosGerados ?? 1;

    const toastHtml = s.mensagem
      ? `<div class="toast toast-success">${escapeHtml(s.mensagem)}</div>`
      : s.erro
      ? `<div class="toast toast-error">${escapeHtml(s.erro)}</div>`
      : '';

    const premiosHtml = s.premios.length === 0
      ? ''
      : s.premios.map((p, i) => `
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

    const formHtml = `
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
                <input class="field-input" id="fc-inicio" type="date" value="${escapeHtml(inicio)}" />
                <div class="hint">Início</div>
              </div>
              <div>
                <input class="field-input" id="fc-fim" type="date" value="${escapeHtml(fim)}" placeholder="—" style="color:${fim ? 'var(--text)' : '#B0A8D0'};" />
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
            <input class="field-input" id="fc-item-nome" value="${escapeHtml(itemNome || itemId)}" placeholder="Código · Nome do item" />
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
          ${s.regraId ? `<button type="button" class="btn-danger" data-arquivar>Arquivar regra</button>` : ''}
        </div>
      </div>`;

    const sheetHtml = s.sheetOpen ? `
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
      </div>` : '';

    const bgWrap = s.sheetOpen ? `<div class="bg-content"><div class="app-header"><button class="hamburger"><span></span><span></span><span></span></button><h1>Config. Fidelidade</h1><button class="btn-header">Salvar</button></div><div class="screen">${toastHtml}${formHtml}</div></div>` : '';
    const mainWrap = s.sheetOpen ? '' : `<div class="app-header"><button class="hamburger" data-menu-toggle><span></span><span></span><span></span></button><h1>Config. Fidelidade</h1><button class="btn-header" data-salvar type="button">Salvar</button></div><div class="screen">${toastHtml}${formHtml}</div>`;

    this.root.innerHTML = `<style>${CSS}</style><div class="fc-root">${bgWrap}${mainWrap}${sheetHtml}</div>`;
    this.bind(regra);
  }

  private bind(regra: Parameters<FidelizacaoConfigView['render']>[0]): void {
    if (!this.root) return;

    this.root.querySelectorAll('[data-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.status = (btn as HTMLElement).dataset.status as RegraFidelidadeStatus;
        this.state.mensagem = '';
        this.state.erro = '';
        this.render(regra);
      });
    });

    this.root.querySelectorAll('[data-toggle-prize]').forEach(el => {
      el.addEventListener('click', () => {
        const i = Number((el as HTMLElement).dataset.togglePrize);
        this.syncPrizesFromDom();
        this.state.premios[i].ativo = !this.state.premios[i].ativo;
        this.render(this.readFormValues());
      });
    });

    this.root.querySelectorAll('[data-remove-prize]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number((btn as HTMLElement).dataset.removePrize);
        this.syncPrizesFromDom();
        this.state.premios.splice(i, 1);
        this.render(this.readFormValues());
      });
    });

    this.root.querySelector('[data-open-sheet]')?.addEventListener('click', () => {
      this.syncPrizesFromDom();
      this.state.sheetOpen = true;
      this.state.mensagem = '';
      this.state.erro = '';
      this.render(this.readFormValues());
    });

    this.root.querySelectorAll('[data-close-sheet]').forEach(el => {
      el.addEventListener('click', () => {
        this.state.sheetOpen = false;
        this.render(this.readFormValues());
      });
    });

    const sheetToggle = this.root.querySelector<HTMLElement>('#fc-sheet-toggle');
    sheetToggle?.addEventListener('click', () => {
      const current = sheetToggle.dataset.ativo === 'true';
      sheetToggle.dataset.ativo = String(!current);
      sheetToggle.classList.toggle('off', current);
    });

    this.root.querySelector('[data-sheet-adicionar]')?.addEventListener('click', () => {
      const r = this.root!;
      const passo = Number(inputValue(r, '#fc-sheet-passo'));
      const desc  = inputValue(r, '#fc-sheet-desc').trim();
      const item  = inputValue(r, '#fc-sheet-item').trim();
      const ativo = r.querySelector<HTMLElement>('#fc-sheet-toggle')?.dataset.ativo !== 'false';
      const totalPassos = Number(inputValue(r, '#fc-passos')) || 10;

      if (!passo || passo < 1 || passo > totalPassos) {
        this.state.erro = `Passo deve estar entre 1 e ${totalPassos}.`;
        this.render(this.readFormValues());
        return;
      }
      if (!desc) { this.state.erro = 'Descrição é obrigatória.'; this.render(this.readFormValues()); return; }

      this.state.premios.push({ passo, descricao: desc, itemId: item, itemNome: item, ativo });
      this.state.sheetOpen = false;
      this.state.erro = '';
      this.render(this.readFormValues());
    });

    this.root.querySelectorAll('[data-salvar]').forEach(btn => {
      btn.addEventListener('click', async () => {
        this.syncPrizesFromDom();
        const values = this.readFormValues();
        this.state.mensagem = '';
        this.state.erro = '';
        try {
          const saved = await this.module.salvarRegra.execute({
            id: this.state.regraId ?? undefined,
            nome: values?.nome ?? '',
            status: this.state.status,
            totalPassos: values?.totalPassos ?? 0,
            periodoInicio: values?.periodoInicio ?? '',
            periodoFim: values?.periodoFim || undefined,
            regraPassoItemId: values?.regraPassoItemId ?? '',
            regraPassoItemNome: values?.regraPassoItemNome ?? '',
            regraPassoQuantidade: values?.regraPassoQuantidade ?? 0,
            regraPassoUnidade: values?.regraPassoUnidade ?? '',
            regraPassoPassosGerados: values?.regraPassoPassosGerados ?? 0,
            premios: this.state.premios,
          });
          this.state.regraId = saved.id;
          this.state.mensagem = 'Regra salva.';
          this.render(saved);
        } catch (err) {
          this.state.erro = err instanceof Error ? err.message : 'Erro ao salvar.';
          this.render(values);
        }
      });
    });

    this.root.querySelector('[data-arquivar]')?.addEventListener('click', async () => {
      if (!this.state.regraId) return;
      this.state.mensagem = '';
      this.state.erro = '';
      try {
        await this.module.arquivarRegra.execute(this.state.regraId);
        this.state.regraId = null;
        this.state.status = 'ativa';
        this.state.premios = [];
        this.state.mensagem = 'Regra arquivada.';
        this.render(null);
      } catch (err) {
        this.state.erro = err instanceof Error ? err.message : 'Erro ao arquivar.';
        this.render(this.readFormValues());
      }
    });
  }

  private readFormValues() {
    if (!this.root) return null;
    const r = this.root;
    return {
      nome:                   inputValue(r, '#fc-nome'),
      totalPassos:            numberValue(r, '#fc-passos'),
      periodoInicio:          inputValue(r, '#fc-inicio'),
      periodoFim:             inputValue(r, '#fc-fim'),
      regraPassoItemId:       inputValue(r, '#fc-item-nome'),
      regraPassoItemNome:     inputValue(r, '#fc-item-nome'),
      regraPassoQuantidade:   numberValue(r, '#fc-qtd'),
      regraPassoUnidade:      inputValue(r, '#fc-unidade'),
      regraPassoPassosGerados: numberValue(r, '#fc-passos-gerados'),
    };
  }

  private syncPrizesFromDom(): void {
    if (!this.root) return;
    this.root.querySelectorAll<HTMLElement>('[data-prize]').forEach(card => {
      const i = Number(card.dataset.prize);
      if (!this.state.premios[i]) return;
      const desc = (card.querySelector(`[data-prize-desc="${i}"]`) as HTMLInputElement | null)?.value ?? '';
      const item = (card.querySelector(`[data-prize-item="${i}"]`) as HTMLInputElement | null)?.value ?? '';
      this.state.premios[i].descricao = desc;
      this.state.premios[i].itemId   = item;
      this.state.premios[i].itemNome = item;
    });
  }
}
