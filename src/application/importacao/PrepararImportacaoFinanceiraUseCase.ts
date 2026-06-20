import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { Perfil } from '../../domain/perfil/Perfil';
import {
  criarLoteImportacaoFinanceira,
  encontrarPerfilPorNome,
  normalizarMovimentoImportado,
  parseTabelaDelimitada,
  resumirRegistrosImportacao,
  statusRegistroPorPendencias,
  type LoteImportacaoFinanceira,
  type PendenciaImportacao,
  type RegistroImportacaoFinanceira,
  type RegistroImportacaoTransacao,
  type ResumoStagingImportacao
} from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

export interface PrepararImportacaoFinanceiraInput {
  nomeArquivo: string;
  conteudo: string;
}

export interface PrepararImportacaoFinanceiraResultado {
  lote: LoteImportacaoFinanceira;
  registros: RegistroImportacaoFinanceira[];
  resumo: ResumoStagingImportacao;
}

export class PrepararImportacaoFinanceiraUseCase {
  constructor(
    private readonly lotes: Repository<LoteImportacaoFinanceira>,
    private readonly registros: Repository<RegistroImportacaoFinanceira>,
    private readonly transacoesStaging: Repository<RegistroImportacaoTransacao>,
    private readonly perfis: Repository<Perfil>,
    private readonly clock: Clock,
    private readonly idFactory: (prefix: string) => string
  ) {}

  async execute(input: PrepararImportacaoFinanceiraInput): Promise<PrepararImportacaoFinanceiraResultado> {
    const parsed = parseTabelaDelimitada(input.conteudo);
    const now = this.clock.now().toISOString();
    const perfis = await this.perfis.list();
    const transacoes = await this.transacoesStaging.list();
    const lote = criarLoteImportacaoFinanceira(input.nomeArquivo || 'financeiro.csv', parsed.rows.length, this.idFactory('imp-fin'), now);
    const registros: RegistroImportacaoFinanceira[] = [];

    for (const [index, row] of parsed.rows.entries()) {
      const pendencias: PendenciaImportacao[] = [];
      try {
        const normalizados = normalizarMovimentoImportado(row);
        if (!normalizados.clienteNome) pendencias.push({ tipo: 'coluna_obrigatoria', campo: 'Perfil', mensagem: 'Nome do comprador é obrigatório na movimentação financeira.' });
        if (normalizados.valor <= 0) pendencias.push({ tipo: 'valor_invalido', campo: 'Valor', mensagem: 'Valor da movimentação precisa ser maior que zero.' });
        const perfil = normalizados.clienteNome ? encontrarPerfilPorNome(normalizados.clienteNome, perfis) : undefined;
        if (normalizados.clienteNome && !perfil) pendencias.push({ tipo: 'cliente_nao_encontrado', campo: 'Perfil', valor: normalizados.clienteNome, mensagem: `Perfil não encontrado para comprador: ${normalizados.clienteNome}` });
        if (normalizados.numeroTransacaoReferenciado) {
          const transacao = transacoes.find(registro => registro.numeroOriginal === normalizados.numeroTransacaoReferenciado);
          if (!transacao) pendencias.push({ tipo: 'transacao_nao_encontrada', campo: 'Descrição', valor: normalizados.numeroTransacaoReferenciado, mensagem: `Movimento referencia transacao #${normalizados.numeroTransacaoReferenciado}, mas ela ainda não está no staging.` });
        }
        const registro: RegistroImportacaoFinanceira = {
          id: this.idFactory('reg-fin'),
          loteImportacaoId: lote.id,
          linha: index + 2,
          dadosBrutos: row,
          dadosNormalizados: normalizados,
          clienteNomeImportado: normalizados.clienteNome,
          status: statusRegistroPorPendencias(pendencias),
          pendencias,
          createdAt: now,
          updatedAt: now
        };
        if (perfil?.id) registro.perfilIdResolvido = perfil.id;
        if (normalizados.numeroTransacaoReferenciado) registro.numeroTransacaoReferenciado = normalizados.numeroTransacaoReferenciado;
        registros.push(await this.registros.save(registro));
      } catch (error) {
        pendencias.push({ tipo: 'descricao_invalida', mensagem: error instanceof Error ? error.message : 'Erro ao interpretar movimentação financeira.' });
        registros.push(await this.registros.save({ id: this.idFactory('reg-fin'), loteImportacaoId: lote.id, linha: index + 2, dadosBrutos: row, status: 'erro', pendencias, createdAt: now, updatedAt: now }));
      }
    }

    const resumo = resumirRegistrosImportacao(registros);
    const loteFinal: LoteImportacaoFinanceira = { ...lote, totalValidas: resumo.validos, totalPendentes: resumo.pendentes + resumo.erros, status: resumo.pendentes || resumo.erros ? 'em_preparacao' : 'parcialmente_resolvido', updatedAt: now };
    await this.lotes.save(loteFinal);
    return { lote: loteFinal, registros, resumo };
  }
}
