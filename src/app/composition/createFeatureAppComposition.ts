import { createPerfilUiApp } from '../createPerfilUiApp';
import { createItemCatalogoUiApp } from '../createItemCatalogoUiApp';
import { ResumoFinanceiroUseCase } from '../../application/financeiro/ResumoFinanceiroUseCase';
import { GerarRelatorioOperacionalUseCase } from '../../application/relatorio/GerarRelatorioOperacionalUseCase';
import { ListarBalancasUseCase } from '../../application/operacao/ListarBalancasUseCase';
import { CriarBalancaUseCase } from '../../application/operacao/CriarBalancaUseCase';
import { AlterarStatusBalancaUseCase } from '../../application/operacao/AlterarStatusBalancaUseCase';
import { DefinirBalancaPadraoUseCase } from '../../application/operacao/DefinirBalancaPadraoUseCase';
import { RegistrarCalibragemBalancaUseCase } from '../../application/operacao/RegistrarCalibragemBalancaUseCase';
import { ConfiguracoesOperacionaisView } from '../../presentation/configuracoes/ConfiguracoesOperacionaisView';
import type { createRepositoryComposition } from './createRepositoryComposition';
import type { appClock } from './AppCompositionIds';
import { nextBalancaId, nextCalibragemId, nextItemId, nextPerfilId } from './AppCompositionIds';
import { ReprocessarPendenciasItemNomeUseCase } from '../../application/importacao/ReprocessarPendenciasItemNomeUseCase';
import type { CodigoPerfilRuleService } from '../codigoPerfil/CodigoPerfilRuleService';
import type { UxDomTracker } from '../../presentation/shared/uxTracking/UxDomTracker';

type Repositories = ReturnType<typeof createRepositoryComposition>;

export interface FeatureAppCompositionDependencies {
  repositories: Repositories;
  clock: typeof appClock;
  codigoPerfilRules: CodigoPerfilRuleService;
  uxTracker: UxDomTracker;
}

export function createFeatureAppComposition(dependencies: FeatureAppCompositionDependencies) {
  const { repositories, clock, codigoPerfilRules, uxTracker } = dependencies;

  const resumoFinanceiro = new ResumoFinanceiroUseCase(
    repositories.transacoesFinanceiras,
    repositories.movimentosFinanceiros,
    repositories.pagamentosTransacao
  );

  const relatorioOperacional = new GerarRelatorioOperacionalUseCase(
    repositories.perfis,
    repositories.itens,
    repositories.transacoesFinanceiras
  );

  const perfilApp = createPerfilUiApp(
    repositories.perfis,
    clock,
    nextPerfilId,
    () => codigoPerfilRules.getCachedRule(),
    repositories.importacaoRascunho
  );

  const reprocessarPendenciasItem = new ReprocessarPendenciasItemNomeUseCase(
    repositories.registrosImportacaoTransacoes,
    () => clock.now().toISOString()
  );

  const itemApp = createItemCatalogoUiApp(
    repositories.itens,
    repositories.balancas,
    clock,
    nextItemId,
    repositories.importacaoRascunho,
    reprocessarPendenciasItem
  );

  const configuracoesApp = new ConfiguracoesOperacionaisView({
    listarBalancas: new ListarBalancasUseCase(repositories.balancas),
    criarBalanca: new CriarBalancaUseCase(repositories.balancas, clock, nextBalancaId),
    alterarStatusBalanca: new AlterarStatusBalancaUseCase(repositories.balancas, clock),
    definirBalancaPadrao: new DefinirBalancaPadraoUseCase(repositories.balancas, clock),
    registrarCalibragemBalanca: new RegistrarCalibragemBalancaUseCase(repositories.balancas, clock, nextCalibragemId),
    limparMetricasUso: () => uxTracker.limparMetricas()
  });

  return {
    resumoFinanceiro,
    relatorioOperacional,
    perfilApp,
    itemApp,
    configuracoesApp
  };
}
