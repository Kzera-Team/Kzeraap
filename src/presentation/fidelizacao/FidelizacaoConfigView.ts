import './styles/fidelizacao-config.css';
import { FIDELIZACAO_CONFIG_TEMPLATE } from './templates/FidelizacaoConfigTemplate';
import type { ObterRegraFidelidadeUseCase } from '../../application/fidelidade/ObterRegraFidelidadeUseCase';
import type { SalvarRegraFidelidadeUseCase } from '../../application/fidelidade/SalvarRegraFidelidadeUseCase';
import type { ArquivarRegraFidelidadeUseCase } from '../../application/fidelidade/ArquivarRegraFidelidadeUseCase';
import type { PremioFidelidade, RegraFidelidade, RegraFidelidadeStatus } from '../../domain/fidelidade/RegraFidelidade';

export interface FidelizacaoConfigModule {
  obterRegra: ObterRegraFidelidadeUseCase;
  salvarRegra: SalvarRegraFidelidadeUseCase;
  arquivarRegra: ArquivarRegraFidelidadeUseCase;
}

const STATUS_CLASSES: Record<RegraFidelidadeStatus, string> = {
  ativa: 'active-green',
  inativa: 'active-muted',
  arquivada: 'active-danger',
};

export class FidelizacaoConfigView {
  private root: HTMLElement | null = null;
  private regraId: string | null = null;
  private status: RegraFidelidadeStatus = 'ativa';
  private premios: PremioFidelidade[] = [];

  constructor(private readonly module: FidelizacaoConfigModule) {}

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    this.regraId = null;
    this.status = 'ativa';
    this.premios = [];
    root.innerHTML = FIDELIZACAO_CONFIG_TEMPLATE;
    this.bindAll();
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    const regra = await this.module.obterRegra.execute();
    if (regra) {
      this.regraId = regra.id;
      this.status = regra.status;
      this.premios = structuredClone(regra.premios);
      this.fillForm(regra);
    }
    this.updateStatus(this.status);
    this.renderPremios();
    this.get<HTMLButtonElement>('[data-arquivar]')!.hidden = !this.regraId;
  }

  private fillForm(r: RegraFidelidade): void {
    this.input('#fc-nome').value = r.nome;
    this.input('#fc-passos').value = String(r.totalPassos);
    this.input('#fc-inicio').value = r.periodoInicio;
    this.input('#fc-fim').value = r.periodoFim ?? '';
    this.input('#fc-item-nome').value = r.regraPassoItemNome || r.regraPassoItemId;
    this.input('#fc-qtd').value = String(r.regraPassoQuantidade);
    this.input('#fc-unidade').value = r.regraPassoUnidade;
    this.input('#fc-passos-gerados').value = String(r.regraPassoPassosGerados);
  }

  private updateStatus(s: RegraFidelidadeStatus): void {
    this.root!.querySelectorAll('[data-status]').forEach(btn => {
      const el = btn as HTMLElement;
      const isActive = el.dataset.status === s;
      el.classList.remove('active-green', 'active-muted', 'active-danger');
      if (isActive) el.classList.add(STATUS_CLASSES[s]);
    });
  }

  private renderPremios(): void {
    const list = this.root!.querySelector<HTMLElement>('#fc-premios-list')!;
    const tpl = this.root!.querySelector<HTMLTemplateElement>('#fc-premio-tpl')!;
    list.innerHTML = '';
    this.premios.forEach((p, i) => {
      const node = document.importNode(tpl.content, true);
      const card = node.querySelector<HTMLElement>('.prize-card')!;
      card.dataset.prize = String(i);
      node.querySelector<HTMLElement>('[data-prize-step]')!.textContent = `Passo ${p.passo}`;
      const removeBtn = node.querySelector<HTMLElement>('[data-remove-prize]')!;
      removeBtn.dataset.removePrize = String(i);
      const descInput = node.querySelector<HTMLInputElement>('[data-prize-desc]')!;
      descInput.value = p.descricao;
      descInput.dataset.prizeDesc = String(i);
      const itemInput = node.querySelector<HTMLInputElement>('[data-prize-item]')!;
      itemInput.value = p.itemNome || p.itemId;
      itemInput.dataset.prizeItem = String(i);
      const toggle = node.querySelector<HTMLElement>('[data-toggle-prize]')!;
      toggle.dataset.togglePrize = String(i);
      toggle.setAttribute('aria-checked', String(p.ativo));
      if (!p.ativo) toggle.classList.add('off');
      list.appendChild(node);
    });
    this.bindPrizeEvents();
  }

  private bindPrizeEvents(): void {
    const list = this.root!.querySelector<HTMLElement>('#fc-premios-list')!;
    list.querySelectorAll('[data-toggle-prize]').forEach(el => {
      el.addEventListener('click', () => {
        const i = Number((el as HTMLElement).dataset.togglePrize);
        this.syncPrizesFromDom();
        const prize = this.premios[i];
        if (prize) {
          prize.ativo = !prize.ativo;
          el.classList.toggle('off', !prize.ativo);
          el.setAttribute('aria-checked', String(prize.ativo));
        }
      });
    });
    list.querySelectorAll('[data-remove-prize]').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number((btn as HTMLElement).dataset.removePrize);
        this.syncPrizesFromDom();
        this.premios.splice(i, 1);
        this.renderPremios();
      });
    });
  }

  private bindAll(): void {
    if (!this.root) return;

    this.root.querySelectorAll('[data-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.status = (btn as HTMLElement).dataset.status as RegraFidelidadeStatus;
        this.updateStatus(this.status);
      });
    });

    this.root.querySelector('[data-open-sheet]')?.addEventListener('click', () => {
      const totalPassos = Number(this.input('#fc-passos').value) || 10;
      this.input('#fc-sheet-passo').max = String(totalPassos);
      this.input('#fc-sheet-passo').value = '';
      this.input('#fc-sheet-desc').value = '';
      this.input('#fc-sheet-item').value = '';
      const toggle = this.get<HTMLElement>('#fc-sheet-toggle')!;
      toggle.dataset.ativo = 'true';
      toggle.classList.remove('off');
      const hint = this.get<HTMLElement>('#fc-sheet-hint')!;
      hint.textContent = `1 ≤ passo ≤ ${totalPassos}`;
      this.setSheetOpen(true);
    });

    this.root.querySelectorAll('[data-close-sheet]').forEach(el => {
      el.addEventListener('click', () => this.setSheetOpen(false));
    });

    this.get<HTMLElement>('#fc-sheet-toggle')?.addEventListener('click', () => {
      const toggle = this.get<HTMLElement>('#fc-sheet-toggle')!;
      const current = toggle.dataset.ativo === 'true';
      toggle.dataset.ativo = String(!current);
      toggle.classList.toggle('off', current);
    });

    this.root.querySelector('[data-sheet-adicionar]')?.addEventListener('click', () => {
      const totalPassos = Number(this.input('#fc-passos').value) || 10;
      const passo = Number(this.input('#fc-sheet-passo').value);
      const desc  = this.input('#fc-sheet-desc').value.trim();
      const item  = this.input('#fc-sheet-item').value.trim();
      const ativo = this.get<HTMLElement>('#fc-sheet-toggle')?.dataset.ativo !== 'false';

      if (!passo || passo < 1 || passo > totalPassos) {
        this.showToast(`Passo deve estar entre 1 e ${totalPassos}.`, 'erro');
        return;
      }
      if (!desc) { this.showToast('Descrição é obrigatória.', 'erro'); return; }

      this.premios.push({ passo, descricao: desc, itemId: item, itemNome: item, ativo });
      this.setSheetOpen(false);
      this.renderPremios();
      this.hideToast();
    });

    this.root.querySelectorAll('[data-salvar]').forEach(btn => {
      btn.addEventListener('click', async () => {
        this.syncPrizesFromDom();
        this.hideToast();
        try {
          const saved = await this.module.salvarRegra.execute({
            ...(this.regraId ? { id: this.regraId } : {}),
            nome:                    this.input('#fc-nome').value,
            status:                  this.status,
            totalPassos:             Number(this.input('#fc-passos').value) || 0,
            periodoInicio:           this.input('#fc-inicio').value,
            ...(this.input('#fc-fim').value ? { periodoFim: this.input('#fc-fim').value } : {}),
            regraPassoItemId:        this.input('#fc-item-nome').value,
            regraPassoItemNome:      this.input('#fc-item-nome').value,
            regraPassoQuantidade:    Number(this.input('#fc-qtd').value) || 0,
            regraPassoUnidade:       this.input('#fc-unidade').value,
            regraPassoPassosGerados: Number(this.input('#fc-passos-gerados').value) || 0,
            premios:                 this.premios,
          });
          this.regraId = saved.id;
          this.get<HTMLButtonElement>('[data-arquivar]')!.hidden = false;
          this.showToast('Regra salva.', 'sucesso');
        } catch (err) {
          this.showToast(err instanceof Error ? err.message : 'Erro ao salvar.', 'erro');
        }
      });
    });

    this.root.querySelector('[data-arquivar]')?.addEventListener('click', async () => {
      if (!this.regraId) return;
      this.hideToast();
      try {
        await this.module.arquivarRegra.execute(this.regraId);
        this.regraId = null;
        this.status = 'ativa';
        this.premios = [];
        this.updateStatus('ativa');
        this.renderPremios();
        this.get<HTMLButtonElement>('[data-arquivar]')!.hidden = true;
        this.showToast('Regra arquivada.', 'sucesso');
      } catch (err) {
        this.showToast(err instanceof Error ? err.message : 'Erro ao arquivar.', 'erro');
      }
    });
  }

  private setSheetOpen(open: boolean): void {
    const overlay = this.root!.querySelector<HTMLElement>('.overlay')!;
    const sheet   = this.root!.querySelector<HTMLElement>('#fc-sheet')!;
    const screen  = this.root!.querySelector<HTMLElement>('.screen')!;
    overlay.hidden = !open;
    sheet.hidden   = !open;
    screen.classList.toggle('bg-content', open);
  }

  private showToast(msg: string, tipo: 'sucesso' | 'erro'): void {
    const toast = this.get<HTMLElement>('#fc-toast')!;
    toast.textContent = msg;
    toast.className = `toast toast-${tipo === 'sucesso' ? 'success' : 'error'}`;
    toast.hidden = false;
  }

  private hideToast(): void {
    const toast = this.get<HTMLElement>('#fc-toast');
    if (toast) toast.hidden = true;
  }

  private syncPrizesFromDom(): void {
    this.root!.querySelectorAll<HTMLElement>('[data-prize]').forEach(card => {
      const i = Number(card.dataset.prize);
      const prize = this.premios[i];
      if (!prize) return;
      prize.descricao = (card.querySelector<HTMLInputElement>(`[data-prize-desc]`)?.value ?? '');
      const item = card.querySelector<HTMLInputElement>(`[data-prize-item]`)?.value ?? '';
      prize.itemId   = item;
      prize.itemNome = item;
    });
  }

  private input(selector: string): HTMLInputElement {
    return this.root!.querySelector<HTMLInputElement>(selector)!;
  }

  private get<T extends HTMLElement>(selector: string): T | null {
    return this.root!.querySelector<T>(selector);
  }
}
