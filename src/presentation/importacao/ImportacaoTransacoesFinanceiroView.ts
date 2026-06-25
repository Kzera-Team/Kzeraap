import type { PrepararImportacaoTransacoesUseCase } from '../../application/importacao/PrepararImportacaoTransacoesUseCase';
import type { PrepararImportacaoFinanceiraUseCase } from '../../application/importacao/PrepararImportacaoFinanceiraUseCase';
import type { ListarStagingImportacaoUseCase, StagingImportacaoResumo } from '../../application/importacao/ListarStagingImportacaoUseCase';
import type { ConciliarTransacoesFinanceiroUseCase, ResultadoConciliacaoImportacao } from '../../application/importacao/ConciliarTransacoesFinanceiroUseCase';
import type { ResolverPendenciaImportacaoUseCase } from '../../application/importacao/ResolverPendenciaImportacaoUseCase';
import type { ConfirmarImportacaoHistoricaFinanceiraUseCase, ConfirmarImportacaoHistoricaFinanceiraResultado } from '../../application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase';
import { releaseObject } from '../../runtime/RuntimeCleanup';

export interface ImportacaoTransacoesFinanceiroDeps {
  prepararTransacoes: PrepararImportacaoTransacoesUseCase;
  prepararFinanceiro: PrepararImportacaoFinanceiraUseCase;
  listarStaging: ListarStagingImportacaoUseCase;
  conciliar: ConciliarTransacoesFinanceiroUseCase;
  resolverPendencia: ResolverPendenciaImportacaoUseCase;
  confirmarHistoricoFinanceiro: ConfirmarImportacaoHistoricaFinanceiraUseCase;
  onRascunhoAtualizado?: (acao: 'salvar' | 'descartar') => Promise<void>;
}

type ImportacaoEstado = 'vazio' | 'carregado' | 'andamento' | 'pendencias' | 'previa' | 'confirmacao' | 'recuperacao' | 'detalhes';
type TemplateKey = 'shell' | ImportacaoEstado;
type ArquivoImportacaoTipo = 'transacoes' | 'financeiro';

interface ArquivoImportacao {
  nome: string;
  conteudo: string;
}

const TEMPLATE_URLS: Record<TemplateKey, URL> = {
  shell: new URL('./templates/importacao-transacoes-financeiro.html', import.meta.url),
  vazio: new URL('./templates/importacao-transacoes-financeiro-vazio.html', import.meta.url),
  carregado: new URL('./templates/importacao-transacoes-financeiro-carregado.html', import.meta.url),
  andamento: new URL('./templates/importacao-transacoes-financeiro-andamento.html', import.meta.url),
  pendencias: new URL('./templates/importacao-transacoes-financeiro-pendencias.html', import.meta.url),
  previa: new URL('./templates/importacao-transacoes-financeiro-previa.html', import.meta.url),
  confirmacao: new URL('./templates/importacao-transacoes-financeiro-confirmacao.html', import.meta.url),
  recuperacao: new URL('./templates/importacao-transacoes-financeiro-recuperacao.html', import.meta.url),
  detalhes: new URL('./templates/importacao-transacoes-financeiro-detalhes.html', import.meta.url),
};

const CSS_URL = new URL('./templates/importacao-transacoes-financeiro.css', import.meta.url);

export class ImportacaoTransacoesFinanceiroView {
  private root: HTMLElement | null = null;
  private mensagem = '';
  private estado: ImportacaoEstado = 'vazio';
  private templates = new Map<TemplateKey, string>();
  private conciliacao: ResultadoConciliacaoImportacao | null = null;
  private ultimaConfirmacao: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private previaConfirmacao: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private confirmacaoArmada = false;
  private transacoes: ArquivoImportacao | null = null;
  private financeiro: ArquivoImportacao | null = null;

  constructor(private readonly deps: ImportacaoTransacoesFinanceiroDeps) {}

  release(): void {
    releaseObject(this.conciliacao);
    releaseObject(this.ultimaConfirmacao);
    releaseObject(this.previaConfirmacao);
    this.conciliacao = null;
    this.ultimaConfirmacao = null;
    this.previaConfirmacao = null;
    this.transacoes = null;
    this.financeiro = null;
    this.mensagem = '';
    this.estado = 'vazio';
    this.confirmacaoArmada = false;
    if (this.root) this.root.replaceChildren();
  }

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    this.carregarCss();
    await this.carregarShell();
    await this.render();
  }

  private carregarCss(): void {
    if (document.getElementById('importacao-transacoes-financeiro-css')) return;
    const link = document.createElement('link');
    link.id = 'importacao-transacoes-financeiro-css';
    link.rel = 'stylesheet';
    link.href = CSS_URL.toString();
    document.head.appendChild(link);
  }

  private async carregarShell(): Promise<void> {
    if (!this.root) return;
    this.root.innerHTML = await this.carregarTemplate('shell');
  }

  private async carregarTemplate(key: TemplateKey): Promise<string> {
    const cached = this.templates.get(key);
    if (cached) return cached;
    const response = await fetch(TEMPLATE_URLS[key].toString());
    if (!response.ok) throw new Error('Não foi possível carregar a tela de importação financeira.');
    const template = await response.text();
    this.templates.set(key, template);
    return template;
  }

  private async render(): Promise<void> {
    const container = this.el('[data-importacao-conteudo]');
    if (!container) return;
    container.innerHTML = await this.carregarTemplate(this.estado);
    await this.preencherEstadoAtual();
    this.renderMensagem();
    this.bindEstadoAtual();
  }

  private async preencherEstadoAtual(): Promise<void> {
    if (this.estado === 'vazio') this.preencherVazio();
    if (this.estado === 'carregado') this.preencherCarregado();
    if (this.estado === 'andamento') await this.preencherAndamento();
    if (this.estado === 'pendencias') await this.preencherPendencias();
    if (this.estado === 'previa') this.preencherPrevia();
    if (this.estado === 'confirmacao') this.preencherConfirmacao();
    if (this.estado === 'detalhes') this.preencherDetalhes();
  }

  private preencherVazio(): void {
    this.setText('[data-nome-transacoes]', this.transacoes?.nome || 'Nenhum arquivo carregado');
    this.setText('[data-nome-financeiro]', this.financeiro?.nome || 'Nenhum arquivo carregado');
    this.setDisabled('[data-continuar-carregamento]', !this.temArquivosObrigatorios());
  }

  private preencherCarregado(): void {
    this.setText('[data-nome-transacoes]', this.transacoes?.nome || '—');
    this.setText('[data-nome-financeiro]', this.financeiro?.nome || '—');
    this.setText('[data-linhas-transacoes]', this.contarLinhas(this.transacoes?.conteudo));
    this.setText('[data-linhas-financeiro]', this.contarLinhas(this.financeiro?.conteudo));
  }

  private async preencherAndamento(): Promise<void> {
    const staging = await this.deps.listarStaging.execute();
    this.setText('[data-linhas-lidas]', String(staging.resumoTransacoes.total));
    this.setText('[data-possiveis-vendas]', String(staging.resumoTransacoes.validos));
    this.setText('[data-periodo-encontrado]', 'Aguardando prévia');
    this.setText('[data-financeiro-oficial]', 'R$ 0');
  }

  private async preencherPendencias(): Promise<void> {
    const staging = await this.deps.listarStaging.execute();
    this.setText('[data-pendencias-financeiro]', String(staging.resumoTransacoes.pendentesFinanceiro));
    this.setText('[data-pendencias-valor]', String(staging.resumoFinanceiro.pendentes));
    this.setText('[data-pendencias-duplicidade]', String(staging.resumoTransacoes.pendentesPerfil + staging.resumoTransacoes.pendentesItem));
  }

  private preencherPrevia(): void {
    const previa = this.previaConfirmacao;
    this.setText('[data-previa-transacoes]', String(previa?.transacoesPrevistas || 0));
    this.setText('[data-previa-pagamentos]', String(previa?.pagamentosPrevistos || 0));
    this.setText('[data-previa-movimentos]', String(previa?.movimentosPrevistos || 0));
    this.setText('[data-previa-bloqueados]', String(previa?.registrosBloqueados || 0));
    this.setText('[data-previa-faturamento]', String(previa?.faturamentoTotal || '—'));
    this.setText('[data-previa-pendente]', String(previa?.valorPendenteTotal || '—'));
  }

  private preencherConfirmacao(): void {
    const previa = this.previaConfirmacao;
    this.setText('[data-confirmacao-transacoes]', String(previa?.transacoesPrevistas || 0));
    this.setText('[data-confirmacao-pagamentos]', String(previa?.pagamentosPrevistos || 0));
  }

  private preencherDetalhes(): void {
    const previa = this.previaConfirmacao || this.ultimaConfirmacao;
    this.setText('[data-detalhe-pacote]', previa?.previaId || previa?.loteConfirmacaoId || 'sem-pacote');
    this.setText('[data-detalhe-transacoes]', String(previa?.transacoesPrevistas || previa?.transacoesCriadas || 0));
    this.setText('[data-detalhe-pagamentos]', String(previa?.pagamentosPrevistos || previa?.pagamentosCriados || 0));
    this.setText('[data-detalhe-movimentos]', String(previa?.movimentosPrevistos || previa?.movimentosCriados || 0));
  }

  private bindEstadoAtual(): void {
    this.bindNavegacao();
    this.bindUploads();
    this.bindPreparacao();
    this.bindConciliacao();
    this.bindPrevia();
    this.bindConfirmacao();
  }

  private bindNavegacao(): void {
    this.bindClick('[data-ir-vazio]', () => this.irPara('vazio'));
    this.bindClick('[data-ir-pendencias]', () => this.irPara('pendencias'));
    this.bindClick('[data-ir-detalhes]', () => this.irPara('detalhes'));
    this.bindClick('[data-ir-previa]', () => this.irPara('previa'));
    this.bindClick('[data-ir-recuperacao]', () => this.irPara('recuperacao'));
  }

  private bindUploads(): void {
    this.bindArquivo('[data-file-upload-transacoes]', 'transacoes');
    this.bindArquivo('[data-file-upload-financeiro]', 'financeiro');
    this.bindClick('[data-continuar-carregamento]', () => this.irPara('carregado'));
  }

  private bindPreparacao(): void {
    this.bindClick('[data-preparar-importacao]', () => this.prepararImportacao());
  }

  private bindConciliacao(): void {
    this.bindClick('[data-conciliar-importacao]', () => this.conciliarImportacao());
  }

  private bindPrevia(): void {
    this.bindClick('[data-gerar-previa]', () => this.gerarPrevia());
    this.bindClick('[data-abrir-confirmacao]', () => this.abrirConfirmacao());
  }

  private bindConfirmacao(): void {
    this.bindClick('[data-cancelar-confirmacao]', () => this.irPara('previa'));
    this.bindClick('[data-confirmar-importacao]', () => this.confirmarImportacao());
  }

  private async prepararImportacao(): Promise<void> {
    if (!this.transacoes || !this.financeiro) {
      this.mensagem = 'Carregue os dois arquivos antes de preparar.';
      await this.render();
      return;
    }
    const transacoes = await this.deps.prepararTransacoes.execute(this.transacoes);
    const financeiro = await this.deps.prepararFinanceiro.execute(this.financeiro);
    this.mensagem = `Arquivos preparados: ${transacoes.resumo.total} transações e ${financeiro.resumo.total} pagamentos.`;
    if (this.deps.onRascunhoAtualizado) await this.deps.onRascunhoAtualizado('salvar');
    await this.irPara('andamento');
  }

  private async conciliarImportacao(): Promise<void> {
    this.conciliacao = await this.deps.conciliar.execute();
    this.mensagem = `Conferência pronta: ${this.conciliacao.resumo.conciliados} pagamentos conferidos.`;
    await this.irPara('pendencias');
  }

  private async gerarPrevia(): Promise<void> {
    try {
      this.previaConfirmacao = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'previsualizar' });
      this.confirmacaoArmada = false;
      this.mensagem = `Prévia pronta: ${this.previaConfirmacao.transacoesPrevistas} registros podem entrar.`;
      await this.irPara('previa');
    } catch (error) {
      this.mensagem = error instanceof Error ? error.message : 'Não foi possível gerar a prévia segura.';
      await this.render();
    }
  }

  private async abrirConfirmacao(): Promise<void> {
    if (!this.previaConfirmacao) {
      this.mensagem = 'Gere a prévia antes de confirmar.';
      await this.render();
      return;
    }
    this.confirmacaoArmada = true;
    await this.irPara('confirmacao');
  }

  private async confirmarImportacao(): Promise<void> {
    const previaId = this.previaConfirmacao?.previaId;
    if (!previaId || !this.confirmacaoArmada) {
      this.mensagem = 'Abra a confirmação segura antes de concluir.';
      await this.render();
      return;
    }
    this.ultimaConfirmacao = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'confirmar', previaId });
    this.previaConfirmacao = null;
    this.confirmacaoArmada = false;
    this.mensagem = `Histórico confirmado: ${this.ultimaConfirmacao.transacoesCriadas} registros salvos. Estoque não foi alterado.`;
    if (this.deps.onRascunhoAtualizado) await this.deps.onRascunhoAtualizado('descartar');
    await this.irPara('andamento');
  }

  private bindArquivo(selector: string, tipo: ArquivoImportacaoTipo): void {
    const input = this.el<HTMLInputElement>(selector);
    if (!input) return;
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      this.definirArquivo(tipo, { nome: file.name, conteudo: await file.text() });
      if (this.temArquivosObrigatorios()) this.estado = 'carregado';
      await this.render();
    });
  }

  private definirArquivo(tipo: ArquivoImportacaoTipo, arquivo: ArquivoImportacao): void {
    if (tipo === 'transacoes') this.transacoes = arquivo;
    if (tipo === 'financeiro') this.financeiro = arquivo;
  }

  private async irPara(estado: ImportacaoEstado): Promise<void> {
    this.estado = estado;
    await this.render();
  }

  private bindClick(selector: string, handler: () => void | Promise<void>): void {
    this.el(selector)?.addEventListener('click', () => void handler());
  }

  private temArquivosObrigatorios(): boolean {
    return Boolean(this.transacoes?.conteudo.trim() && this.financeiro?.conteudo.trim());
  }

  private contarLinhas(conteudo?: string): string {
    if (!conteudo?.trim()) return '0 linhas';
    return `${conteudo.trim().split(/\r?\n/).length} linhas`;
  }

  private renderMensagem(): void {
    const toast = this.el('[data-importacao-mensagem]');
    if (!toast) return;
    toast.textContent = this.mensagem;
    toast.hidden = !this.mensagem;
  }

  private setText(selector: string, value: string): void {
    const target = this.el(selector);
    if (target) target.textContent = value;
  }

  private setDisabled(selector: string, disabled: boolean): void {
    const target = this.el<HTMLButtonElement>(selector);
    if (target) target.disabled = disabled;
  }

  private el<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    return this.root?.querySelector<T>(selector) || null;
  }
}