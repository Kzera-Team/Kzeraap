import { PrimeiroAcessoUseCase } from '../application/auth/PrimeiroAcessoUseCase';
import { LoginUseCase } from '../application/auth/LoginUseCase';
import { ImportacaoRascunhoRepository } from '../infrastructure/repositories/ImportacaoRascunhoRepository';
import { ImportacaoRascunhoUseCase } from '../application/importacao/ImportacaoRascunhoUseCase';
import type { RascunhoImportacao } from '../infrastructure/repositories/ImportacaoRascunhoRepository';
import { BloquearSessaoUseCase } from '../application/auth/BloquearSessaoUseCase';
import { ObterAuthStateUseCase } from '../application/auth/ObterAuthStateUseCase';
import { ConfirmarFaceIdUseCase } from '../application/auth/ConfirmarFaceIdUseCase';
import { InMemoryRepository } from '../infrastructure/repositories/InMemoryRepository';
import { IndexedDbRepository } from '../infrastructure/repositories/IndexedDbRepository';
import { IndexedDbConnection } from '../infrastructure/storage/IndexedDbConnection';
import type { Repository } from '../application/ports/Repository';
import { BrowserKeyValueStore } from '../infrastructure/storage/BrowserKeyValueStore';
import { RuntimeMetadataKeyValueStore } from '../infrastructure/storage/RuntimeMetadataKeyValueStore';
import { BrowserFaceIdGateway } from '../infrastructure/auth/BrowserFaceIdGateway';
import type { Perfil } from '../domain/perfil/Perfil';
import type { PerfilRecord } from '../runtime/PerfilPayloadFields';
import { PerfilRepository } from '../infrastructure/repositories/PerfilRepository';
import type { ItemCatalogo } from '../domain/item/ItemCatalogo';
import type { IdentityCaseFormat, IdentityColumn, IdentityExtraction, IdentityRule, IdentityRulePart, IdentityTransform } from '../domain/identidade/IdentityRule';
import { previewIdentityRule, validateIdentityRule } from '../domain/identidade/IdentityRuleConfig';
import { createFoundationSecurity } from './createFoundationSecurity';
import { createPerfilUiApp } from './createPerfilUiApp';
import { createItemCatalogoUiApp } from './createItemCatalogoUiApp';
import { escapeHtml } from '../presentation/shared/ui/Html';
import { renderAppMenuButton } from '../presentation/shared/components/AppMenuButton';
import { APP_VERSION, APP_VERSION_LABEL } from './appVersion';
import { BackupGateUseCase, type BackupDecision, type BackupStatus } from '../application/backup/BackupGateUseCase';
import { BackupExportUseCase, type BackupPayload } from '../application/backup/BackupExportUseCase';
import { BrowserBackupExporter } from '../infrastructure/backup/BrowserBackupExporter';
import type { Balanca } from '../domain/operacao/Balanca';
import { ListarBalancasUseCase } from '../application/operacao/ListarBalancasUseCase';
import { CriarBalancaUseCase } from '../application/operacao/CriarBalancaUseCase';
import { AlterarStatusBalancaUseCase } from '../application/operacao/AlterarStatusBalancaUseCase';
import { DefinirBalancaPadraoUseCase } from '../application/operacao/DefinirBalancaPadraoUseCase';
import { RegistrarCalibragemBalancaUseCase } from '../application/operacao/RegistrarCalibragemBalancaUseCase';
import { ConfiguracoesOperacionaisView } from '../presentation/configuracoes/ConfiguracoesOperacionaisView';
import type { ContaFinanceira, MovimentoFinanceiro, PagamentoTransacao, TransacaoFinanceira } from '../domain/financeiro/Financeiro';
import { FinanceiroProtegidoRepository, type FinanceiroProtegidoRecord } from '../infrastructure/repositories/FinanceiroProtegidoRepository';
import type { LoteImportacaoFinanceira, LoteImportacaoTransacoes, PacoteConfirmacaoHistorica, PacoteConfirmacaoHistoricaRecord, RegistroImportacaoFinanceira, RegistroImportacaoFinanceiraRecord, RegistroImportacaoTransacao, RegistroImportacaoTransacaoRecord } from '../domain/importacao/ImportacaoTransacoesFinanceiro';
import { RegistroImportacaoFinanceiraRepository, RegistroImportacaoTransacaoRepository } from '../infrastructure/repositories/ImportacaoStagingRepository';
import { PacoteConfirmacaoHistoricaRepository } from '../infrastructure/repositories/PacoteConfirmacaoHistoricaRepository';
import { PrepararImportacaoTransacoesUseCase } from '../application/importacao/PrepararImportacaoTransacoesUseCase';
import { PrepararImportacaoFinanceiraUseCase } from '../application/importacao/PrepararImportacaoFinanceiraUseCase';
import { ListarStagingImportacaoUseCase } from '../application/importacao/ListarStagingImportacaoUseCase';
import { ConciliarTransacoesFinanceiroUseCase } from '../application/importacao/ConciliarTransacoesFinanceiroUseCase';
import { ResolverPendenciaImportacaoUseCase } from '../application/importacao/ResolverPendenciaImportacaoUseCase';
import { ConfirmarImportacaoHistoricaFinanceiraUseCase } from '../application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase';
import { ResumoFinanceiroUseCase, type ResumoFinanceiroFiltros } from '../application/financeiro/ResumoFinanceiroUseCase';
import { ImportacaoTransacoesFinanceiroView } from '../presentation/importacao/ImportacaoTransacoesFinanceiroView';
import { createUxEventosRepository, createUxFluxosResumoRepository } from '../infrastructure/repositories/UxMetricasRepository';
import { UxMetricasService } from '../application/uxMetricas/UxMetricasService';
import { UxSessaoTracker } from '../application/uxMetricas/UxSessaoTracker';
import { UxFluxoTracker } from '../application/uxMetricas/UxFluxoTracker';
import { UxDomTracker } from '../presentation/shared/uxTracking/UxDomTracker';
import { GerarRelatorioOperacionalUseCase } from '../application/relatorio/GerarRelatorioOperacionalUseCase';
import type { RelatorioFiltroOperacional } from '../domain/relatorio/RelatorioOperacional';
import { FidelizacaoConfigView } from '../presentation/fidelizacao/FidelizacaoConfigView';
import { FidelizacaoDashboardView } from '../presentation/fidelizacao/FidelizacaoDashboardView';
import { ObterRegraFidelidadeUseCase } from '../application/fidelidade/ObterRegraFidelidadeUseCase';
import { SalvarRegraFidelidadeUseCase } from '../application/fidelidade/SalvarRegraFidelidadeUseCase';
import { ArquivarRegraFidelidadeUseCase } from '../application/fidelidade/ArquivarRegraFidelidadeUseCase';
import { ObterDashboardFidelidadeUseCase } from '../application/fidelidade/ObterDashboardFidelidadeUseCase';
import type { RegraFidelidade } from '../domain/fidelidade/RegraFidelidade';

const clock = { now: () => new Date() };
const PUBLIC_APP_NAME = 'Ve' + 'velt';
const CODE_RULE_STORAGE_KEY = 'codigoPerfilRule';
const LEGACY_CODE_RULE_STORAGE_KEY = 'codigoPerfilRule';
const BACKUP_STATUS_KEY = 'backupStatus';

let counter = 0;
const idFactory = () => `perfil-${Date.now()}-${++counter}`;

function createOperationalRepository<T extends { id: string }>(storeName: 'perfis' | 'itens' | 'balancas' | 'contasFinanceiras' | 'movimentosFinanceiros' | 'pagamentosTransacao' | 'transacoesFinanceiras' | 'lotesImportacaoTransacoes' | 'registrosImportacaoTransacoes' | 'lotesImportacaoFinanceira' | 'registrosImportacaoFinanceira' | 'pacotesConfirmacaoHistorica' | 'regrasFidelidade'): Repository<T> {
  if (typeof indexedDB === 'undefined') {
    return new InMemoryRepository<T>();
  }

  // Compatibilidade de auditoria: stores: ['perfis', 'itens', 'balancas']
  const connection = new IndexedDbConnection({
    databaseName: 'kzera_operacional_1102',
    version: 6,
    stores: ['perfis', 'itens', 'balancas', 'contasFinanceiras', 'movimentosFinanceiros', 'pagamentosTransacao', 'transacoesFinanceiras', 'lotesImportacaoTransacoes', 'registrosImportacaoTransacoes', 'lotesImportacaoFinanceira', 'registrosImportacaoFinanceira', 'pacotesConfirmacaoHistorica', 'regrasFidelidade']
  });

  return new IndexedDbRepository<T>(connection, storeName);
}

type Screen = 'home' | 'perfis' | 'itens' | 'transacoes' | 'relatorios' | 'codigo' | 'importacao-perfis' | 'importacao-itens' | 'importacao-transacoes' | 'configuracoes' | 'fidelizacao-config' | 'fidelizacao-dashboard';

interface LegacyCodigoPerfilConfig { fields: IdentityColumn[]; separator: string; }

const FIELD_LABELS: Record<IdentityColumn, string> = {
  'perfil.nome': 'Nome',
  'perfil.bairro': 'Bairro',
  'perfil.municipio': 'Município',
  'perfil.classificacao': 'Conhecido',
  'perfil.codigoInterno': 'Código interno'
};

const EXTRACTION_LABELS: Record<IdentityExtraction, string> = {
  full: 'Valor completo',
  firstLetter: 'Primeira letra',
  firstN: 'Duas primeiras letras',
  firstLetterOfEachWord: 'Primeira letra dos nomes',
  lastLetter: 'Última letra',
  lastLetterOfEachWord: 'Última letra dos nomes',
  firstName: 'Primeiro nome',
  lastName: 'Último nome',
  lastN: 'Últimas letras',
  length: 'Quantidade de caracteres'
};

const CASE_LABELS: Record<IdentityCaseFormat, string> = {
  original: 'Original',
  upper: 'Maiúsculo',
  lower: 'Minúsculo'
};

const TRANSFORM_LABELS: Record<IdentityTransform, string> = {
  none: 'Normal',
  reverse: 'Invertido'
};

const samplePerfil: Perfil = {
  id: 'perfil-exemplo-001',
  nome: 'João Marcos Silva',
  telefone: '(11) 99999-0000',
  email: 'joao@example.com',
  bairro: 'Centro',
  municipio: 'São Paulo',
  conhecePessoalmente: true,
  codigo: '',
  status: 'ativo',
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString()
};

const DEFAULT_CODIGO_PERFIL_RULE: IdentityRule = {
  id: 'codigo-perfil-config',
  version: 1,
  active: true,
  createdAt: new Date(0).toISOString(),
  parts: []
};

function mapLegacyConfig(config: LegacyCodigoPerfilConfig): IdentityRule {
  const parts: IdentityRulePart[] = [];
  config.fields.forEach((field, index) => {
    if (index > 0 && config.separator) {
      parts.push({ type: 'staticText', value: config.separator, caseFormat: 'original', transform: 'none' });
    }
    parts.push({ type: 'column', column: field, extraction: field === 'perfil.nome' ? 'firstLetterOfEachWord' : 'firstLetter', caseFormat: 'upper', transform: 'none' });
  });
  return { ...DEFAULT_CODIGO_PERFIL_RULE, parts };
}

function cloneRule(rule: IdentityRule): IdentityRule {
  return structuredClone(rule);
}

function authShell(content: string, erro = ''): string {
  return `<section class="auth-shell">
    <div class="auth-card">
      <div class="auth-brand"><div class="auth-icon">V</div><div><h1>${PUBLIC_APP_NAME}</h1></div></div>
      ${erro ? `<div class="toast toast-error" data-testid="auth-error">${escapeHtml(erro)}</div>` : ''}
      ${content}
      <footer class="auth-version" data-testid="app-version">${escapeHtml(APP_VERSION_LABEL)}</footer>
    </div>
  </section>`;
}

function passwordField(id: string, label: string, autocomplete: 'current-password' | 'new-password' = 'current-password'): string {
  return `<label class="auth-field password-field"><span>${escapeHtml(label)}</span><span class="password-control"><input id="${escapeHtml(id)}" type="password" autocomplete="${autocomplete}" required /><button type="button" class="password-toggle" data-toggle-password="${escapeHtml(id)}" aria-label="Mostrar senha">👁</button></span></label>`;
}

function bindPasswordToggles(root: HTMLElement): void {
  root.querySelectorAll('[data-toggle-password]').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = (button as HTMLElement).dataset.togglePassword;
      const input = targetId ? root.querySelector(`#${targetId}`) as HTMLInputElement | null : null;
      if (!input) return;
      const visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      button.textContent = visible ? '👁' : '🙈';
      button.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
      input.focus();
    });
  });
}

function optionList<T extends string>(labels: Record<T, string>, selected: T): string {
  return Object.entries(labels).map(([value, label]) => `<option value="${escapeHtml(value)}" ${value === selected ? 'selected' : ''}>${escapeHtml(String(label))}</option>`).join('');
}

function renderRulePart(part: IdentityRulePart, index: number): string {
  const typeOptions = `<option value="staticText" ${part.type === 'staticText' ? 'selected' : ''}>Texto livre</option><option value="column" ${part.type === 'column' ? 'selected' : ''}>Coluna</option>`;
  const column = part.type === 'column' ? part.column : 'perfil.nome';
  const extraction = part.type === 'column' ? part.extraction : 'full';
  const value = part.type === 'staticText' ? part.value : '';
  const textField = part.type === 'staticText'
    ? `<label data-text-row><span>Texto livre</span><input data-code-field="value" value="${escapeHtml(value)}" placeholder="Texto fixo" /></label>`
    : '';
  const columnField = part.type === 'column'
    ? `<label data-column-row><span>Coluna</span><select data-code-field="column">${optionList(FIELD_LABELS, column)}</select></label>`
    : '';
  const extractionField = part.type === 'column'
    ? `<label data-column-row><span>Regra de extração</span><select data-code-field="extraction">${optionList(EXTRACTION_LABELS, extraction)}</select></label>`
    : '';
  return `<article class="kzera-card code-rule-block" data-code-block="${index}">
    <header><strong>Bloco ${index + 1}</strong><button class="icon-button" type="button" data-code-remove="${index}" aria-label="Remover bloco" title="Remover bloco">×</button></header>
    <label><span>Tipo</span><select data-code-field="type">${typeOptions}</select></label>
    ${textField}
    ${columnField}
    ${extractionField}
    <label><span>Formatação</span><select data-code-field="caseFormat">${optionList(CASE_LABELS, part.caseFormat)}</select></label>
    <label><span>Transformação</span><select data-code-field="transform">${optionList(TRANSFORM_LABELS, part.transform)}</select></label>
  </article>`;
}

function codigoPerfilConfigScreen(rule: IdentityRule, erro = '', mode: 'onboarding' | 'authenticated' = 'onboarding'): string {
  const hasParts = rule.parts.length > 0;
  const preview = hasParts ? previewIdentityRule({ rule, perfil: samplePerfil }) : { value: '', valid: false, errors: [] };
  const shellClass = mode === 'onboarding' ? 'kzera-mobile-shell code-rule-shell' : 'kzera-screen code-rule-shell';
  const intro = mode === 'onboarding'
    ? `<header class="kzera-home-header"><div class="kzera-brand"><div class="kzera-logo">V</div><div><h1>${PUBLIC_APP_NAME}</h1><p>Configuração inicial</p></div></div></header>`
    : `<header class="kzera-operational-header"><div class="kzera-operational-title"><span class="eyebrow">Configuração</span><h1>Código do Perfil</h1></div></header>`;
  const submitLabel = mode === 'onboarding' ? 'Salvar e entrar' : 'Salvar';
  return `<section class="${shellClass}" data-testid="codigo-perfil-config">
    ${intro}
    ${erro ? `<div class="toast toast-error" data-testid="codigo-config-error">${escapeHtml(erro)}</div>` : ''}
    <form class="kzera-card code-rule-form" data-testid="codigo-perfil-form">
      <div class="kzera-section-title compact-title"><div><span class="eyebrow">Construtor</span><h2>Blocos do Código do Perfil</h2></div></div>
      <p class="form-hint">Configure pelo menos 3 campos/blocos para salvar.</p>
      <div class="code-rule-builder" data-testid="codigo-perfil-builder">${hasParts ? rule.parts.map(renderRulePart).join('') : '<div class="empty-state" data-testid="codigo-perfil-empty">Nenhum campo configurado ainda.</div>'}</div>
      <div class="action-row"><button class="icon-button text-icon" type="button" data-code-add="text" aria-label="Adicionar texto livre" title="Adicionar texto livre">+ Texto livre</button><button class="icon-button text-icon" type="button" data-code-add="column" aria-label="Adicionar coluna" title="Adicionar coluna">+ Coluna</button></div>
      <div class="code-rule-preview" data-testid="codigo-perfil-preview">Exemplo: ${escapeHtml(preview.value || '—')}</div>
      ${preview.errors.length ? `<p class="form-error">${escapeHtml(preview.errors.join(' '))}</p>` : ''}
      <button class="icon-button primary-icon text-icon" type="submit" aria-label="${escapeHtml(submitLabel)}" title="${escapeHtml(submitLabel)}">${escapeHtml(submitLabel)}</button>
    </form>
  </section>`;
}

export function createKzeraAuthenticatedApp() {
  const browserStore = new BrowserKeyValueStore('kzera-runtime');
  const stateStore = new RuntimeMetadataKeyValueStore(browserStore);
  const configStore = new BrowserKeyValueStore('kzera-config');
  const security = createFoundationSecurity(stateStore, clock);
  const primeiroAcesso = new PrimeiroAcessoUseCase(security.accessCoordinator);
  const login = new LoginUseCase(security.accessCoordinator);
  const faceIdGateway = new BrowserFaceIdGateway();
  const confirmarAtencao = new ConfirmarFaceIdUseCase(security.session, faceIdGateway);
  const obterAuthState = new ObterAuthStateUseCase(security.accessCoordinator, security.session);
  const bloquear = new BloquearSessaoUseCase(security.resourceScope);
  const perfisBase = createOperationalRepository<Perfil>('perfis');
  const perfis: Repository<Perfil> = typeof indexedDB === 'undefined'
    ? perfisBase
    : new PerfilRepository(
      new IndexedDbRepository<PerfilRecord>(new IndexedDbConnection({
        databaseName: 'kzera_operacional_perfis_seguro_1133',
        version: 1,
        stores: ['perfis']
      }), 'perfis'),
      security.session
    );
  const itens = createOperationalRepository<ItemCatalogo>('itens');
  const balancas = createOperationalRepository<Balanca>('balancas');
  const contasFinanceirasBase = createOperationalRepository<FinanceiroProtegidoRecord>('contasFinanceiras');
  const contasFinanceiras: Repository<ContaFinanceira> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<ContaFinanceira>()
    : new FinanceiroProtegidoRepository<ContaFinanceira>(contasFinanceirasBase, security.session, 'conta_financeira');
  const movimentosFinanceirosBase = createOperationalRepository<FinanceiroProtegidoRecord>('movimentosFinanceiros');
  const movimentosFinanceiros: Repository<MovimentoFinanceiro> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<MovimentoFinanceiro>()
    : new FinanceiroProtegidoRepository<MovimentoFinanceiro>(movimentosFinanceirosBase, security.session, 'movimento_financeiro');
  const pagamentosTransacaoBase = createOperationalRepository<FinanceiroProtegidoRecord>('pagamentosTransacao');
  const pagamentosTransacao: Repository<PagamentoTransacao> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<PagamentoTransacao>()
    : new FinanceiroProtegidoRepository<PagamentoTransacao>(pagamentosTransacaoBase, security.session, 'pagamento_transacao');
  const transacoesFinanceirasBase = createOperationalRepository<FinanceiroProtegidoRecord>('transacoesFinanceiras');
  const transacoesFinanceiras: Repository<TransacaoFinanceira> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<TransacaoFinanceira>()
    : new FinanceiroProtegidoRepository<TransacaoFinanceira>(transacoesFinanceirasBase, security.session, 'transacao_financeira');
  const lotesImportacaoTransacoes = createOperationalRepository<LoteImportacaoTransacoes>('lotesImportacaoTransacoes');
  const registrosImportacaoTransacoesBase = createOperationalRepository<RegistroImportacaoTransacaoRecord>('registrosImportacaoTransacoes');
  const registrosImportacaoTransacoes: Repository<RegistroImportacaoTransacao> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<RegistroImportacaoTransacao>()
    : new RegistroImportacaoTransacaoRepository(registrosImportacaoTransacoesBase, security.session);
  const lotesImportacaoFinanceira = createOperationalRepository<LoteImportacaoFinanceira>('lotesImportacaoFinanceira');
  const registrosImportacaoFinanceiraBase = createOperationalRepository<RegistroImportacaoFinanceiraRecord>('registrosImportacaoFinanceira');
  const registrosImportacaoFinanceira: Repository<RegistroImportacaoFinanceira> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<RegistroImportacaoFinanceira>()
    : new RegistroImportacaoFinanceiraRepository(registrosImportacaoFinanceiraBase, security.session);
  const pacotesConfirmacaoHistoricaBase = createOperationalRepository<PacoteConfirmacaoHistoricaRecord>('pacotesConfirmacaoHistorica');
  const pacotesConfirmacaoHistorica: Repository<PacoteConfirmacaoHistorica> = typeof indexedDB === 'undefined'
    ? new InMemoryRepository<PacoteConfirmacaoHistorica>()
    : new PacoteConfirmacaoHistoricaRepository(pacotesConfirmacaoHistoricaBase, security.session);
  const importacaoTransacoesFinanceiroApp = new ImportacaoTransacoesFinanceiroView({
    prepararTransacoes: new PrepararImportacaoTransacoesUseCase(lotesImportacaoTransacoes, registrosImportacaoTransacoes, perfis, itens, clock, prefix => `${prefix}-${Date.now()}-${++counter}`),
    prepararFinanceiro: new PrepararImportacaoFinanceiraUseCase(lotesImportacaoFinanceira, registrosImportacaoFinanceira, registrosImportacaoTransacoes, perfis, clock, prefix => `${prefix}-${Date.now()}-${++counter}`),
    listarStaging: new ListarStagingImportacaoUseCase(lotesImportacaoTransacoes, registrosImportacaoTransacoes, lotesImportacaoFinanceira, registrosImportacaoFinanceira),
    conciliar: new ConciliarTransacoesFinanceiroUseCase(registrosImportacaoTransacoes, registrosImportacaoFinanceira),
    resolverPendencia: new ResolverPendenciaImportacaoUseCase(registrosImportacaoTransacoes, registrosImportacaoFinanceira, () => clock.now().toISOString()),
    confirmarHistoricoFinanceiro: new ConfirmarImportacaoHistoricaFinanceiraUseCase(registrosImportacaoTransacoes, registrosImportacaoFinanceira, transacoesFinanceiras, pagamentosTransacao, movimentosFinanceiros, clock, prefix => `${prefix}-${Date.now()}-${++counter}`, pacotesConfirmacaoHistorica),
    onRascunhoAtualizado: async (acao) => {
      if (acao === 'salvar') {
        try { await importacaoRascunho.salvar({ tipo: 'transacoes' }); } catch { /* best-effort */ }
      } else {
        try { await importacaoRascunho.descartar('transacoes'); } catch { /* best-effort */ }
      }
    }
  });
  security.resourceScope.register(importacaoTransacoesFinanceiroApp);
  const resumoFinanceiro = new ResumoFinanceiroUseCase(transacoesFinanceiras, movimentosFinanceiros, pagamentosTransacao);
  const relatorioOperacional = new GerarRelatorioOperacionalUseCase(perfis, itens, transacoesFinanceiras);
  const configuracoesApp = new ConfiguracoesOperacionaisView({
    listarBalancas: new ListarBalancasUseCase(balancas),
    criarBalanca: new CriarBalancaUseCase(balancas, clock, () => `balanca-${Date.now()}-${++counter}`),
    alterarStatusBalanca: new AlterarStatusBalancaUseCase(balancas, clock),
    definirBalancaPadrao: new DefinirBalancaPadraoUseCase(balancas, clock),
    registrarCalibragemBalanca: new RegistrarCalibragemBalancaUseCase(balancas, clock, () => `calibragem-${Date.now()}-${++counter}`),
    limparMetricasUso: () => uxTracker.limparMetricas()
  });
  const regrasFidelidade = createOperationalRepository<RegraFidelidade>('regrasFidelidade');
  const fidelizacaoConfigApp = new FidelizacaoConfigView({
    obterRegra: new ObterRegraFidelidadeUseCase(regrasFidelidade),
    salvarRegra: new SalvarRegraFidelidadeUseCase(regrasFidelidade, clock, () => `regra-fidelidade-${Date.now()}-${++counter}`),
    arquivarRegra: new ArquivarRegraFidelidadeUseCase(regrasFidelidade, clock),
  });
  const fidelizacaoDashboardApp = new FidelizacaoDashboardView({
    obterDashboard: new ObterDashboardFidelidadeUseCase(),
  });
  // Rascunho de importação — criado após security.session estar disponível
  const importacaoRascunhoRepo = new ImportacaoRascunhoRepository(security.session);
  const importacaoRascunho = new ImportacaoRascunhoUseCase(importacaoRascunhoRepo);

  let cachedIdentityRule: IdentityRule = cloneRule(DEFAULT_CODIGO_PERFIL_RULE);
  const perfilApp = createPerfilUiApp(perfis, clock, idFactory, () => cachedIdentityRule, importacaoRascunho);
  const itemApp = createItemCatalogoUiApp(itens, balancas, clock, () => `item-${Date.now()}-${++counter}`, importacaoRascunho);
  const backupGate = new BackupGateUseCase();
  const backupExport = new BackupExportUseCase(new BrowserBackupExporter(), security.session);
  const uxMetricas = new UxMetricasService(createUxEventosRepository(), undefined, { clock, idFactory: () => `ux-${Date.now()}-${++counter}` });
  const uxSessao = new UxSessaoTracker(uxMetricas, () => `sessao-${Date.now()}-${++counter}`);
  const uxFluxos = new UxFluxoTracker(createUxFluxosResumoRepository(), uxMetricas, clock, () => `ux-fluxo-${Date.now()}-${++counter}`);
  const uxTracker = new UxDomTracker(uxMetricas, uxSessao, uxFluxos);

  let currentScreen: Screen = 'home';
  let rootRef: HTMLElement | null = null;
  let erro = '';
  let activityTimer: number | undefined;
  let backupTimer: number | undefined;
  let listenersBound = false;
  let lifecycleBound = false;
  let appWasHidden = false;
  let autoFaceIdTried = false;
  let resumeInProgress = false;
  let currentDraftRule: IdentityRule | null = null;
  let menuOpen = false;
  let historyBound = false;
  let swipeBound = false;
  let backupDecision: BackupDecision | null = null;
  let backupMessage = '';
  let filtrosFinanceiros: { dataInicio: string; dataFim: string; perfil: string; metodo: string; origem: string; statusFinanceiro: 'todos' | 'pago' | 'parcial' | 'pendente' | 'cancelado' } = { dataInicio: '', dataFim: '', perfil: '', metodo: '', origem: 'todas', statusFinanceiro: 'todos' };
  let mensagemTransacoes = '';
  let filtrosRelatorios: RelatorioFiltroOperacional = { dataInicio: '', dataFim: '', origem: 'todas', statusFinanceiro: 'todos' };
  let mensagemRelatorios = '';

  // --- Rascunho de importação / retomada entre sessões ---
  // Flag de nova sessão: sessionStorage sobrevive à mesma aba mas é limpo ao fechar/reabrir.
  const SESSION_FLAG_KEY = 'kzera_sessao_ativa';
  let rascunhosRetomada: RascunhoImportacao[] = [];
  let modalRetomadaVisivel = false;
  let rascunhosVerificados = false;

  async function loadCodigoPerfilRule(): Promise<IdentityRule | null> {
    const raw = await configStore.get(CODE_RULE_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as IdentityRule;
    const legacy = await configStore.get(LEGACY_CODE_RULE_STORAGE_KEY);
    if (legacy) return mapLegacyConfig(JSON.parse(legacy) as LegacyCodigoPerfilConfig);
    return null;
  }

  async function saveCodigoPerfilRule(rule: IdentityRule): Promise<void> {
    await configStore.set(CODE_RULE_STORAGE_KEY, JSON.stringify(rule));
    cachedIdentityRule = cloneRule(rule);
  }

  async function ensureCodigoPerfilRule(): Promise<IdentityRule | null> {
    const saved = await loadCodigoPerfilRule();
    if (saved) cachedIdentityRule = cloneRule(saved);
    return saved;
  }


  async function loadBackupStatus(): Promise<BackupStatus> {
    const raw = await configStore.get(BACKUP_STATUS_KEY);
    if (!raw) return { postponesUsed: 0 };
    try { const parsed = JSON.parse(raw) as BackupStatus; return { ...parsed, postponesUsed: parsed.postponesUsed ?? 0 }; }
    catch { return { postponesUsed: 0 }; }
  }

  async function saveBackupStatus(status: BackupStatus): Promise<void> {
    await configStore.set(BACKUP_STATUS_KEY, JSON.stringify(status));
  }

  async function refreshBackupDecision(): Promise<void> {
    backupDecision = backupGate.evaluate(await loadBackupStatus(), new Date());
    if (backupDecision.status) await saveBackupStatus(backupDecision.status);
  }

  async function buildBackupPayload(): Promise<BackupPayload> {
    return {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      appVersion: APP_VERSION,
      data: {
        perfis: await perfis.list(),
        itens: await itens.list(),
        balancas: await balancas.list(),
        contasFinanceiras: await contasFinanceiras.list(),
        movimentosFinanceiros: await movimentosFinanceiros.list(),
        pagamentosTransacao: await pagamentosTransacao.list(),
        transacoesFinanceiras: await transacoesFinanceiras.list(),
        lotesImportacaoTransacoes: await lotesImportacaoTransacoes.list(),
        registrosImportacaoTransacoes: await registrosImportacaoTransacoes.list(),
        lotesImportacaoFinanceira: await lotesImportacaoFinanceira.list(),
        registrosImportacaoFinanceira: await registrosImportacaoFinanceira.list()
      }
    };
  }

  async function exportBackupNow(): Promise<void> {
    const current = backupDecision?.status || await loadBackupStatus();
    await backupExport.execute(await buildBackupPayload(), new Date());
    await saveBackupStatus(backupGate.complete(current, new Date()));
    backupMessage = 'Cópia de segurança salva.';
    await refreshBackupDecision();
    await render();
  }

  async function postponeBackupNow(): Promise<void> {
    const current = backupDecision?.status || await loadBackupStatus();
    await saveBackupStatus(backupGate.postpone(current, new Date()));
    backupMessage = 'Lembrete adiado por 20 minutos.';
    await refreshBackupDecision();
    await render();
  }

  function renderBackupModal(): string {
    if (!backupDecision?.required) return '';
    const label = backupDecision.status.pendingWindowLabel || 'cópia';
    const mandatory = backupDecision.blocked;
    return `<div class="kzera-modal-backdrop" data-testid="backup-modal" role="dialog" aria-modal="true" aria-label="Cópia de segurança">
      <section class="kzera-modal-card backup-modal-card">
        <span class="eyebrow">Cópia de segurança ${escapeHtml(label)}</span>
        <h2>Salvar cópia de segurança</h2>
        <p>Precisamos salvar uma cópia de segurança agora. É para proteger seu trabalho, não para te culpar.</p>
        <p>A cópia sai protegida pela senha deste aparelho e vai para um arquivo discreto <code>.dat</code>. Configurações não entram na cópia.</p>
        ${mandatory ? '<div class="toast toast-error">O adiamento acabou. Salve a cópia para continuar com segurança.</div>' : ''}
        ${backupMessage ? `<div class="toast">${escapeHtml(backupMessage)}</div>` : ''}
        <div class="backup-modal-actions">
          <button type="button" class="icon-text-button primary" data-backup-export aria-label="Salvar cópia de segurança" title="Salvar cópia de segurança">⇩ Salvar cópia</button>
          ${backupDecision.canPostpone ? '<button type="button" class="icon-text-button" data-backup-postpone aria-label="Adiar cópia por 20 minutos" title="Adiar cópia por 20 minutos">⏱ Adiar 20 min</button>' : ''}
        </div>
      </section>
    </div>`;
  }

  function bindBackupModal(): void {
    rootRef?.querySelector('[data-backup-export]')?.addEventListener('click', async () => { backupMessage = ''; try { await exportBackupNow(); } catch (error) { backupMessage = error instanceof Error ? error.message : 'Não foi possível salvar a cópia de segurança.'; await render(); } });
    rootRef?.querySelector('[data-backup-postpone]')?.addEventListener('click', async () => { backupMessage = ''; await postponeBackupNow(); });
  }



  function isTextEntryActive(): boolean {
    const active = document.activeElement;
    return active instanceof HTMLElement && Boolean(active.closest('input, textarea, select, [contenteditable="true"]'));
  }

  function scheduleBackupCheck(): void {
    if (backupTimer) window.clearTimeout(backupTimer);
    backupTimer = window.setTimeout(async () => {
      if (!rootRef) return;
      await refreshBackupDecision();
      await render();
      scheduleBackupCheck();
    }, 60_000);
  }

  function scheduleAttentionCheck(): void {
    if (activityTimer) window.clearTimeout(activityTimer);
    activityTimer = window.setTimeout(async () => {
      const state = await obterAuthState.execute();
      if (state !== 'unlocked') {
        if (isTextEntryActive()) {
          scheduleAttentionCheck();
          return;
        }
        await render();
        return;
      }
      scheduleAttentionCheck();
    }, 1_000);
  }

  function touchSession(): void { security.session.touch(); scheduleAttentionCheck(); }

  async function configureFaceIdAutomatically(): Promise<void> {
    if (faceIdGateway.isConfigured()) return;
    await faceIdGateway.configure();
  }

  async function confirmAttentionAutomatically(): Promise<void> {
    if (autoFaceIdTried || isTextEntryActive()) return;
    autoFaceIdTried = true;
    try { await confirmarAtencao.execute(); autoFaceIdTried = false; await render(); } catch { /* fallback por senha/botão */ }
  }

  async function navigate(screen: Screen, push = true): Promise<void> {
    const origem = push ? 'menu' : 'voltar';
    currentScreen = screen;
    void uxTracker.telaMudou(screen, origem);
    menuOpen = false;
    if (push && typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState({ screen }, '', `#${screen}`);
    }
    await render();
  }


  function bindSwipeNavigation(): void {
    if (swipeBound || typeof window === 'undefined') return;
    swipeBound = true;

    let startX = 0;
    let startY = 0;

    window.addEventListener('touchstart', event => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const touch = event.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
    }, { passive: true });

    window.addEventListener('touchend', event => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      if (Math.abs(deltaX) < 72 || Math.abs(deltaY) > 48) return;

      if (menuOpen && deltaX < -72) {
        menuOpen = false;
        void render();
        return;
      }

      if (startX <= 24 && deltaX > 72) {
        if (currentScreen === 'home') {
          menuOpen = true;
          void render();
          return;
        }
        window.history.back();
      }
    }, { passive: true });
  }

  function bindHistory(): void {
    if (historyBound || typeof window === 'undefined') return;
    historyBound = true;
    window.addEventListener('popstate', event => {
      const screen = (event.state?.screen || 'home') as Screen;
      currentScreen = screen;
      void uxTracker.telaMudou(screen, 'voltar');
      menuOpen = false;
      void render();
    });
  }

  async function requireFaceIdOnResume(reason: 'visible' | 'pageshow' | 'focus'): Promise<void> {
    if (resumeInProgress) return;

    resumeInProgress = true;

    try {
      const state = await obterAuthState.execute();
      if (state !== 'unlocked') {
        await render();
        return;
      }
      if (isTextEntryActive()) return;

      security.session.requireAttention();
      erro = '';
      await render();
    } finally {
      resumeInProgress = false;
    }
  }

  function bindAppLifecycle(): void {
    if (lifecycleBound || typeof window === 'undefined') return;
    lifecycleBound = true;
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') void uxTracker.appBloqueado();
      if (document.visibilityState === 'visible') void uxTracker.appDesbloqueado();
      if (document.visibilityState === 'hidden') { appWasHidden = true; bloquear.execute(); return; }
      if (document.visibilityState === 'visible') { appWasHidden = false; void requireFaceIdOnResume('visible'); }
    });
    window.addEventListener('pageshow', () => { void uxTracker.appReaberto(); void requireFaceIdOnResume('pageshow'); });
    window.addEventListener('focus', () => {
      appWasHidden = false;
      void requireFaceIdOnResume('focus');
    });
  }

  function bindNavigation(): void {
    if (!rootRef) return;
    rootRef.querySelectorAll('[data-nav]').forEach(button => {
      button.addEventListener('click', async () => navigate(((button as HTMLElement).dataset.nav as Screen) || 'home'));
    });
    rootRef.querySelectorAll('[data-menu-toggle]').forEach(button => button.addEventListener('click', async () => { menuOpen = !menuOpen; await render(); }));
    rootRef.querySelectorAll('[data-menu-close]').forEach(button => button.addEventListener('click', async () => { menuOpen = false; await render(); }));
    rootRef.querySelectorAll('[data-quick="novo-perfil"]').forEach(button => button.addEventListener('click', async () => { void uxTracker.telaMudou('perfis', 'atalho'); currentScreen = 'perfis'; menuOpen = false; await render(); const main = rootRef?.querySelector('#kzera-main') as HTMLElement | null; if (main) await perfilApp.mountNovo(main); }));
    rootRef.querySelectorAll('[data-quick="novo-item"]').forEach(button => button.addEventListener('click', async () => { void uxTracker.telaMudou('itens', 'atalho'); currentScreen = 'itens'; menuOpen = false; await render(); const main = rootRef?.querySelector('#kzera-main') as HTMLElement | null; if (main) await itemApp.mountNovo(main); }));
    rootRef.querySelectorAll('[data-testid="logout-button"]').forEach(button => {
      button.addEventListener('click', async () => { bloquear.execute(); erro = ''; currentScreen = 'home'; menuOpen = false; await render(); });
    });
  }

  function readDraftRuleFromDom(): IdentityRule {
    const parts: IdentityRulePart[] = [];
    rootRef?.querySelectorAll<HTMLElement>('[data-code-block]').forEach(block => {
      const type = (block.querySelector('[data-code-field="type"]') as HTMLSelectElement | null)?.value;
      const caseFormat = ((block.querySelector('[data-code-field="caseFormat"]') as HTMLSelectElement | null)?.value || 'original') as IdentityCaseFormat;
      const transform = ((block.querySelector('[data-code-field="transform"]') as HTMLSelectElement | null)?.value || 'none') as IdentityTransform;
      if (type === 'staticText') {
        const value = (block.querySelector('[data-code-field="value"]') as HTMLInputElement | null)?.value || '';
        parts.push({ type: 'staticText', value, caseFormat, transform });
      } else {
        const column = ((block.querySelector('[data-code-field="column"]') as HTMLSelectElement | null)?.value || 'perfil.nome') as IdentityColumn;
        const extraction = ((block.querySelector('[data-code-field="extraction"]') as HTMLSelectElement | null)?.value || 'full') as IdentityExtraction;
        const columnPart: IdentityRulePart = extraction === 'firstN'
          ? { type: 'column', column, extraction, n: 2, caseFormat, transform }
          : { type: 'column', column, extraction, caseFormat, transform };
        parts.push(columnPart);
      }
    });
    return { id: 'codigo-perfil-config', version: 1, active: true, createdAt: cachedIdentityRule.createdAt || new Date().toISOString(), parts };
  }

  async function updateCodigoDraftFromDom(): Promise<void> {
    currentDraftRule = readDraftRuleFromDom();
    if (currentScreen === 'codigo') { await render(); return; }
    rootRef!.innerHTML = codigoPerfilConfigScreen(currentDraftRule, erro, 'onboarding');
    await bindCodigoPerfilForm();
  }

  async function bindCodigoPerfilForm(): Promise<void> {
    if (!rootRef) return;
    rootRef.querySelectorAll('[data-code-add]').forEach(button => {
      button.addEventListener('click', async () => {
        const next = currentDraftRule ? cloneRule(currentDraftRule) : cloneRule(cachedIdentityRule);
        if ((button as HTMLElement).dataset.codeAdd === 'text') next.parts.push({ type: 'staticText', value: '', caseFormat: 'original', transform: 'none' });
        else next.parts.push({ type: 'column', column: 'perfil.nome', extraction: 'firstLetter', caseFormat: 'upper', transform: 'none' });
        currentDraftRule = next;
        if (currentScreen === 'codigo') await render();
        else { rootRef!.innerHTML = codigoPerfilConfigScreen(next, erro, 'onboarding'); await bindCodigoPerfilForm(); }
      });
    });
    rootRef.querySelectorAll('[data-code-remove]').forEach(button => {
      button.addEventListener('click', async () => {
        const index = Number((button as HTMLElement).dataset.codeRemove);
        const next = currentDraftRule ? cloneRule(currentDraftRule) : cloneRule(cachedIdentityRule);
        next.parts.splice(index, 1);
        currentDraftRule = next;
        if (currentScreen === 'codigo') await render();
        else { rootRef!.innerHTML = codigoPerfilConfigScreen(next, erro, 'onboarding'); await bindCodigoPerfilForm(); }
      });
    });
    rootRef.querySelectorAll('[data-code-field]').forEach(input => input.addEventListener('input', () => { void updateCodigoDraftFromDom(); }));
    rootRef.querySelector('[data-testid="codigo-perfil-form"]')?.addEventListener('submit', async event => {
      event.preventDefault();
      erro = '';
      const rule = readDraftRuleFromDom();
      const errors = validateIdentityRule(rule);
      if (rule.parts.length < 3) errors.push('Configure pelo menos 3 campos para o Código do Perfil.');
      const preview = previewIdentityRule({ rule, perfil: samplePerfil });
      if (errors.length || !preview.valid) { erro = [...errors, ...preview.errors].join(' '); await render(); return; }
      await saveCodigoPerfilRule(rule);
      await configureFaceIdAutomatically();
      currentDraftRule = null;
      await navigate('home');
    });
  }

  function renderDrawer(): string {
    const openClass = menuOpen ? ' is-open' : '';
    const items: Array<[Screen, string]> = [['perfis', 'Perfis'], ['itens', 'Itens'], ['transacoes', 'Dinheiro'], ['relatorios', 'Relatórios'], ['codigo', 'Código do Perfil'], ['importacao-perfis', 'Importar Perfis'], ['importacao-itens', 'Importar Itens'], ['importacao-transacoes', 'Importar Transações'], ['configuracoes', 'Configurações']];
    const fidelizacaoItems: Array<[Screen, string]> = [['fidelizacao-config', 'Configuração'], ['fidelizacao-dashboard', 'Dashboard']];
    const fidelizacaoNav = `<div class="kzera-drawer-group"><span class="kzera-drawer-group-label">Fidelização</span>${fidelizacaoItems.map(([screen, label]) => `<button type="button" data-nav="${screen}" class="${currentScreen === screen ? 'active' : ''}">${label}</button>`).join('')}</div>`;
    return `${renderAppMenuButton()}
      <div class="kzera-drawer-backdrop${openClass}" data-menu-close></div>
      <aside class="kzera-drawer${openClass}" aria-label="Menu principal">
        <header><div><strong>${PUBLIC_APP_NAME}</strong></div><button type="button" data-menu-close aria-label="Fechar menu">×</button></header>
        <nav>${items.map(([screen, label]) => `<button type="button" data-nav="${screen}" class="${currentScreen === screen ? 'active' : ''}">${label}</button>`).join('')}${fidelizacaoNav}<button type="button" data-testid="logout-button">Sair</button></nav><footer class="kzera-drawer-footer"><span class="kzera-drawer-version" data-testid="menu-app-version">${escapeHtml(APP_VERSION_LABEL)}</span></footer>
      </aside>`;
  }


  function dinheiro(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  async function renderTransacoesScreen(): Promise<string> {
    const filtrosResumo: ResumoFinanceiroFiltros = { statusFinanceiro: filtrosFinanceiros.statusFinanceiro };
    if (filtrosFinanceiros.dataInicio) filtrosResumo.dataInicio = filtrosFinanceiros.dataInicio;
    if (filtrosFinanceiros.dataFim) filtrosResumo.dataFim = filtrosFinanceiros.dataFim;
    if (filtrosFinanceiros.perfil) filtrosResumo.perfil = filtrosFinanceiros.perfil;
    if (filtrosFinanceiros.metodo) filtrosResumo.metodo = filtrosFinanceiros.metodo;
    if (filtrosFinanceiros.origem) filtrosResumo.origem = filtrosFinanceiros.origem;
    const resumo = await resumoFinanceiro.execute(filtrosResumo);
    return `<section class="kzera-screen" data-testid="transacoes-financeiras-historico">
      <header class="kzera-operational-header"><div class="kzera-operational-title"><span class="eyebrow">Dinheiro</span><h1>Resumo do dinheiro</h1></div></header>
      <p class="form-hint">O histórico importado entra no resumo do dinheiro. Ele não muda o estoque.</p>
      ${mensagemTransacoes ? `<div class="toast">${escapeHtml(mensagemTransacoes)}</div>` : ''}
      <form class="kzera-card soft-card" data-filtros-financeiros>
        <h3>Encontrar registros</h3>
        <div class="import-grid two-cols">
          <label><span>De</span><input type="date" name="dataInicio" value="${escapeHtml(filtrosFinanceiros.dataInicio)}" /></label>
          <label><span>Até</span><input type="date" name="dataFim" value="${escapeHtml(filtrosFinanceiros.dataFim)}" /></label>
          <label><span>Perfil/comprador</span><input name="perfil" value="${escapeHtml(filtrosFinanceiros.perfil)}" placeholder="Nome ou código" /></label>
          <label><span>Forma ou referência</span><input name="metodo" value="${escapeHtml(filtrosFinanceiros.metodo)}" placeholder="Pix, cripto, referência" /></label>
          <label><span>Tipo</span><select name="origem"><option value="todas" ${filtrosFinanceiros.origem === 'todas' ? 'selected' : ''}>Todas</option><option value="importado_csv" ${filtrosFinanceiros.origem === 'importado_csv' ? 'selected' : ''}>Importado</option><option value="manual" ${filtrosFinanceiros.origem === 'manual' ? 'selected' : ''}>Novo registro</option></select></label>
          <label><span>Status</span><select name="statusFinanceiro"><option value="todos" ${filtrosFinanceiros.statusFinanceiro === 'todos' ? 'selected' : ''}>Todos</option><option value="pago" ${filtrosFinanceiros.statusFinanceiro === 'pago' ? 'selected' : ''}>Pago</option><option value="parcial" ${filtrosFinanceiros.statusFinanceiro === 'parcial' ? 'selected' : ''}>Parcial</option><option value="pendente" ${filtrosFinanceiros.statusFinanceiro === 'pendente' ? 'selected' : ''}>Pendente</option></select></label>
        </div>
        <div class="compact-actions"><button class="icon-button text-icon primary-icon" type="submit">Filtrar</button><button class="icon-button text-icon" type="button" data-limpar-filtros-financeiros>Limpar filtros</button></div>
      </form>
      <details class="inline-details"><summary>Ver números do período</summary><div class="import-staging-summary" aria-label="Resumo do dinheiro">
        <span>Registros: ${resumo.totalTransacoes}</span>
        <span>Faturamento: ${dinheiro(resumo.faturamento)}</span>
        <span>Valor pago: ${dinheiro(resumo.valorPago)}</span>
        <span>Pendente: ${dinheiro(resumo.valorPendente)}</span>
        <span>Custo: ${dinheiro(resumo.custo)}</span>
        <span>Lucro: ${dinheiro(resumo.lucro)}</span>
        <span>Pagamentos conferidos: ${resumo.movimentosConfirmados}</span>
        <span>Pagamentos pendentes: ${resumo.movimentosPendentes}</span>
      </div></details>
    </section>`;
  }


  function origemRelatorioLabel(origem: string): string {
    const labels: Record<string, string> = {
      importado_csv: 'Importado',
      manual: 'Novo registro',
      sistema_antigo: 'Sistema antigo',
      conciliacao: 'Conferência'
    };
    return labels[origem] || origem;
  }

  function statusRelatorioLabel(status: string): string {
    const labels: Record<string, string> = { pago: 'Pago', parcial: 'Parcial', pendente: 'Pendente', cancelado: 'Cancelado' };
    return labels[status] || status;
  }

  async function renderRelatoriosScreen(): Promise<string> {
    const relatorio = await relatorioOperacional.execute(filtrosRelatorios);
    const avisos = relatorio.avisos.length
      ? `<div class="toast">${relatorio.avisos.map(aviso => escapeHtml(aviso)).join('<br />')}</div>`
      : '';
    const statusRows = relatorio.statusFinanceiro.map(linha => `<tr><td>${escapeHtml(statusRelatorioLabel(linha.status))}</td><td>${linha.quantidade}</td><td>${dinheiro(linha.total)}</td></tr>`).join('');
    const origemRows = relatorio.origem.map(linha => `<tr><td>${escapeHtml(origemRelatorioLabel(linha.origem))}</td><td>${linha.quantidade}</td><td>${dinheiro(linha.total)}</td></tr>`).join('');
    return `<section class="kzera-screen" data-testid="relatorios-operacionais">
      <header class="kzera-operational-header"><div class="kzera-operational-title"><span class="eyebrow">Relatórios</span><h1>Visão rápida do trabalho</h1></div></header>
      <p class="form-hint">Relatórios simples para conferir dinheiro, cadastros e estoque atual. Operação comercial completa entra aqui quando o módulo principal existir.</p>
      ${mensagemRelatorios ? `<div class="toast">${escapeHtml(mensagemRelatorios)}</div>` : ''}
      ${avisos}
      <form class="kzera-card soft-card" data-filtros-relatorios>
        <h3>Filtrar período</h3>
        <div class="import-grid two-cols">
          <label><span>De</span><input type="date" name="dataInicio" value="${escapeHtml(filtrosRelatorios.dataInicio || '')}" /></label>
          <label><span>Até</span><input type="date" name="dataFim" value="${escapeHtml(filtrosRelatorios.dataFim || '')}" /></label>
          <label><span>Tipo</span><select name="origem"><option value="todas" ${filtrosRelatorios.origem === 'todas' ? 'selected' : ''}>Todas</option><option value="importado_csv" ${filtrosRelatorios.origem === 'importado_csv' ? 'selected' : ''}>Importado</option><option value="manual" ${filtrosRelatorios.origem === 'manual' ? 'selected' : ''}>Novo registro</option><option value="sistema_antigo" ${filtrosRelatorios.origem === 'sistema_antigo' ? 'selected' : ''}>Sistema antigo</option><option value="conciliacao" ${filtrosRelatorios.origem === 'conciliacao' ? 'selected' : ''}>Conferência</option></select></label>
          <label><span>Status</span><select name="statusFinanceiro"><option value="todos" ${filtrosRelatorios.statusFinanceiro === 'todos' ? 'selected' : ''}>Todos</option><option value="pago" ${filtrosRelatorios.statusFinanceiro === 'pago' ? 'selected' : ''}>Pago</option><option value="parcial" ${filtrosRelatorios.statusFinanceiro === 'parcial' ? 'selected' : ''}>Parcial</option><option value="pendente" ${filtrosRelatorios.statusFinanceiro === 'pendente' ? 'selected' : ''}>Pendente</option><option value="cancelado" ${filtrosRelatorios.statusFinanceiro === 'cancelado' ? 'selected' : ''}>Cancelado</option></select></label>
        </div>
        <div class="compact-actions"><button class="icon-button text-icon primary-icon" type="submit">Atualizar</button><button class="icon-button text-icon" type="button" data-limpar-filtros-relatorios>Limpar filtros</button></div>
      </form>
      <section class="kzera-card soft-card" aria-label="Resumo financeiro">
        <h3>Dinheiro do período</h3>
        <div class="relatorio-resumo-grid">
          <span>Registros: ${relatorio.financeiro.totalTransacoes}</span>
          <span>Faturamento: ${dinheiro(relatorio.financeiro.faturamento)}</span>
          <span>Pago: ${dinheiro(relatorio.financeiro.valorPago)}</span>
          <span>Pendente: ${dinheiro(relatorio.financeiro.valorPendente)}</span>
          <span>Custo: ${dinheiro(relatorio.financeiro.custo)}</span>
          <span>Lucro: ${dinheiro(relatorio.financeiro.lucro)}</span>
          <span>Média por registro: ${dinheiro(relatorio.financeiro.ticketMedio)}</span>
        </div>
      </section>
      <section class="kzera-card soft-card" aria-label="Cadastros e estoque">
        <h3>Cadastros e estoque</h3>
        <div class="relatorio-resumo-grid">
          <span>Perfis ativos: ${relatorio.cadastros.perfisAtivos}</span>
          <span>Perfis arquivados: ${relatorio.cadastros.perfisArquivados}</span>
          <span>Itens ativos: ${relatorio.cadastros.itensAtivos}</span>
          <span>Itens arquivados: ${relatorio.cadastros.itensArquivados}</span>
          <span>Itens com estoque: ${relatorio.estoque.itensComEstoque}</span>
          <span>Itens sem estoque: ${relatorio.estoque.itensSemEstoque}</span>
          <span>Variações ativas: ${relatorio.estoque.variacoesAtivas}</span>
          <span>Estoques ativos: ${relatorio.estoque.lotesAtivos}</span>
        </div>
      </section>
      <details class="inline-details"><summary>Ver quebras do dinheiro</summary>
        <div class="kzera-card soft-card">
          <h3>Por status</h3>
          <table class="kzera-simple-table"><thead><tr><th>Status</th><th>Registros</th><th>Total</th></tr></thead><tbody>${statusRows}</tbody></table>
          <h3>Por tipo de origem</h3>
          <table class="kzera-simple-table"><thead><tr><th>Tipo</th><th>Registros</th><th>Total</th></tr></thead><tbody>${origemRows}</tbody></table>
        </div>
      </details>
    </section>`;
  }

  function bindRelatoriosFilters(): void {
    const form = rootRef?.querySelector<HTMLFormElement>('[data-filtros-relatorios]');
    form?.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(form);
      filtrosRelatorios = {
        dataInicio: String(data.get('dataInicio') || ''),
        dataFim: String(data.get('dataFim') || ''),
        origem: String(data.get('origem') || 'todas') as NonNullable<RelatorioFiltroOperacional['origem']>,
        statusFinanceiro: String(data.get('statusFinanceiro') || 'todos') as NonNullable<RelatorioFiltroOperacional['statusFinanceiro']>
      };
      mensagemRelatorios = 'Relatórios atualizados.';
      await render();
    });
    rootRef?.querySelector('[data-limpar-filtros-relatorios]')?.addEventListener('click', async () => {
      filtrosRelatorios = { dataInicio: '', dataFim: '', origem: 'todas', statusFinanceiro: 'todos' };
      mensagemRelatorios = 'Filtros limpos.';
      await render();
    });
  }

  function bindTransacoesFilters(): void {
    const form = rootRef?.querySelector<HTMLFormElement>('[data-filtros-financeiros]');
    form?.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(form);
      filtrosFinanceiros = {
        dataInicio: String(data.get('dataInicio') || ''),
        dataFim: String(data.get('dataFim') || ''),
        perfil: String(data.get('perfil') || ''),
        metodo: String(data.get('metodo') || ''),
        origem: String(data.get('origem') || 'todas'),
        statusFinanceiro: (String(data.get('statusFinanceiro') || 'todos') as 'todos' | 'pago' | 'parcial' | 'pendente' | 'cancelado')
      };
      mensagemTransacoes = 'Filtros aplicados.';
      await render();
    });
    rootRef?.querySelector('[data-limpar-filtros-financeiros]')?.addEventListener('click', async () => {
      filtrosFinanceiros = { dataInicio: '', dataFim: '', perfil: '', metodo: '', origem: 'todas', statusFinanceiro: 'todos' };
      mensagemTransacoes = 'Filtros limpos.';
      await render();
    });
  }

  /**
   * Verifica se é uma nova sessão (aba fechada e reaberta).
   * Usa sessionStorage como flag: presente = mesma sessão, ausente = sessão nova.
   */
  function isNovaSessao(): boolean {
    if (typeof sessionStorage === 'undefined') return false;
    const flag = sessionStorage.getItem(SESSION_FLAG_KEY);
    if (!flag) {
      sessionStorage.setItem(SESSION_FLAG_KEY, '1');
      return true;
    }
    return false;
  }

  /**
   * Verifica rascunhos de importação pendentes e sinaliza o modal,
   * mas apenas uma vez por sessão e apenas em sessão nova.
   */
  async function verificarRascunhosRetomada(): Promise<void> {
    if (rascunhosVerificados) return;
    rascunhosVerificados = true;

    const novaSessao = isNovaSessao();
    if (!novaSessao) return;

    try {
      const lista = await importacaoRascunho.listar();
      if (lista.length > 0) {
        rascunhosRetomada = lista;
        modalRetomadaVisivel = true;
      }
    } catch {
      // best-effort: se não conseguiu ler, não bloqueia o app
    }
  }

  function labelTelaRascunho(rascunho: RascunhoImportacao): string {
    if (rascunho.tipo === 'perfis') return `Importação de perfis${rascunho.previewCount ? ` (${rascunho.previewCount} registros na prévia)` : ''}`;
    if (rascunho.tipo === 'itens') return `Importação de itens${rascunho.previewCount ? ` (${rascunho.previewCount} registros na prévia)` : ''}`;
    return 'Importação de transações financeiras';
  }

  function renderModalRetomada(): string {
    if (!modalRetomadaVisivel || rascunhosRetomada.length === 0) return '';
    const linhas = rascunhosRetomada
      .map(r => `<li>${escapeHtml(labelTelaRascunho(r))}</li>`)
      .join('');
    return `<div class="kzera-modal-backdrop" data-testid="modal-retomada-importacao" role="dialog" aria-modal="true" aria-label="Importação em andamento">
      <section class="kzera-modal-card">
        <span class="eyebrow">Importação em andamento</span>
        <h2>Continuar de onde parou?</h2>
        <p>Você tinha uma importação em andamento:</p>
        <ul class="compact-list">${linhas}</ul>
        <p class="form-hint">Selecione "Sim" para navegar até a importação ou "Não" para descartar.</p>
        <div class="backup-modal-actions">
          <button type="button" class="icon-button-text primary" data-retomada-sim aria-label="Continuar importação" title="Continuar importação">Sim, continuar</button>
          <button type="button" class="icon-button-text" data-retomada-nao aria-label="Descartar rascunho" title="Descartar rascunho">Não, descartar</button>
        </div>
      </section>
    </div>`;
  }

  function telaParaRascunho(rascunho: RascunhoImportacao): Screen {
    if (rascunho.tipo === 'perfis') return 'importacao-perfis';
    if (rascunho.tipo === 'itens') return 'importacao-itens';
    return 'importacao-transacoes';
  }

  function bindModalRetomada(): void {
    rootRef?.querySelector('[data-retomada-sim]')?.addEventListener('click', async () => {
      modalRetomadaVisivel = false;
      const primeiro = rascunhosRetomada[0];
      if (primeiro) {
        if (primeiro.tipo === 'perfis' && primeiro.previewRegistros?.length) {
          await perfilApp.restaurarPreview(primeiro.previewRegistros);
        }
        await navigate(telaParaRascunho(primeiro));
      } else {
        await render();
      }
    });
    rootRef?.querySelector('[data-retomada-nao]')?.addEventListener('click', async () => {
      modalRetomadaVisivel = false;
      rascunhosRetomada = [];
      // Descarta rascunhos de perfis e itens (preview em memória já foi descartado na nova sessão)
      try { await perfilApp.descartarRascunho(); } catch { /* best-effort */ }
      try { await itemApp.descartarRascunho(); } catch { /* best-effort */ }
      try { await importacaoRascunho.descartarTodos(); } catch { /* best-effort */ }
      await render();
    });
  }

  async function renderUnlocked(): Promise<void> {
    if (!rootRef) return;
    const savedRule = await ensureCodigoPerfilRule();
    if (!savedRule) {
      currentDraftRule = currentDraftRule || cloneRule(cachedIdentityRule);
      rootRef.innerHTML = codigoPerfilConfigScreen(currentDraftRule, erro, 'onboarding');
      await bindCodigoPerfilForm();
      return;
    }

    const perfisLista = await perfis.list();
    const itensLista = await itens.list();

    if (currentScreen === 'home') {
      const perfisAtivos = perfisLista.filter(perfil => perfil.status === 'ativo').length;
      const itensAtivos = itensLista.filter(item => item.status === 'ativo').length;
      rootRef.innerHTML = `<div class="kzera-mobile-shell kzera-home-shell">${renderDrawer()}
        <header class="kzera-home-topbar" aria-label="Início">
          <div class="kzera-home-brand"><div><strong>Hoje no app</strong></div></div>
        </header>
        <main class="kzera-home-main" aria-label="Ações do início">
          <section class="kzera-home-primary" aria-label="Ações principais">
            <button type="button" class="home-action-card" data-nav="perfis" aria-label="Abrir perfis" title="Abrir perfis"><span>Perfis</span><strong>${perfisAtivos}</strong><small>Abrir</small></button>
            <button type="button" class="home-action-card" data-nav="itens" aria-label="Abrir itens" title="Abrir itens"><span>Itens</span><strong>${itensAtivos}</strong><small>Abrir</small></button>
          </section>
          <section class="kzera-home-actions" aria-label="Criar novo registro">
            <button class="icon-button text-icon" data-quick="novo-perfil" aria-label="Novo perfil" title="Novo perfil">+ Perfil</button>
            <button class="icon-button text-icon" data-quick="novo-item" aria-label="Novo item" title="Novo item">+ Item</button>
          </section>
          <details class="kzera-utility-panel kzera-home-more"><summary>Mais</summary><div class="kzera-home-more-grid">
            <button class="icon-button text-icon" data-nav="importacao-perfis" aria-label="Importar Perfis" title="Importar Perfis">Importar Perfis</button>
            <button class="icon-button text-icon" data-nav="importacao-itens" aria-label="Importar Itens" title="Importar Itens">Importar Itens</button>
            <button class="icon-button text-icon" data-nav="importacao-transacoes" aria-label="Importar Transações" title="Importar Transações">Importar Transações</button>
            <button class="icon-button text-icon" data-nav="relatorios" aria-label="Relatórios" title="Relatórios">Relatórios</button>
            <button class="icon-button text-icon" data-nav="codigo" aria-label="Código do Perfil" title="Código do Perfil">Código</button>
            <button class="icon-button text-icon" data-nav="configuracoes" aria-label="Configurações" title="Configurações">Configurações</button>
          </div></details>
          ${backupDecision?.required ? `<section class="kzera-utility-panel kzera-home-status" aria-label="Status operacional"><strong>Cópia de segurança pendente</strong><span>Salve uma cópia de segurança para proteger seu trabalho.</span></section>` : ''}
        </main>
      </div>`;
    } else {
      const title = currentScreen === 'perfis' ? 'Perfis' : currentScreen === 'itens' ? 'Itens' : currentScreen === 'transacoes' ? 'Dinheiro' : currentScreen === 'relatorios' ? 'Relatórios' : currentScreen === 'codigo' ? 'Código do Perfil' : currentScreen === 'importacao-perfis' ? 'Importar Perfis' : currentScreen === 'importacao-itens' ? 'Importar Itens' : currentScreen === 'importacao-transacoes' ? 'Importar Transações' : currentScreen === 'fidelizacao-config' ? 'Config. Fidelidade' : currentScreen === 'fidelizacao-dashboard' ? 'Dashboard Fidelidade' : 'Configurações';
      rootRef.innerHTML = `<div class="app-frame">${renderDrawer()}<main id="kzera-main" aria-label="${title}"></main></div>`;
    }

    await refreshBackupDecision();
    await verificarRascunhosRetomada();
    const telaCriticaImportacao = currentScreen === 'importacao-perfis' || currentScreen === 'importacao-itens' || currentScreen === 'importacao-transacoes';
    if (backupDecision?.required && rootRef && !telaCriticaImportacao) { rootRef.insertAdjacentHTML('beforeend', renderBackupModal()); bindBackupModal(); }
    if (modalRetomadaVisivel && rootRef) { rootRef.insertAdjacentHTML('beforeend', renderModalRetomada()); bindModalRetomada(); }
    bindNavigation();
    const appRoot = rootRef.querySelector('#kzera-main') as HTMLElement | null;
    if (currentScreen !== 'home') {
      if (!appRoot) throw new Error('Elemento #kzera-main não encontrado.');
      if (currentScreen === 'perfis') await perfilApp.mount(appRoot);
      if (currentScreen === 'itens') await itemApp.mount(appRoot);
      if (currentScreen === 'codigo') { currentDraftRule = currentDraftRule || cloneRule(savedRule || cachedIdentityRule); appRoot.innerHTML = codigoPerfilConfigScreen(currentDraftRule, erro, 'authenticated'); await bindCodigoPerfilForm(); }
      if (currentScreen === 'transacoes') { appRoot.innerHTML = await renderTransacoesScreen(); bindTransacoesFilters(); }
      if (currentScreen === 'relatorios') { appRoot.innerHTML = await renderRelatoriosScreen(); bindRelatoriosFilters(); }
      if (currentScreen === 'importacao-perfis') await perfilApp.mountImportacao(appRoot);
      if (currentScreen === 'importacao-itens') await itemApp.mountImportacao(appRoot);
      if (currentScreen === 'importacao-transacoes') await importacaoTransacoesFinanceiroApp.mount(appRoot);
      if (currentScreen === 'configuracoes') await configuracoesApp.mount(appRoot);
      if (currentScreen === 'fidelizacao-config') await fidelizacaoConfigApp.mount(appRoot);
      if (currentScreen === 'fidelizacao-dashboard') await fidelizacaoDashboardApp.mount(appRoot);
    }

    if (!listenersBound) { rootRef.addEventListener('pointerdown', touchSession, { passive: true }); rootRef.addEventListener('keydown', touchSession); listenersBound = true; }
    scheduleAttentionCheck();
    scheduleBackupCheck();
  }

  async function render(): Promise<void> {
    if (!rootRef) return;
    const authState = await obterAuthState.execute();
    if (authState === 'not_initialized') {
      rootRef.innerHTML = authShell(`<form class="auth-form" data-testid="setup-form"><h2>Criar senha</h2><p>Escolha uma senha que você consiga digitar mesmo no fim do dia. Ela protege este aparelho.</p>${passwordField('setup-password', 'Senha', 'new-password')}${passwordField('setup-confirmation', 'Confirmar senha', 'new-password')}<button type="submit">Criar acesso</button></form>`, erro);
      bindPasswordToggles(rootRef);
      rootRef.querySelector('[data-testid="setup-form"]')?.addEventListener('submit', async event => {
        event.preventDefault(); erro = '';
        const password = (rootRef?.querySelector('#setup-password') as HTMLInputElement | null)?.value || '';
        const confirmation = (rootRef?.querySelector('#setup-confirmation') as HTMLInputElement | null)?.value || '';
        try { await primeiroAcesso.execute({ password, confirmation }); await login.execute({ password }); autoFaceIdTried = false; currentScreen = 'codigo'; await render(); }
        catch (error) { erro = error instanceof Error ? error.message : 'Não foi possível configurar o acesso.'; await render(); }
      });
      return;
    }
    if (authState === 'faceid_required') {
      rootRef.innerHTML = authShell(`<form class="auth-form" data-testid="attention-form"><h2>Confirme que é você</h2><p>Vou tentar o Face ID automaticamente. Se o iPhone não aceitar, use a senha abaixo sem ficar presa aqui.</p><button type="button" data-testid="attention-button">Tentar de novo</button>${passwordField('attention-password', 'Entrar com senha')}<button type="submit" data-testid="attention-password-button">Entrar com senha</button></form>`, erro);
      bindPasswordToggles(rootRef);
      void confirmAttentionAutomatically();
      rootRef.querySelector('[data-testid="attention-button"]')?.addEventListener('click', async () => { erro = ''; autoFaceIdTried = false; try { await confirmarAtencao.execute(); autoFaceIdTried = false; await render(); } catch (error) { erro = error instanceof Error ? error.message : 'Não foi possível confirmar a identidade.'; await render(); } });
      rootRef.querySelector('[data-testid="attention-form"]')?.addEventListener('submit', async event => {
        event.preventDefault();
        erro = '';
        const password = (rootRef?.querySelector('#attention-password') as HTMLInputElement | null)?.value || '';
        try { await login.execute({ password }); autoFaceIdTried = false; await configureFaceIdAutomatically(); await render(); }
        catch (error) { erro = error instanceof Error ? error.message : 'Senha inválida.'; await render(); }
      });
      return;
    }
    if (authState !== 'unlocked') {
      rootRef.innerHTML = authShell(`<form class="auth-form" data-testid="login-form"><h2>Entrar</h2><p>Digite a senha. Sem pressa.</p>${passwordField('login-password', 'Senha')}<button type="submit">Entrar</button></form>`, erro);
      bindPasswordToggles(rootRef);
      rootRef.querySelector('[data-testid="login-form"]')?.addEventListener('submit', async event => { event.preventDefault(); erro = ''; const password = (rootRef?.querySelector('#login-password') as HTMLInputElement | null)?.value || ''; try { await login.execute({ password }); autoFaceIdTried = false; await configureFaceIdAutomatically(); await render(); } catch (error) { erro = error instanceof Error ? error.message : 'Senha inválida.'; await render(); } });
      return;
    }
    await renderUnlocked();
  }

  return { async mount(root: HTMLElement): Promise<void> { rootRef = root; await uxTracker.mount(root); bindHistory(); bindSwipeNavigation(); bindAppLifecycle(); if (typeof window !== 'undefined' && window.history?.replaceState) window.history.replaceState({ screen: currentScreen }, '', `#${currentScreen}`); await render(); } };
}
