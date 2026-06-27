import type { ResumoFinanceiroUseCase } from '../../application/financeiro/ResumoFinanceiroUseCase';
import type { GerarRelatorioOperacionalUseCase } from '../../application/relatorio/GerarRelatorioOperacionalUseCase';
import { RelatoriosOperacionaisScreenController } from './RelatoriosOperacionaisScreenController';
import { TransacoesFinanceirasScreenController } from './TransacoesFinanceirasScreenController';

interface FinanceiroScreensControllerParams {
  resumoFinanceiro: ResumoFinanceiroUseCase;
  relatorioOperacional: GerarRelatorioOperacionalUseCase;
  requestRender: () => Promise<void>;
}

export class FinanceiroScreensController {
  private readonly transacoes: TransacoesFinanceirasScreenController;
  private readonly relatorios: RelatoriosOperacionaisScreenController;

  constructor(params: FinanceiroScreensControllerParams) {
    this.transacoes = new TransacoesFinanceirasScreenController({
      resumoFinanceiro: params.resumoFinanceiro,
      requestRender: params.requestRender
    });
    this.relatorios = new RelatoriosOperacionaisScreenController({
      relatorioOperacional: params.relatorioOperacional,
      requestRender: params.requestRender
    });
  }

  renderTransacoes(): Promise<string> {
    return this.transacoes.render();
  }

  bindTransacoesFilters(root: HTMLElement): void {
    this.transacoes.bind(root);
  }

  renderRelatorios(): Promise<string> {
    return this.relatorios.render();
  }

  bindRelatoriosFilters(root: HTMLElement): void {
    this.relatorios.bind(root);
  }
}
