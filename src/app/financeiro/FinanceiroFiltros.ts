import type { RelatorioFiltroOperacional } from '../../domain/relatorio/RelatorioOperacional';

export type FiltrosFinanceiros = {
  dataInicio: string;
  dataFim: string;
  perfil: string;
  metodo: string;
  origem: string;
  statusFinanceiro: 'todos' | 'pago' | 'parcial' | 'pendente' | 'cancelado';
};

export const EMPTY_FINANCEIRO_FILTERS: FiltrosFinanceiros = {
  dataInicio: '',
  dataFim: '',
  perfil: '',
  metodo: '',
  origem: 'todas',
  statusFinanceiro: 'todos'
};

export const EMPTY_RELATORIO_FILTERS: RelatorioFiltroOperacional = {
  dataInicio: '',
  dataFim: '',
  origem: 'todas',
  statusFinanceiro: 'todos'
};
