import type { GerarRelatorioOperacionalUseCase } from '../../application/relatorio/GerarRelatorioOperacionalUseCase';
import type { RelatorioFiltroOperacional } from '../../domain/relatorio/RelatorioOperacional';
import { escapeHtml } from '../../presentation/shared/ui/Html';
import { EMPTY_RELATORIO_FILTERS } from './FinanceiroFiltros';
import { dinheiro, fill, selected, toast } from './FinanceiroUiHelpers';
import { origemRelatorioLabel, statusRelatorioLabel } from './RelatorioLabelService';
import relatoriosTemplate from './relatorios-screen.html?raw';
import relatorioRowTemplate from './relatorio-row.html?raw';

interface RelatoriosOperacionaisScreenControllerParams {
  relatorioOperacional: GerarRelatorioOperacionalUseCase;
  requestRender: () => Promise<void>;
}

export class RelatoriosOperacionaisScreenController {
  private filtros: RelatorioFiltroOperacional = { ...EMPTY_RELATORIO_FILTERS };
  private mensagem = '';

  constructor(private readonly params: RelatoriosOperacionaisScreenControllerParams) {}

  async render(): Promise<string> {
    const relatorio = await this.params.relatorioOperacional.execute(this.filtros);
    const statusRows = relatorio.statusFinanceiro
      .map(linha => this.renderRow(statusRelatorioLabel(linha.status), linha.quantidade, linha.total))
      .join('');
    const origemRows = relatorio.origem
      .map(linha => this.renderRow(origemRelatorioLabel(linha.origem), linha.quantidade, linha.total))
      .join('');

    return fill(relatoriosTemplate, {
      mensagem: this.mensagem ? toast(this.mensagem) : '',
      avisos: relatorio.avisos.length ? toast(relatorio.avisos.join('\n')) : '',
      dataInicio: escapeHtml(this.filtros.dataInicio || ''),
      dataFim: escapeHtml(this.filtros.dataFim || ''),
      origemTodasSelected: selected(this.filtros.origem, 'todas'),
      origemImportadoSelected: selected(this.filtros.origem, 'importado_csv'),
      origemManualSelected: selected(this.filtros.origem, 'manual'),
      origemSistemaAntigoSelected: selected(this.filtros.origem, 'sistema_antigo'),
      origemConciliacaoSelected: selected(this.filtros.origem, 'conciliacao'),
      statusTodosSelected: selected(this.filtros.statusFinanceiro, 'todos'),
      statusPagoSelected: selected(this.filtros.statusFinanceiro, 'pago'),
      statusParcialSelected: selected(this.filtros.statusFinanceiro, 'parcial'),
      statusPendenteSelected: selected(this.filtros.statusFinanceiro, 'pendente'),
      statusCanceladoSelected: selected(this.filtros.statusFinanceiro, 'cancelado'),
      financeiroTotalTransacoes: String(relatorio.financeiro.totalTransacoes),
      financeiroFaturamento: dinheiro(relatorio.financeiro.faturamento),
      financeiroValorPago: dinheiro(relatorio.financeiro.valorPago),
      financeiroValorPendente: dinheiro(relatorio.financeiro.valorPendente),
      financeiroCusto: dinheiro(relatorio.financeiro.custo),
      financeiroLucro: dinheiro(relatorio.financeiro.lucro),
      financeiroTicketMedio: dinheiro(relatorio.financeiro.ticketMedio),
      perfisAtivos: String(relatorio.cadastros.perfisAtivos),
      perfisArquivados: String(relatorio.cadastros.perfisArquivados),
      itensAtivos: String(relatorio.cadastros.itensAtivos),
      itensArquivados: String(relatorio.cadastros.itensArquivados),
      itensComEstoque: String(relatorio.estoque.itensComEstoque),
      itensSemEstoque: String(relatorio.estoque.itensSemEstoque),
      variacoesAtivas: String(relatorio.estoque.variacoesAtivas),
      lotesAtivos: String(relatorio.estoque.lotesAtivos),
      statusRows,
      origemRows
    });
  }

  bind(root: HTMLElement): void {
    const form = root.querySelector<HTMLFormElement>('[data-filtros-relatorios]');
    form?.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(form);
      this.filtros = {
        dataInicio: String(data.get('dataInicio') || ''),
        dataFim: String(data.get('dataFim') || ''),
        origem: String(data.get('origem') || 'todas') as NonNullable<RelatorioFiltroOperacional['origem']>,
        statusFinanceiro: String(data.get('statusFinanceiro') || 'todos') as NonNullable<RelatorioFiltroOperacional['statusFinanceiro']>
      };
      this.mensagem = 'Relatórios atualizados.';
      await this.params.requestRender();
    });

    root.querySelector('[data-limpar-filtros-relatorios]')?.addEventListener('click', async () => {
      this.filtros = { ...EMPTY_RELATORIO_FILTERS };
      this.mensagem = 'Filtros limpos.';
      await this.params.requestRender();
    });
  }

  private renderRow(label: string, quantidade: number, total: number): string {
    return fill(relatorioRowTemplate, {
      label: escapeHtml(label),
      quantidade: String(quantidade),
      total: dinheiro(total)
    });
  }
}
