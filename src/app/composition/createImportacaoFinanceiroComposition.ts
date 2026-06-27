import { PrepararImportacaoTransacoesUseCase } from '../../application/importacao/PrepararImportacaoTransacoesUseCase';
import { PrepararImportacaoFinanceiraUseCase } from '../../application/importacao/PrepararImportacaoFinanceiraUseCase';
import { ListarStagingImportacaoUseCase } from '../../application/importacao/ListarStagingImportacaoUseCase';
import { ConciliarTransacoesFinanceiroUseCase } from '../../application/importacao/ConciliarTransacoesFinanceiroUseCase';
import { ResolverPendenciaImportacaoUseCase } from '../../application/importacao/ResolverPendenciaImportacaoUseCase';
import { ConfirmarImportacaoHistoricaFinanceiraUseCase } from '../../application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase';
import { ImportacaoTransacoesFinanceiroView } from '../../presentation/importacao/ImportacaoTransacoesFinanceiroView';
import type { createRepositoryComposition } from './createRepositoryComposition';
import type { appClock } from './AppCompositionIds';
import { nextId } from './AppCompositionIds';

type Repositories = ReturnType<typeof createRepositoryComposition>;

export function createImportacaoFinanceiroComposition(repositories: Repositories, clock: typeof appClock) {
  const importacaoTransacoesFinanceiroApp = new ImportacaoTransacoesFinanceiroView({
    prepararTransacoes: new PrepararImportacaoTransacoesUseCase(
      repositories.lotesImportacaoTransacoes,
      repositories.registrosImportacaoTransacoes,
      repositories.perfis,
      repositories.itens,
      clock,
      nextId
    ),
    prepararFinanceiro: new PrepararImportacaoFinanceiraUseCase(
      repositories.lotesImportacaoFinanceira,
      repositories.registrosImportacaoFinanceira,
      repositories.registrosImportacaoTransacoes,
      repositories.perfis,
      clock,
      nextId
    ),
    listarStaging: new ListarStagingImportacaoUseCase(
      repositories.lotesImportacaoTransacoes,
      repositories.registrosImportacaoTransacoes,
      repositories.lotesImportacaoFinanceira,
      repositories.registrosImportacaoFinanceira
    ),
    conciliar: new ConciliarTransacoesFinanceiroUseCase(
      repositories.registrosImportacaoTransacoes,
      repositories.registrosImportacaoFinanceira
    ),
    resolverPendencia: new ResolverPendenciaImportacaoUseCase(
      repositories.registrosImportacaoTransacoes,
      repositories.registrosImportacaoFinanceira,
      () => clock.now().toISOString()
    ),
    confirmarHistoricoFinanceiro: new ConfirmarImportacaoHistoricaFinanceiraUseCase(
      repositories.registrosImportacaoTransacoes,
      repositories.registrosImportacaoFinanceira,
      repositories.transacoesFinanceiras,
      repositories.pagamentosTransacao,
      repositories.movimentosFinanceiros,
      clock,
      nextId,
      repositories.pacotesConfirmacaoHistorica
    ),
    onRascunhoAtualizado: async acao => {
      if (acao === 'salvar') {
        try { await repositories.importacaoRascunho.salvar({ tipo: 'transacoes' }); } catch { /* best-effort */ }
        return;
      }

      try { await repositories.importacaoRascunho.descartar('transacoes'); } catch { /* best-effort */ }
    }
  });

  return { importacaoTransacoesFinanceiroApp };
}
