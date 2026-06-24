import type { PrepararImportacaoTransacoesUseCase } from '../../application/importacao/PrepararImportacaoTransacoesUseCase';
import type { PrepararImportacaoFinanceiraUseCase } from '../../application/importacao/PrepararImportacaoFinanceiraUseCase';
import type { ListarStagingImportacaoUseCase, StagingImportacaoResumo } from '../../application/importacao/ListarStagingImportacaoUseCase';
import type { ConciliarTransacoesFinanceiroUseCase, ResultadoConciliacaoImportacao } from '../../application/importacao/ConciliarTransacoesFinanceiroUseCase';
import type { ResolverPendenciaImportacaoUseCase } from '../../application/importacao/ResolverPendenciaImportacaoUseCase';
import type { ConfirmarImportacaoHistoricaFinanceiraUseCase, ConfirmarImportacaoHistoricaFinanceiraResultado } from '../../application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase';
import { releaseObject } from '../../runtime/RuntimeCleanup';
import type { RegistroImportacaoFinanceira, RegistroImportacaoTransacao } from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

export interface ImportacaoTransacoesFinanceiroDeps {
  prepararTransacoes: PrepararImportacaoTransacoesUseCase;
  prepararFinanceiro: PrepararImportacaoFinanceiraUseCase;
  listarStaging: ListarStagingImportacaoUseCase;
  conciliar: ConciliarTransacoesFinanceiroUseCase;
  resolverPendencia: ResolverPendenciaImportacaoUseCase;
  confirmarHistoricoFinanceiro: ConfirmarImportacaoHistoricaFinanceiraUseCase;
  onRascunhoAtualizado?: (acao: 'salvar' | 'descartar') => Promise<void>;
}

type RegistroVisual = {
  tipo: 'transacao' | 'financeiro';
  id: string;
  linha: number;
  titulo: string;
  meta: string;
  prioridade: 'warn' | 'danger';
  acaoPrimaria: string;
  acaoSecundaria: string;
};

export class ImportacaoTransacoesFinanceiroView {
  private root: HTMLElement | null = null;
  private mensagem = '';
  private conciliacao: ResultadoConciliacaoImportacao | null = null;
  private ultimaConfirmacao: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private previaConfirmacao: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private lotesConfirmacao: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private confirmacaoArmada = false;

  constructor(private readonly deps: ImportacaoTransacoesFinanceiroDeps) {}

  release(): void {
    releaseObject(this.conciliacao);
    releaseObject(this.ultimaConfirmacao);
    releaseObject(this.previaConfirmacao);
    releaseObject(this.lotesConfirmacao);
    this.conciliacao = null;
    this.ultimaConfirmacao = null;
    this.previaConfirmacao = null;
    this.lotesConfirmacao = null;
    this.mensagem = '';
    this.confirmacaoArmada = false;
    if (this.root) this.root.innerHTML = '';
  }

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    await this.render();
  }

  private escape(value: unknown): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private dinheiro(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  }

  private compacto(valor: number): string {
    const abs = Math.abs(valor || 0);
    if (abs >= 1000) return `${(valor / 1000).toFixed(1).replace('.', ',')}k`;
    return String(Math.round(valor || 0));
  }

  private somaTransacoes(staging: StagingImportacaoResumo, campo: 'total' | 'lucro' | 'custo' | 'valorPago'): number {
    return staging.registrosTransacoes.reduce((total, registro) => total + Number(registro.dadosNormalizados?.[campo] || 0), 0);
  }

  private pendenciasTotais(staging: StagingImportacaoResumo): number {
    return staging.resumoTransacoes.pendentes + staging.resumoFinanceiro.pendentes + staging.resumoTransacoes.erros + staging.resumoFinanceiro.erros;
  }

  private confirmaveisTotais(staging: StagingImportacaoResumo): number {
    return staging.resumoTransacoes.validos + staging.resumoFinanceiro.validos;
  }

  private ultimoNomeArquivo(staging: StagingImportacaoResumo): string {
    const loteTransacoes = staging.lotesTransacoes[staging.lotesTransacoes.length - 1];
    const loteFinanceiro = staging.lotesFinanceiros[staging.lotesFinanceiros.length - 1];
    return loteTransacoes?.nomeArquivo || loteFinanceiro?.nomeArquivo || 'Nenhum arquivo';
  }

  private tituloPendencia(registro: RegistroImportacaoTransacao | RegistroImportacaoFinanceira): string {
    const tipo = registro.pendencias[0]?.tipo;
    if (tipo === 'cliente_nao_encontrado') return 'Perfil não encontrado';
    if (tipo === 'item_nao_encontrado') return 'Item não encontrado';
    if (tipo === 'transacao_nao_encontrada') return 'Transação não encontrada';
    if (tipo === 'financeiro_divergente') return 'Possível duplicidade';
    if (tipo === 'valor_invalido') return 'Valor inválido';
    return registro.pendencias[0]?.mensagem || 'Revisar linha';
  }

  private metaTransacao(registro: RegistroImportacaoTransacao): string {
    const nome = registro.clienteNomeImportado || registro.dadosNormalizados?.clienteNome || 'Sem perfil';
    const valor = registro.dadosNormalizados?.total !== undefined ? this.dinheiro(registro.dadosNormalizados.total) : 'sem valor';
    const pagamento = registro.dadosNormalizados?.tiposPagamento?.[0] || 'pagamento';
    return `${nome} · ${valor} · ${pagamento}`;
  }

  private metaFinanceiro(registro: RegistroImportacaoFinanceira): string {
    const nome = registro.clienteNomeImportado || registro.dadosNormalizados?.clienteNome || 'Sem perfil';
    const valor = registro.dadosNormalizados?.valor !== undefined ? this.dinheiro(registro.dadosNormalizados.valor) : 'sem valor';
    const ref = registro.numeroTransacaoReferenciado ? `#${registro.numeroTransacaoReferenciado}` : 'sem transação';
    return `${nome} · ${valor} · ${ref}`;
  }

  private registrosPendentes(staging: StagingImportacaoResumo): RegistroVisual[] {
    const transacoes = staging.registrosTransacoes
      .filter(registro => registro.status !== 'validado' && registro.status !== 'confirmado')
      .map<RegistroVisual>(registro => {
        const item = registro.pendencias.some(p => p.tipo === 'item_nao_encontrado');
        return {
          tipo: 'transacao',
          id: registro.id,
          linha: registro.linha,
          titulo: this.tituloPendencia(registro),
          meta: this.metaTransacao(registro),
          prioridade: item ? 'danger' : 'warn',
          acaoPrimaria: item ? 'Mapear' : 'Vincular',
          acaoSecundaria: item ? 'Abrir cadastro' : 'Ignorar'
        };
      });

    const financeiro = staging.registrosFinanceiros
      .filter(registro => registro.status !== 'validado' && registro.status !== 'confirmado')
      .map<RegistroVisual>(registro => ({
        tipo: 'financeiro',
        id: registro.id,
        linha: registro.linha,
        titulo: this.tituloPendencia(registro),
        meta: this.metaFinanceiro(registro),
        prioridade: registro.status === 'erro' ? 'danger' : 'warn',
        acaoPrimaria: 'Comparar',
        acaoSecundaria: 'Remover'
      }));

    return [...transacoes, ...financeiro].slice(-3).reverse();
  }

  private css(): string {
    return `<style data-import-transacoes-mockup-css>
      .import-transacoes-mockup { --purple:#7B4DFF; --purple-dark:#5B2ECC; --bg:#F7F3FF; --white:#fff; --text:#120B35; --muted:#766BA8; --border:#DDD6EE; --green:#087A36; --green-bg:#DDF8E7; --green-bdr:#A8E8BF; --danger:#C62828; --danger-bg:#FFF5F5; --danger-bdr:#FFCDD2; --warn:#8B4500; --warn-bg:#FFF8E1; --warn-bdr:#FFD54F; background:var(--bg); color:var(--text); min-height:100vh; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif; }
      .import-transacoes-mockup * { box-sizing:border-box; }
      .import-transacoes-mockup .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
      .import-transacoes-mockup .app-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px 12px; background:#120B35; position:sticky; top:0; z-index:10; }
      .import-transacoes-mockup .hamburger { display:flex; flex-direction:column; gap:4px; width:28px; height:28px; background:none; border:none; padding:2px; cursor:pointer; justify-content:center; }
      .import-transacoes-mockup .hamburger span { display:block; width:18px; height:2px; border-radius:2px; background:#fff; }
      .import-transacoes-mockup .header-title { font-size:16px; font-weight:800; color:#fff; letter-spacing:-0.02em; }
      .import-transacoes-mockup .btn-header { background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.22); border-radius:10px; color:#fff; font-size:13px; font-weight:800; font-family:inherit; padding:6px 12px; cursor:pointer; }
      .import-transacoes-mockup .screen { padding:20px 16px 96px; }
      .import-transacoes-mockup .section-head { font-size:13px; font-weight:900; color:var(--muted); text-transform:uppercase; letter-spacing:0.07em; margin-bottom:10px; }
      .import-transacoes-mockup .card, .import-transacoes-mockup .stat-card, .import-transacoes-mockup .issue-card { background:var(--white); border:1px solid var(--border); box-shadow:0 2px 10px rgba(30,14,70,0.06); }
      .import-transacoes-mockup .card { border-radius:18px; padding:16px; margin-bottom:14px; }
      .import-transacoes-mockup .file-row, .import-transacoes-mockup .issue-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
      .import-transacoes-mockup .file-name { font-size:15px; font-weight:800; letter-spacing:-0.01em; }
      .import-transacoes-mockup .file-meta, .import-transacoes-mockup .issue-meta { font-size:12px; font-weight:700; color:var(--muted); margin-top:3px; line-height:1.35; }
      .import-transacoes-mockup .upload-actions, .import-transacoes-mockup .issue-actions, .import-transacoes-mockup .stat-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
      .import-transacoes-mockup .upload-actions, .import-transacoes-mockup .issue-actions { margin-top:12px; gap:8px; }
      .import-transacoes-mockup .badge { display:inline-flex; align-items:center; justify-content:center; white-space:nowrap; border-radius:8px; padding:4px 9px; font-size:12px; font-weight:900; border:1px solid var(--border); color:var(--muted); background:#F0EDF8; }
      .import-transacoes-mockup .badge.ok { color:var(--green); background:var(--green-bg); border-color:var(--green-bdr); }
      .import-transacoes-mockup .badge.warn { color:var(--warn); background:var(--warn-bg); border-color:var(--warn-bdr); }
      .import-transacoes-mockup .badge.danger { color:var(--danger); background:var(--danger-bg); border-color:var(--danger-bdr); }
      .import-transacoes-mockup .stat-row { margin-bottom:14px; }
      .import-transacoes-mockup .stat-card { border-radius:20px; padding:16px; }
      .import-transacoes-mockup .stat-card.warn { background:var(--warn-bg); border-color:var(--warn-bdr); }
      .import-transacoes-mockup .stat-card.ok { background:var(--green-bg); border-color:var(--green-bdr); }
      .import-transacoes-mockup .stat-label { font-size:12px; font-weight:800; color:var(--muted); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:10px; line-height:1.3; min-height:32px; }
      .import-transacoes-mockup .stat-value { font-size:40px; font-weight:900; letter-spacing:-0.03em; line-height:1; color:var(--text); }
      .import-transacoes-mockup .stat-card.ok .stat-value { color:var(--green); }
      .import-transacoes-mockup .stat-card.warn .stat-value { color:var(--warn); }
      .import-transacoes-mockup .tabs { display:flex; overflow-x:auto; scrollbar-width:none; margin-bottom:12px; border-bottom:1px solid var(--border); }
      .import-transacoes-mockup .tabs::-webkit-scrollbar { display:none; }
      .import-transacoes-mockup .tab { flex-shrink:0; padding:8px 14px; font-size:14px; font-weight:800; color:var(--muted); background:none; border:none; border-bottom:2.5px solid transparent; cursor:pointer; font-family:inherit; white-space:nowrap; margin-bottom:-1px; }
      .import-transacoes-mockup .tab.active { color:var(--purple-dark); border-bottom-color:var(--purple); }
      .import-transacoes-mockup .issue-list { display:flex; flex-direction:column; gap:8px; }
      .import-transacoes-mockup .issue-card { border-radius:16px; padding:14px; }
      .import-transacoes-mockup .issue-title { font-size:15px; font-weight:900; letter-spacing:-0.02em; line-height:1.2; margin:0; }
      .import-transacoes-mockup .btn { min-height:44px; border-radius:13px; border:1px solid var(--border); font-family:inherit; font-size:14px; font-weight:800; cursor:pointer; padding:0 10px; }
      .import-transacoes-mockup .btn-soft { color:var(--purple-dark); background:#F5F0FF; border-color:#C4BAE4; }
      .import-transacoes-mockup .btn-danger { color:var(--danger); background:var(--danger-bg); border-color:var(--danger-bdr); }
      .import-transacoes-mockup .toast { margin-bottom:12px; border:1px solid var(--green-bdr); background:var(--green-bg); color:var(--green); border-radius:14px; padding:10px 12px; font-size:13px; font-weight:800; }
      .import-transacoes-mockup .bottom-bar { position:fixed; left:0; right:0; bottom:0; padding:12px 16px 18px; background:linear-gradient(180deg,rgba(247,243,255,0.20),rgba(247,243,255,0.98) 35%); backdrop-filter:blur(10px); border-top:1px solid rgba(221,214,238,0.75); }
      .import-transacoes-mockup .btn-primary { width:100%; height:54px; border-radius:16px; border:none; background:linear-gradient(180deg,var(--purple) 0%,var(--purple-dark) 100%); color:#fff; font-size:16px; font-weight:800; font-family:inherit; cursor:pointer; box-shadow:0 8px 24px rgba(91,46,204,0.35); }
    </style>`;
  }

  private uploadForms(staging: StagingImportacaoResumo): string {
    const totalLinhas = staging.totalRegistrosTransacoes + staging.totalRegistrosFinanceiros;
    return `<section class="card">
      <div class="file-row"><div><div class="file-name">${this.escape(this.ultimoNomeArquivo(staging))}</div><div class="file-meta">${totalLinhas} linhas · ${this.dinheiro(this.somaTransacoes(staging, 'total'))}</div></div><span class="badge warn">Prévia</span></div>
      <div class="upload-actions">
        <form data-import-transacoes><input class="sr-only" name="nomeArquivo" value="transacoes.csv" data-nome-arquivo-transacoes /><input class="sr-only" type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain" data-file-upload-transacoes aria-label="Escolher arquivo de transações" /><textarea class="sr-only" name="conteudo" rows="1" data-conteudo-transacoes></textarea><button class="btn btn-soft" type="button" data-pick-transacoes>Transações</button><button class="sr-only" type="submit" data-submit-transacoes>Preparar transações</button></form>
        <form data-import-financeiro><input class="sr-only" name="nomeArquivo" value="financeiro.csv" data-nome-arquivo-financeiro /><input class="sr-only" type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain" data-file-upload-financeiro aria-label="Escolher arquivo financeiro" /><textarea class="sr-only" name="conteudo" rows="1" data-conteudo-financeiro></textarea><button class="btn btn-soft" type="button" data-pick-financeiro>Financeiro</button><button class="sr-only" type="submit" data-submit-financeiro>Preparar financeiro</button></form>
      </div>
    </section>`;
  }

  private resumoView(staging: StagingImportacaoResumo): string {
    return `<div class="section-head">Resumo</div><div class="stat-row"><div class="stat-card ok"><div class="stat-label">Confirmáveis</div><div class="stat-value">${this.confirmaveisTotais(staging)}</div></div><div class="stat-card warn"><div class="stat-label">Pendências</div><div class="stat-value">${this.pendenciasTotais(staging)}</div></div></div><div class="stat-row"><div class="stat-card"><div class="stat-label">Receita</div><div class="stat-value">${this.escape(this.compacto(this.somaTransacoes(staging, 'total')))}</div></div><div class="stat-card"><div class="stat-label">Lucro</div><div class="stat-value">${this.escape(this.compacto(this.somaTransacoes(staging, 'lucro')))}</div></div></div>`;
  }

  private tabs(staging: StagingImportacaoResumo): string {
    const r = staging.resumoTransacoes;
    const f = staging.resumoFinanceiro;
    return `<div class="tabs"><button class="tab active">Todas ${this.pendenciasTotais(staging)}</button><button class="tab">Perfil ${r.pendentesPerfil + f.pendentesPerfil}</button><button class="tab">Item ${r.pendentesItem + f.pendentesItem}</button><button class="tab">Valor ${r.erros + f.erros}</button><button class="tab">Financeiro ${r.pendentesFinanceiro + f.pendentesFinanceiro}</button></div>`;
  }

  private issueCard(item: RegistroVisual): string {
    const resolver = `${item.tipo}:${item.id}`;
    const primary = item.acaoPrimaria === 'Comparar'
      ? `<button class="btn btn-soft" type="button" data-conciliar-importacao>${this.escape(item.acaoPrimaria)}</button>`
      : `<button class="btn btn-soft" type="button" data-resolver-revisao="${this.escape(resolver)}">${this.escape(item.acaoPrimaria)}</button>`;
    const secondary = item.acaoSecundaria === 'Abrir cadastro'
      ? `<button class="btn btn-soft" type="button" data-abrir-cadastro-item>Abrir cadastro</button>`
      : `<button class="btn btn-danger" type="button" data-resolver-ignorar="${this.escape(resolver)}">${this.escape(item.acaoSecundaria)}</button>`;
    return `<article class="issue-card"><div class="issue-top"><h3 class="issue-title">${this.escape(item.titulo)}</h3><span class="badge ${item.prioridade}">Linha ${this.escape(item.linha)}</span></div><p class="issue-meta">${this.escape(item.meta)}</p><div class="issue-actions">${primary}${secondary}</div></article>`;
  }

  private pendenciasView(staging: StagingImportacaoResumo): string {
    const pendencias = this.registrosPendentes(staging);
    const lista = pendencias.length ? pendencias.map(item => this.issueCard(item)).join('') : `<article class="issue-card"><div class="issue-top"><h3 class="issue-title">Sem pendências</h3><span class="badge ok">OK</span></div><p class="issue-meta">Tudo pronto para revisar.</p></article>`;
    return `<div class="section-head">Resolver</div>${this.tabs(staging)}<div class="issue-list">${lista}</div>`;
  }

  private conciliacaoResumo(): string {
    if (!this.conciliacao) return `<section class="card" data-testid="conciliacao-transacoes-financeiro"><div class="file-row"><div><div class="file-name">Pagamentos</div><div class="file-meta">Ainda não conferidos</div></div><button class="btn btn-soft" type="button" data-conciliar-importacao>Comparar</button></div></section>`;
    const r = this.conciliacao.resumo;
    return `<section class="card" data-testid="conciliacao-transacoes-financeiro"><div class="file-row"><div><div class="file-name">Pagamentos</div><div class="file-meta">${r.conciliados} ok · ${r.pendentes} pendentes · ${r.divergencias} diferenças</div></div><button class="btn btn-soft" type="button" data-conciliar-importacao>Atualizar</button></div></section>`;
  }

  private confirmacaoView(): string {
    const painel = this.previaConfirmacao || this.ultimaConfirmacao;
    if (!painel) return `<section class="card" data-testid="confirmacao-historico-financeiro"><div class="file-row"><div><div class="file-name">Confirmação</div><div class="file-meta">Aguardando revisão</div></div><button class="btn btn-soft" type="button" data-previsualizar-historico-financeiro>Revisar</button></div></section>`;
    const confirmar = this.previaConfirmacao && this.confirmacaoArmada ? `<button class="btn btn-soft" type="button" data-confirmar-historico-financeiro data-previa-id="${this.escape(this.previaConfirmacao.previaId)}">Confirmar</button>` : this.previaConfirmacao ? `<button class="btn btn-soft" type="button" data-armar-confirmacao-historico>Pronto</button>` : `<button class="btn btn-soft" type="button" data-previsualizar-historico-financeiro>Revisar</button>`;
    return `<section class="card" data-testid="confirmacao-historico-financeiro"><div class="file-row"><div><div class="file-name">Confirmação</div><div class="file-meta">${painel.transacoesPrevistas} registros · ${painel.registrosBloqueados} bloqueios</div></div>${confirmar}</div></section>`;
  }

  private retomadaView(): string {
    const pacote = this.lotesConfirmacao?.pacotesComFalha?.[0];
    if (!pacote) return '';
    return `<section class="card" data-testid="retomada-humana-confirmacao"><div class="file-row"><div><div class="file-name">Confirmação interrompida</div><div class="file-meta">${pacote.totalTransacoes} registros</div></div><button class="btn btn-soft" type="button" data-retomar-confirmacao-segura data-lote-confirmacao-id="${this.escape(pacote.loteConfirmacaoId)}">Abrir</button></div></section>`;
  }

  private template(staging: StagingImportacaoResumo): string {
    const pendentes = this.pendenciasTotais(staging);
    const bottomText = pendentes > 0 ? `Resolver ${pendentes} pendências` : 'Ver antes de confirmar';
    const bottomAction = pendentes > 0 ? 'data-conciliar-importacao' : 'data-previsualizar-historico-financeiro';
    return `<section class="import-transacoes-mockup" data-testid="importacao-transacoes-financeiro">${this.css()}<div class="app-header"><button class="hamburger" type="button" aria-label="Menu"><span></span><span></span><span></span></button><span class="header-title">Importar transações</span><button class="btn-header" type="button" data-novo-importacao>Novo</button></div><p class="sr-only">Nada vira registro definitivo aqui; nada baixa estoque.</p><div class="screen">${this.mensagem ? `<div class="toast">${this.escape(this.mensagem)}</div>` : ''}<div class="section-head">Arquivo</div>${this.uploadForms(staging)}${this.resumoView(staging)}${this.pendenciasView(staging)}${this.conciliacaoResumo()}${this.confirmacaoView()}${this.retomadaView()}</div><div class="bottom-bar"><button class="btn-primary" type="button" ${bottomAction}>${this.escape(bottomText)}</button></div></section>`;
  }

  private async render(): Promise<void> {
    if (!this.root) return;
    const [staging, lotes] = await Promise.all([this.deps.listarStaging.execute(), this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'listar_lotes' })]);
    this.lotesConfirmacao = lotes;
    this.root.innerHTML = this.template(staging);
    this.bind();
  }

  private bindFileUpload(seletor: string, nomeArquivoSeletor: string, conteudoSeletor: string, submitSeletor: string): void {
    const fileInput = this.root?.querySelector<HTMLInputElement>(seletor);
    if (!fileInput) return;
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const nomeInput = this.root?.querySelector<HTMLInputElement>(nomeArquivoSeletor);
      if (nomeInput) nomeInput.value = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        const textarea = this.root?.querySelector<HTMLTextAreaElement>(conteudoSeletor);
        if (textarea) textarea.value = String(reader.result || '');
        this.root?.querySelector<HTMLButtonElement>(submitSeletor)?.click();
      };
      reader.readAsText(file, 'UTF-8');
    });
  }

  private bind(): void {
    this.bindFileUpload('[data-file-upload-transacoes]', '[data-nome-arquivo-transacoes]', '[data-conteudo-transacoes]', '[data-submit-transacoes]');
    this.bindFileUpload('[data-file-upload-financeiro]', '[data-nome-arquivo-financeiro]', '[data-conteudo-financeiro]', '[data-submit-financeiro]');

    this.root?.querySelector('[data-novo-importacao]')?.addEventListener('click', () => this.root?.querySelector<HTMLInputElement>('[data-file-upload-transacoes]')?.click());
    this.root?.querySelector('[data-pick-transacoes]')?.addEventListener('click', () => this.root?.querySelector<HTMLInputElement>('[data-file-upload-transacoes]')?.click());
    this.root?.querySelector('[data-pick-financeiro]')?.addEventListener('click', () => this.root?.querySelector<HTMLInputElement>('[data-file-upload-financeiro]')?.click());

    this.root?.querySelector('[data-import-transacoes]')?.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget as HTMLFormElement);
      const conteudo = String(data.get('conteudo') || '');
      if (!conteudo.trim()) { this.mensagem = 'Arquivo vazio.'; await this.render(); return; }
      const resultado = await this.deps.prepararTransacoes.execute({ nomeArquivo: String(data.get('nomeArquivo') || 'transacoes.csv'), conteudo });
      this.mensagem = `Transações: ${resultado.resumo.total} linhas, ${resultado.resumo.pendentes} pendências.`;
      if (this.deps.onRascunhoAtualizado) { try { await this.deps.onRascunhoAtualizado('salvar'); } catch { /* best-effort */ } }
      await this.render();
    });

    this.root?.querySelector('[data-import-financeiro]')?.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget as HTMLFormElement);
      const conteudo = String(data.get('conteudo') || '');
      if (!conteudo.trim()) { this.mensagem = 'Arquivo vazio.'; await this.render(); return; }
      const resultado = await this.deps.prepararFinanceiro.execute({ nomeArquivo: String(data.get('nomeArquivo') || 'financeiro.csv'), conteudo });
      this.mensagem = `Financeiro: ${resultado.resumo.total} linhas, ${resultado.resumo.pendentes} pendências.`;
      if (this.deps.onRascunhoAtualizado) { try { await this.deps.onRascunhoAtualizado('salvar'); } catch { /* best-effort */ } }
      await this.render();
    });

    this.root?.querySelectorAll('[data-resolver-revisao]').forEach(button => button.addEventListener('click', async () => {
      const [tipo, registroId] = ((button as HTMLElement).dataset.resolverRevisao || '').split(':') as ['transacao' | 'financeiro', string];
      try { const result = await this.deps.resolverPendencia.execute({ acao: 'marcar_revisao', tipo, registroId }); this.mensagem = result.mensagem; }
      catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível revisar.'; }
      await this.render();
    }));

    this.root?.querySelectorAll('[data-resolver-ignorar]').forEach(button => button.addEventListener('click', async () => {
      const [tipo, registroId] = ((button as HTMLElement).dataset.resolverIgnorar || '').split(':') as ['transacao' | 'financeiro', string];
      try { const result = await this.deps.resolverPendencia.execute({ acao: 'ignorar', tipo, registroId }); this.mensagem = result.mensagem; }
      catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível remover.'; }
      await this.render();
    }));

    this.root?.querySelectorAll('[data-abrir-cadastro-item]').forEach(button => button.addEventListener('click', async () => { this.mensagem = 'Abra Itens para cadastrar. A importação fica aguardando.'; await this.render(); }));

    this.root?.querySelectorAll('[data-conciliar-importacao]').forEach(button => button.addEventListener('click', async () => {
      try { this.conciliacao = await this.deps.conciliar.execute(); this.mensagem = `${this.conciliacao.resumo.conciliados} pagamentos conferidos.`; }
      catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível comparar.'; }
      await this.render();
    }));

    this.root?.querySelectorAll('[data-previsualizar-historico-financeiro]').forEach(button => button.addEventListener('click', async () => {
      try { this.previaConfirmacao = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'previsualizar' }); this.ultimaConfirmacao = null; this.confirmacaoArmada = false; this.mensagem = `${this.previaConfirmacao.transacoesPrevistas} registros para revisar.`; }
      catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível revisar.'; }
      await this.render();
    }));

    this.root?.querySelector('[data-armar-confirmacao-historico]')?.addEventListener('click', async () => { this.confirmacaoArmada = true; this.mensagem = 'Pronto para confirmar.'; await this.render(); });

    this.root?.querySelector('[data-confirmar-historico-financeiro]')?.addEventListener('click', async () => {
      const previaId = (this.root?.querySelector('[data-confirmar-historico-financeiro]') as HTMLElement | null)?.dataset.previaId || this.previaConfirmacao?.previaId;
      try {
        if (!previaId) { this.mensagem = 'Revise antes.'; await this.render(); return; }
        const result = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'confirmar', previaId });
        this.ultimaConfirmacao = result;
        this.previaConfirmacao = null;
        this.confirmacaoArmada = false;
        this.mensagem = `${result.transacoesCriadas} registros confirmados.`;
        if (this.deps.onRascunhoAtualizado) { try { await this.deps.onRascunhoAtualizado('descartar'); } catch { /* best-effort */ } }
      } catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível confirmar.'; }
      await this.render();
    });

    this.root?.querySelectorAll('[data-retomar-confirmacao-segura]').forEach(button => button.addEventListener('click', async () => {
      const loteConfirmacaoId = (button as HTMLElement).dataset.loteConfirmacaoId || '';
      try { this.previaConfirmacao = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'recuperar_falha', loteConfirmacaoId }); this.ultimaConfirmacao = null; this.confirmacaoArmada = true; this.mensagem = 'Retomada aberta.'; }
      catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível retomar.'; }
      await this.render();
    }));
  }
}
