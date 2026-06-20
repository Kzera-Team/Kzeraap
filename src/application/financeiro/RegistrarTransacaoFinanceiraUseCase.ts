import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import {
  criarMovimentoFinanceiro,
  criarPagamentoTransacao,
  criarTransacaoFinanceira,
  type CriarPagamentoTransacaoInput,
  type CriarTransacaoFinanceiraInput,
  type MovimentoFinanceiro,
  type PagamentoTransacao,
  type TransacaoFinanceira
} from '../../domain/financeiro/Financeiro';

export interface RegistrarTransacaoFinanceiraResultado {
  transacao: TransacaoFinanceira;
  pagamentos: PagamentoTransacao[];
  movimentos: MovimentoFinanceiro[];
}

export interface RegistrarTransacaoFinanceiraInput extends CriarTransacaoFinanceiraInput {
  pagamentos?: Omit<CriarPagamentoTransacaoInput, 'transacaoId' | 'clienteNome'>[];
}

export class RegistrarTransacaoFinanceiraUseCase {
  constructor(
    private readonly transacoes: Repository<TransacaoFinanceira>,
    private readonly pagamentos: Repository<PagamentoTransacao>,
    private readonly movimentos: Repository<MovimentoFinanceiro>,
    private readonly clock: Clock,
    private readonly idFactory: (prefix: string) => string
  ) {}

  async execute(input: RegistrarTransacaoFinanceiraInput): Promise<RegistrarTransacaoFinanceiraResultado> {
    const now = this.clock.now().toISOString();
    const transacao = await this.transacoes.save(criarTransacaoFinanceira(input, this.idFactory('transacao-fin'), now));
    const pagamentosCriados: PagamentoTransacao[] = [];
    const movimentosCriados: MovimentoFinanceiro[] = [];

    for (const pagamentoInput of input.pagamentos || []) {
      const pagamento = await this.pagamentos.save(criarPagamentoTransacao({
        ...pagamentoInput,
        transacaoId: transacao.id,
        clienteNome: transacao.clienteNome,
        origem: pagamentoInput.origem || (input.origem === 'importado_csv' ? 'importado_csv' : 'manual')
      }, this.idFactory('pagamento'), now));
      pagamentosCriados.push(pagamento);

      if (pagamento.valor > 0 && pagamento.tipo !== 'pendente') {
        const movimentoInput = {
          transacaoId: transacao.id,
          pagamentoId: pagamento.id,
          clienteNome: transacao.clienteNome,
          tipo: 'entrada' as const,
          valor: pagamento.valor,
          moeda: pagamento.moeda,
          dataHora: pagamento.dataHora || now,
          status: pagamento.status === 'pago' ? 'confirmado' as const : 'previsto' as const,
          origem: pagamento.origem,
          origensRastreaveis: [{ transacaoId: transacao.id, pagamentoId: pagamento.id, clienteNome: transacao.clienteNome, valorOriginal: pagamento.valor, moedaOriginal: pagamento.moeda }]
        };
        if (pagamento.contaFinanceiraId) Object.assign(movimentoInput, { contaFinanceiraId: pagamento.contaFinanceiraId });
        if (pagamento.observacao) Object.assign(movimentoInput, { observacao: pagamento.observacao });
        const movimento = await this.movimentos.save(criarMovimentoFinanceiro(movimentoInput, this.idFactory('mov-fin'), now));
        movimentosCriados.push(movimento);
      }
    }

    return { transacao, pagamentos: pagamentosCriados, movimentos: movimentosCriados };
  }
}
