import { BuscarPerfisUseCase } from '../application/perfil/BuscarPerfisUseCase';
import { ExportarErrosImportacaoPerfilUseCase } from '../application/perfil/ExportarErrosImportacaoPerfilUseCase';
import { IgnorarDuplicidadePerfilUseCase } from '../application/perfil/IgnorarDuplicidadePerfilUseCase';
import { ListarHistoricoPerfilUseCase } from '../application/perfil/ListarHistoricoPerfilUseCase';
import { RegistrarHistoricoPerfilUseCase } from '../application/perfil/RegistrarHistoricoPerfilUseCase';
import type { PerfilDuplicidadeResolucao } from '../domain/perfil/PerfilDuplicidadeResolucao';
import type { PerfilHistoricoEvento } from '../domain/perfil/PerfilHistorico';
import { InMemoryRepository } from '../infrastructure/repositories/InMemoryRepository';
import type { IdentityRule } from '../domain/identidade/IdentityRule';
import { PreviewIdentityRuleUseCase } from '../application/identidade/PreviewIdentityRuleUseCase';
import { SalvarIdentityRuleUseCase } from '../application/identidade/SalvarIdentityRuleUseCase';
import { MesclarPerfisUseCase } from '../application/perfil/MesclarPerfisUseCase';
import { ExportarPerfisUseCase } from '../application/perfil/ExportarPerfisUseCase';
import { SelecionarPerfilUseCase } from '../application/perfil/SelecionarPerfilUseCase';
import { PerfilPendenciasDashboardUseCase } from '../application/perfil/PerfilPendenciasDashboardUseCase';
import type { Repository } from '../application/ports/Repository';
import type { Clock } from '../core/Clock';
import type { Perfil } from '../domain/perfil/Perfil';
import { ListarPerfisUseCase } from '../application/perfil/ListarPerfisUseCase';
import { CriarPerfilUseCase } from '../application/perfil/CriarPerfilUseCase';
import { ArquivarPerfilUseCase } from '../application/perfil/ArquivarPerfilUseCase';
import { ReativarPerfilUseCase } from '../application/perfil/ReativarPerfilUseCase';
import { DefinirCodigoUseCase } from '../application/perfil/DefinirCodigoUseCase';
import { ListarPendenciasPerfilUseCase } from '../application/perfil/ListarPendenciasPerfilUseCase';
import { ImportarPerfisSemBairroUseCase } from '../application/perfil/ImportarPerfisSemBairroUseCase';
import { AtualizarBairroPerfilUseCase } from '../application/perfil/AtualizarBairroPerfilUseCase';
import { ListarDuplicidadesPerfilUseCase } from '../application/perfil/ListarDuplicidadesPerfilUseCase';
import { VerificarDuplicidadeAntesDeCriarPerfilUseCase } from '../application/perfil/VerificarDuplicidadeAntesDeCriarPerfilUseCase';
import { PrepararImportacaoPerfisUseCase } from '../application/perfil/PrepararImportacaoPerfisUseCase';
import { ParseImportacaoPerfisUseCase } from '../application/perfil/ParseImportacaoPerfisUseCase';
import { ImportacaoPerfisArquivoUseCase } from '../application/perfil/ImportacaoPerfisArquivoUseCase';
import { ConfirmarImportacaoPerfisUseCase } from '../application/perfil/ConfirmarImportacaoPerfisUseCase';
import { FluxoImportacaoPerfisUseCase } from '../application/perfil/FluxoImportacaoPerfisUseCase';
import { BuildSafePerfilSpreadsheetImportGateway } from '../infrastructure/importacao/PerfilSpreadsheetImportGateway';

export function createPerfilModule(perfis: Repository<Perfil>, clock: Clock, idFactory: () => string) {
  const identityRules = new InMemoryRepository<IdentityRule>();
  const historicoPerfis = new InMemoryRepository<PerfilHistoricoEvento>();
  const resolucoesDuplicidade = new InMemoryRepository<PerfilDuplicidadeResolucao>();
  const importarArquivo = new ImportacaoPerfisArquivoUseCase(new BuildSafePerfilSpreadsheetImportGateway());
  const confirmarImportacao = new ConfirmarImportacaoPerfisUseCase(perfis, clock, idFactory);
  const fluxoImportacao = new FluxoImportacaoPerfisUseCase(importarArquivo, confirmarImportacao);

  return {
    criar: new CriarPerfilUseCase(perfis, clock, idFactory),
    listar: new ListarPerfisUseCase(perfis),
    arquivar: new ArquivarPerfilUseCase(perfis),
    reativar: new ReativarPerfilUseCase(perfis),
    definirCodigo: new DefinirCodigoUseCase(perfis),
    listarPendencias: new ListarPendenciasPerfilUseCase(perfis),
    parseImportacao: new ParseImportacaoPerfisUseCase(),
    importarArquivo,
    confirmarImportacao,
    fluxoImportacao,
    prepararImportacao: new PrepararImportacaoPerfisUseCase(),
    importarSemBairro: new ImportarPerfisSemBairroUseCase(perfis, clock, idFactory),
    atualizarBairro: new AtualizarBairroPerfilUseCase(perfis),
    listarDuplicidades: new ListarDuplicidadesPerfilUseCase(perfis),
    verificarDuplicidadeAntesDeCriar: new VerificarDuplicidadeAntesDeCriarPerfilUseCase(perfis),
    previewRegraIdentidade: new PreviewIdentityRuleUseCase(),
    salvarRegraIdentidade: new SalvarIdentityRuleUseCase(identityRules),
    mesclar: new MesclarPerfisUseCase(perfis),
    exportar: new ExportarPerfisUseCase(perfis),
    selecionar: new SelecionarPerfilUseCase(perfis),
    pendenciasDashboard: new PerfilPendenciasDashboardUseCase(perfis),
    exportarErrosImportacao: new ExportarErrosImportacaoPerfilUseCase(),
    ignorarDuplicidade: new IgnorarDuplicidadePerfilUseCase(resolucoesDuplicidade, idFactory),
    listarHistorico: new ListarHistoricoPerfilUseCase(historicoPerfis),
    registrarHistorico: new RegistrarHistoricoPerfilUseCase(historicoPerfis, idFactory),
    buscar: new BuscarPerfisUseCase(perfis)
  };
}
