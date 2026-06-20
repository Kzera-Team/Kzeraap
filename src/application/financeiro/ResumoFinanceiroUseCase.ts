import type { Repository } from '../ports/Repository';
import { arredondarDinheiro, type MovimentoFinanceiro, type PagamentoTransacao, type TransacaoFinanceira } from '../../domain/financeiro/Financeiro';

export interface ResumoFinanceiroFiltros {
  dataInicio?: string;
  dataFim?: string;
  perfil?: string;
  metodo?: string;
  origem?: string;
  statusFinanceiro?: 'pago' | 'parcial' | 'pendente' | 'cancelado' | 'todos';
}

export interface ResumoFinanceiroGeral {
  totalTransacoes: number;
  faturamento: number;
  valorPago: number;
  valorPendente: number;
  custo: number;
  lucro: number;
  movimentosConfirmados: number;
  movimentosPendentes: number;
  filtrosAplicados: ResumoFinanceiroFiltros;
}

function normalizar(texto?: string): string {
  return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

function dataOrdenavel(valor?: string): string {
  const raw = String(valor || '').trim();
  const pt = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (pt) return `${pt[3]!}-${pt[2]!.padStart(2, '0')}-${pt[1]!.padStart(2, '0')}`;
  return raw.slice(0, 10);
}

export class ResumoFinanceiroUseCase {
  constructor(
    private readonly transacoes: Repository<TransacaoFinanceira>,
    private readonly movimentos: Repository<MovimentoFinanceiro>,
    private readonly pagamentos?: Repository<PagamentoTransacao>
  ) {}

  async execute(filtros: ResumoFinanceiroFiltros = {}): Promise<ResumoFinanceiroGeral> {
    const transacoes = await this.transacoes.list();
    const movimentos = await this.movimentos.list();
    const pagamentos = this.pagamentos ? await this.pagamentos.list() : [];
    const perfilBusca = normalizar(filtros.perfil);
    const metodoBusca = normalizar(filtros.metodo);
    const pagamentosPorTransacao = new Map<string, PagamentoTransacao[]>();
    pagamentos.forEach(pagamento => {
      const atuais = pagamentosPorTransacao.get(pagamento.transacaoId) || [];
      atuais.push(pagamento);
      pagamentosPorTransacao.set(pagamento.transacaoId, atuais);
    });
    const movimentosPorTransacao = new Map<string, MovimentoFinanceiro[]>();
    movimentos.forEach(movimento => {
      if (!movimento.transacaoId) return;
      const atuais = movimentosPorTransacao.get(movimento.transacaoId) || [];
      atuais.push(movimento);
      movimentosPorTransacao.set(movimento.transacaoId, atuais);
    });
    const filtradas = transacoes.filter(transacao => {
      const data = dataOrdenavel(transacao.dataTransacao);
      if (filtros.dataInicio && data && data < filtros.dataInicio) return false;
      if (filtros.dataFim && data && data > filtros.dataFim) return false;
      if (perfilBusca && !normalizar(transacao.clienteNome).includes(perfilBusca) && !normalizar(transacao.perfilId).includes(perfilBusca)) return false;
      if (filtros.origem && filtros.origem !== 'todas' && transacao.origem !== filtros.origem) return false;
      if (filtros.statusFinanceiro && filtros.statusFinanceiro !== 'todos' && transacao.statusFinanceiro !== filtros.statusFinanceiro) return false;
      if (metodoBusca) {
        const pagamentosDaTransacao = pagamentosPorTransacao.get(transacao.id) || [];
        const movimentosDaTransacao = movimentosPorTransacao.get(transacao.id) || [];
        const textoPagamentos = normalizar(pagamentosDaTransacao.map(item => `${item.tipo} ${item.observacao || ''}`).join(' '));
        const textoMovimentos = normalizar(movimentosDaTransacao.map(item => `${item.referenciaExterna || ''} ${item.observacao || ''}`).join(' '));
        if (!textoPagamentos.includes(metodoBusca) && !textoMovimentos.includes(metodoBusca)) return false;
      }
      return true;
    });
    const idsFiltrados = new Set(filtradas.map(transacao => transacao.id));
    const movimentosFiltrados = movimentos.filter(movimento => movimento.transacaoId ? idsFiltrados.has(movimento.transacaoId) : false);
    return {
      totalTransacoes: filtradas.length,
      faturamento: arredondarDinheiro(filtradas.reduce((total, transacao) => total + transacao.total, 0)),
      valorPago: arredondarDinheiro(filtradas.reduce((total, transacao) => total + transacao.valorPago, 0)),
      valorPendente: arredondarDinheiro(filtradas.reduce((total, transacao) => total + transacao.valorPendente, 0)),
      custo: arredondarDinheiro(filtradas.reduce((total, transacao) => total + transacao.custo, 0)),
      lucro: arredondarDinheiro(filtradas.reduce((total, transacao) => total + transacao.lucro, 0)),
      movimentosConfirmados: movimentosFiltrados.filter(movimento => movimento.status === 'confirmado' || movimento.status === 'conciliado').length,
      movimentosPendentes: movimentosFiltrados.filter(movimento => movimento.status === 'previsto').length,
      filtrosAplicados: filtros
    };
  }
}
