import './styles/fidelizacao-dashboard.css';
import { FIDELIZACAO_DASHBOARD_TEMPLATE } from './templates/FidelizacaoDashboardTemplate';
import type { ObterDashboardFidelidadeUseCase } from '../../application/fidelidade/ObterDashboardFidelidadeUseCase';

export interface FidelizacaoDashboardModule {
  obterDashboard: ObterDashboardFidelidadeUseCase;
}

type Opcao = 'semCartao' | 'todos';

export class FidelizacaoDashboardView {
  private root: HTMLElement | null = null;
  private opcao: Opcao = 'semCartao';
  private semCartao = 0;
  private comCartao = 0;

  constructor(private readonly module: FidelizacaoDashboardModule) {}

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    this.opcao = 'semCartao';
    root.innerHTML = FIDELIZACAO_DASHBOARD_TEMPLATE;
    this.bindAll();
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    const resultado = await this.module.obterDashboard.execute();
    this.comCartao = resultado.comCartao;
    this.semCartao = resultado.semCartao;
    this.root!.querySelector<HTMLElement>('#fd-com-cartao')!.textContent = String(this.comCartao);
    this.root!.querySelector<HTMLElement>('#fd-sem-cartao')!.textContent = String(this.semCartao);
    this.updateSubLabels();
  }

  private updateSubLabels(): void {
    const total = this.comCartao + this.semCartao;
    const elSem  = this.root!.querySelector<HTMLElement>('#fd-sublabel-sem')!;
    const elTodos = this.root!.querySelector<HTMLElement>('#fd-sublabel-todos')!;
    elSem.textContent  = `${this.semCartao} clientes`;
    elTodos.textContent = `${total} clientes · substitui cartões existentes`;
  }

  private setOpcao(opcao: Opcao): void {
    this.opcao = opcao;
    this.root!.querySelectorAll('[data-opcao]').forEach(btn => {
      const isSelected = (btn as HTMLElement).dataset.opcao === opcao;
      btn.classList.toggle('selected', isSelected);
    });
  }

  private setSheetOpen(open: boolean): void {
    const overlay = this.root!.querySelector<HTMLElement>('.overlay')!;
    const sheet   = this.root!.querySelector<HTMLElement>('#fd-sheet')!;
    overlay.hidden = !open;
    sheet.hidden   = !open;
  }

  private showToast(msg: string): void {
    const toast = this.root!.querySelector<HTMLElement>('#fd-toast')!;
    toast.textContent = msg;
    toast.className = 'toast toast-success';
    toast.hidden = false;
  }

  private bindAll(): void {
    if (!this.root) return;

    this.root.querySelector('[data-abrir-sheet]')?.addEventListener('click', () => {
      this.updateSubLabels();
      this.setOpcao('semCartao');
      this.setSheetOpen(true);
    });

    this.root.querySelectorAll('[data-close-sheet]').forEach(el => {
      el.addEventListener('click', () => this.setSheetOpen(false));
    });

    this.root.querySelectorAll('[data-opcao]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setOpcao((btn as HTMLElement).dataset.opcao as Opcao);
      });
    });

    this.root.querySelector('[data-regerar]')?.addEventListener('click', () => {
      this.setSheetOpen(false);
      this.showToast('Funcionalidade disponível em breve.');
    });
  }
}
