import type { ResumoFinanceiroFiltros, ResumoFinanceiroUseCase } from '../../application/financeiro/ResumoFinanceiroUseCase';
import { escapeHtml } from '../../presentation/shared/ui/Html';
import type { FiltrosFinanceiros } from './FinanceiroFiltros';
import { EMPTY_FINANCEIRO_FILTERS } from './FinanceiroFiltros';
import { dinheiro, fill, selected, toast } from './FinanceiroUiHelpers';
import transacoesTemplate from './transacoes-screen.html?raw';

interface TransacoesFinanceirasScreenControllerParams {
  resumoFinanceiro: ResumoFinanceiroUseCase;
  requestRender: () => Promise<void>;
}

export class TransacoesFinanceirasScreenController {
  private filtros: FiltrosFinanceiros = { ...EMPTY_FINANCEIRO_FILTERS };
  private mensagem = '';

  constructor(private readonly params: TransacoesFinanceirasScreenControllerParams) {}

  async render(): Promise<string> {
    const resumo = await this.params.resumoFinanceiro.execute(this.toResumoFiltros());

    return fill(transacoesTemplate, {
      mensagem: this.mensagem ? toast(this.mensagem) : '',
      dataInicio: escapeHtml(this.filtros.dataInicio),
      dataFim: escapeHtml(this.filtros.dataFim),
      perfil: escapeHtml(this.filtros.perfil),
      metodo: escapeHtml(this.filtros.metodo),
      origemTodasSelected: selected(this.filtros.origem, 'todas'),
      origemImportadoSelected: selected(this.filtros.origem, 'importado_csv'),
      origemManualSelected: selected(this.filtros.origem, 'manual'),
      statusTodosSelected: selected(this.filtros.statusFinanceiro, 'todos'),
      statusPagoSelected: selected(this.filtros.statusFinanceiro, 'pago'),
      statusParcialSelected: selected(this.filtros.statusFinanceiro, 'parcial'),
      statusPendenteSelected: selected(this.filtros.statusFinanceiro, 'pendente'),
      totalTransacoes: String(resumo.totalTransacoes),
      faturamento: dinheiro(resumo.faturamento),
      valorPago: dinheiro(resumo.valorPago),
      valorPendente: dinheiro(resumo.valorPendente),
      custo: dinheiro(resumo.custo),
      lucro: dinheiro(resumo.lucro),
      movimentosConfirmados: String(resumo.movimentosConfirmados),
      movimentosPendentes: String(resumo.movimentosPendentes)
    });
  }

  bind(root: HTMLElement): void {
    const form = root.querySelector<HTMLFormElement>('[data-filtros-financeiros]');
    form?.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(form);
      this.filtros = {
        dataInicio: String(data.get('dataInicio') || ''),
        dataFim: String(data.get('dataFim') || ''),
        perfil: String(data.get('perfil') || ''),
        metodo: String(data.get('metodo') || ''),
        origem: String(data.get('origem') || 'todas'),
        statusFinanceiro: (String(data.get('statusFinanceiro') || 'todos') as FiltrosFinanceiros['statusFinanceiro'])
      };
      this.mensagem = 'Filtros aplicados.';
      await this.params.requestRender();
    });

    root.querySelector('[data-limpar-filtros-financeiros]')?.addEventListener('click', async () => {
      this.filtros = { ...EMPTY_FINANCEIRO_FILTERS };
      this.mensagem = 'Filtros limpos.';
      await this.params.requestRender();
    });
  }

  private toResumoFiltros(): ResumoFinanceiroFiltros {
    const filtrosResumo: ResumoFinanceiroFiltros = { statusFinanceiro: this.filtros.statusFinanceiro };
    if (this.filtros.dataInicio) filtrosResumo.dataInicio = this.filtros.dataInicio;
    if (this.filtros.dataFim) filtrosResumo.dataFim = this.filtros.dataFim;
    if (this.filtros.perfil) filtrosResumo.perfil = this.filtros.perfil;
    if (this.filtros.metodo) filtrosResumo.metodo = this.filtros.metodo;
    if (this.filtros.origem) filtrosResumo.origem = this.filtros.origem;
    return filtrosResumo;
  }
}
