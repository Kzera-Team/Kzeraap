export interface RelatorioPeriodo {
  dataInicio?: string;
  dataFim?: string;
}

export interface RelatorioFiltroOperacional extends RelatorioPeriodo {
  statusFinanceiro?: 'todos' | 'pago' | 'parcial' | 'pendente' | 'cancelado';
  origem?: 'todas' | 'importado_csv' | 'manual' | 'sistema_antigo' | 'conciliacao';
}

export interface RelatorioIndicadorFinanceiro {
  totalTransacoes: number;
  faturamento: number;
  valorPago: number;
  valorPendente: number;
  custo: number;
  lucro: number;
  ticketMedio: number;
}

export interface RelatorioStatusFinanceiroLinha {
  status: 'pago' | 'parcial' | 'pendente' | 'cancelado';
  quantidade: number;
  total: number;
}

export interface RelatorioOrigemLinha {
  origem: 'importado_csv' | 'manual' | 'sistema_antigo' | 'conciliacao';
  quantidade: number;
  total: number;
}

export interface RelatorioCadastrosResumo {
  perfisAtivos: number;
  perfisArquivados: number;
  itensAtivos: number;
  itensArquivados: number;
}

export interface RelatorioEstoqueResumo {
  itensComEstoque: number;
  itensSemEstoque: number;
  variacoesAtivas: number;
  lotesAtivos: number;
  lotesConferenciaPendente: number;
  lotesDivergentes: number;
}

export interface RelatorioOperacional {
  filtros: RelatorioFiltroOperacional;
  financeiro: RelatorioIndicadorFinanceiro;
  statusFinanceiro: RelatorioStatusFinanceiroLinha[];
  origem: RelatorioOrigemLinha[];
  cadastros: RelatorioCadastrosResumo;
  estoque: RelatorioEstoqueResumo;
  avisos: string[];
}
