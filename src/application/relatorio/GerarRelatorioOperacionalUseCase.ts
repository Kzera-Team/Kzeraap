import type { Repository } from '../ports/Repository';
import { arredondarDinheiro, type OrigemTransacaoFinanceira, type StatusFinanceiroTransacao, type TransacaoFinanceira } from '../../domain/financeiro/Financeiro';
import type { ItemCatalogo, ItemLote } from '../../domain/item/ItemCatalogo';
import type { Perfil } from '../../domain/perfil/Perfil';
import type { RelatorioFiltroOperacional, RelatorioOperacional, RelatorioOrigemLinha, RelatorioStatusFinanceiroLinha } from '../../domain/relatorio/RelatorioOperacional';

function dataOrdenavel(valor?: string): string {
  const raw = String(valor || '').trim();
  const pt = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (pt) return `${pt[3]!}-${pt[2]!.padStart(2, '0')}-${pt[1]!.padStart(2, '0')}`;
  return raw.slice(0, 10);
}

function filtrarTransacoes(transacoes: TransacaoFinanceira[], filtros: RelatorioFiltroOperacional): TransacaoFinanceira[] {
  return transacoes.filter(transacao => {
    const data = dataOrdenavel(transacao.dataTransacao);
    if (filtros.dataInicio && data && data < filtros.dataInicio) return false;
    if (filtros.dataFim && data && data > filtros.dataFim) return false;
    if (filtros.statusFinanceiro && filtros.statusFinanceiro !== 'todos' && transacao.statusFinanceiro !== filtros.statusFinanceiro) return false;
    if (filtros.origem && filtros.origem !== 'todas' && transacao.origem !== filtros.origem) return false;
    return true;
  });
}

function totalizar(transacoes: TransacaoFinanceira[]): number {
  return arredondarDinheiro(transacoes.reduce((total, transacao) => total + transacao.total, 0));
}

function resumirPorStatus(transacoes: TransacaoFinanceira[]): RelatorioStatusFinanceiroLinha[] {
  const statusList: StatusFinanceiroTransacao[] = ['pago', 'parcial', 'pendente', 'cancelado'];
  return statusList.map(status => {
    const items = transacoes.filter(transacao => transacao.statusFinanceiro === status);
    return { status, quantidade: items.length, total: totalizar(items) };
  });
}

function resumirPorOrigem(transacoes: TransacaoFinanceira[]): RelatorioOrigemLinha[] {
  const origemList: OrigemTransacaoFinanceira[] = ['importado_csv', 'manual', 'sistema_antigo', 'conciliacao'];
  return origemList.map(origem => {
    const items = transacoes.filter(transacao => transacao.origem === origem);
    return { origem, quantidade: items.length, total: totalizar(items) };
  });
}

function loteTemEstoque(lote: ItemLote): boolean {
  const guardado = Number(lote.quantidadeGuardada || 0);
  const fracionado = lote.fracionamentos
    .filter(fracionamento => fracionamento.status === 'ativo')
    .reduce((total, fracionamento) => total + Number(fracionamento.quantidadeUnidadesDisponiveis || 0), 0);
  return lote.status === 'ativo' && (guardado > 0 || fracionado > 0);
}

export class GerarRelatorioOperacionalUseCase {
  constructor(
    private readonly perfis: Repository<Perfil>,
    private readonly itens: Repository<ItemCatalogo>,
    private readonly transacoes: Repository<TransacaoFinanceira>
  ) {}

  async execute(filtros: RelatorioFiltroOperacional = {}): Promise<RelatorioOperacional> {
    const [perfis, itens, transacoes] = await Promise.all([
      this.perfis.list(),
      this.itens.list(),
      this.transacoes.list()
    ]);
    const transacoesFiltradas = filtrarTransacoes(transacoes, filtros);
    const faturamento = totalizar(transacoesFiltradas);
    const valorPago = arredondarDinheiro(transacoesFiltradas.reduce((total, transacao) => total + transacao.valorPago, 0));
    const valorPendente = arredondarDinheiro(transacoesFiltradas.reduce((total, transacao) => total + transacao.valorPendente, 0));
    const custo = arredondarDinheiro(transacoesFiltradas.reduce((total, transacao) => total + transacao.custo, 0));
    const lucro = arredondarDinheiro(transacoesFiltradas.reduce((total, transacao) => total + transacao.lucro, 0));
    const variacoes = itens.flatMap(item => item.variacoes || []);
    const lotes = variacoes.flatMap(variacao => variacao.lotes || []);
    const itensAtivos = itens.filter(item => item.status === 'ativo');
    const itensComEstoque = itensAtivos.filter(item => item.variacoes.some(variacao => variacao.status === 'ativo' && variacao.lotes.some(loteTemEstoque))).length;
    const avisos: string[] = [];
    if (!transacoesFiltradas.length) avisos.push('Não há registros de dinheiro para os filtros escolhidos.');
    if (!itensAtivos.length) avisos.push('Nenhum item ativo encontrado.');
    if (itensAtivos.length && itensComEstoque < itensAtivos.length) avisos.push('Existem itens ativos sem estoque disponível registrado.');
    return {
      filtros,
      financeiro: {
        totalTransacoes: transacoesFiltradas.length,
        faturamento,
        valorPago,
        valorPendente,
        custo,
        lucro,
        ticketMedio: transacoesFiltradas.length ? arredondarDinheiro(faturamento / transacoesFiltradas.length) : 0
      },
      statusFinanceiro: resumirPorStatus(transacoesFiltradas),
      origem: resumirPorOrigem(transacoesFiltradas),
      cadastros: {
        perfisAtivos: perfis.filter(perfil => perfil.status === 'ativo').length,
        perfisArquivados: perfis.filter(perfil => perfil.status === 'arquivado').length,
        itensAtivos: itensAtivos.length,
        itensArquivados: itens.filter(item => item.status === 'arquivado').length
      },
      estoque: {
        itensComEstoque,
        itensSemEstoque: Math.max(0, itensAtivos.length - itensComEstoque),
        variacoesAtivas: variacoes.filter(variacao => variacao.status === 'ativo').length,
        lotesAtivos: lotes.filter(lote => lote.status === 'ativo').length,
        lotesConferenciaPendente: lotes.filter(lote => lote.status === 'conferencia_pendente').length,
        lotesDivergentes: lotes.filter(lote => lote.status === 'divergente').length
      },
      avisos
    };
  }
}
