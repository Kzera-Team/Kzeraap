import type { PrepararImportacaoTransacoesUseCase } from '../../application/importacao/PrepararImportacaoTransacoesUseCase';
import type { PrepararImportacaoFinanceiraUseCase } from '../../application/importacao/PrepararImportacaoFinanceiraUseCase';
import type { ListarStagingImportacaoUseCase } from '../../application/importacao/ListarStagingImportacaoUseCase';
import type { ConciliarTransacoesFinanceiroUseCase } from '../../application/importacao/ConciliarTransacoesFinanceiroUseCase';
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

type Estado = 'vazio' | 'carregado' | 'andamento' | 'pendencias' | 'previa' | 'confirmacao' | 'recuperacao' | 'detalhes';
type Template = 'shell' | Estado;
type TipoArquivo = 'transacoes' | 'financeiro';
interface ArquivoImportacao { nomeArquivo: string; conteudo: string }
interface UploadDraftMemoria {
  transacoes: ArquivoImportacao | null;
  financeiro: ArquivoImportacao | null;
  updatedAt: string;
}

const TEMPLATES: Record<Template, URL> = {
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
const EXTENSOES_TEXTO = ['csv', 'tsv', 'txt'];
const UPLOAD_DRAFT_MEMORIA_KEY = '__kzeraImportacaoTransacoesFinanceiroUploadDraft__';

function uploadDraftMemoriaStore(): Record<string, UploadDraftMemoria | undefined> {
  return globalThis as unknown as Record<string, UploadDraftMemoria | undefined>;
}

export class ImportacaoTransacoesFinanceiroView {
  private root: HTMLElement | null = null;
  private estado: Estado = 'vazio';
  private mensagem = '';
  private cache = new Map<Template, string>();
  private transacoes: ArquivoImportacao | null = null;
  private financeiro: ArquivoImportacao | null = null;
  private previa: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private ultima: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private confirmacaoArmada = false;

  constructor(private readonly deps: ImportacaoTransacoesFinanceiroDeps) {}

  release(): void {
    releaseObject(this.previa);
    releaseObject(this.ultima);
    this.transacoes = null;
    this.financeiro = null;
    this.previa = null;
    this.ultima = null;
    this.confirmacaoArmada = false;
    this.mensagem = '';
    this.estado = 'vazio';
    this.root?.replaceChildren();
  }

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    this.injetarCss();
    this.restaurarUploadEmMemoria();
    this.root.innerHTML = await this.template('shell');
    await this.render();
  }

  private injetarCss(): void {
    if (document.getElementById('importacao-transacoes-financeiro-css')) return;
    const link = document.createElement('link');
    link.id = 'importacao-transacoes-financeiro-css';
    link.rel = 'stylesheet';
    link.href = CSS_URL.toString();
    document.head.appendChild(link);
  }

  private async template(nome: Template): Promise<string> {
    const cached = this.cache.get(nome);
    if (cached) return cached;
    const response = await fetch(TEMPLATES[nome].toString());
    if (!response.ok) throw new Error('Não foi possível carregar a importação financeira.');
    const html = await response.text();
    this.cache.set(nome, html);
    return html;
  }

  private async render(): Promise<void> {
    const alvo = this.el('[data-importacao-conteudo]');
    if (!alvo) return;
    alvo.innerHTML = await this.template(this.estado);
    await this.preencher();
    this.mostrarMensagem();
    this.bind();
  }

  private async preencher(): Promise<void> {
    if (this.estado === 'vazio') this.preencherVazio();
    if (this.estado === 'carregado') this.preencherCarregado();
    if (this.estado === 'andamento') await this.preencherAndamento();
    if (this.estado === 'pendencias') await this.preencherPendencias();
    if (this.estado === 'previa') this.preencherPrevia();
    if (this.estado === 'confirmacao') this.preencherConfirmacao();
    if (this.estado === 'detalhes') this.preencherDetalhes();
  }

  private preencherVazio(): void {
    this.texto('[data-nome-transacoes]', this.transacoes?.nomeArquivo || 'Nenhum arquivo carregado');
    this.texto('[data-nome-financeiro]', this.financeiro?.nomeArquivo || 'Nenhum arquivo carregado');
    this.desabilitar('[data-continuar-carregamento]', !this.temArquivos());
  }

  private preencherCarregado(): void {
    this.texto('[data-nome-transacoes]', this.transacoes?.nomeArquivo || '—');
    this.texto('[data-nome-financeiro]', this.financeiro?.nomeArquivo || '—');
    this.texto('[data-linhas-transacoes]', this.linhas(this.transacoes?.conteudo));
    this.texto('[data-linhas-financeiro]', this.linhas(this.financeiro?.conteudo));
  }

  private async preencherAndamento(): Promise<void> {
    const staging = await this.deps.listarStaging.execute();
    this.texto('[data-linhas-lidas]', String(staging.resumoTransacoes.total));
    this.texto('[data-possiveis-vendas]', String(staging.resumoTransacoes.validos));
  }

  private async preencherPendencias(): Promise<void> {
    const staging = await this.deps.listarStaging.execute();
    this.texto('[data-pendencias-financeiro]', String(staging.resumoTransacoes.pendentesFinanceiro));
    this.texto('[data-pendencias-valor]', String(staging.resumoFinanceiro.pendentes));
    this.texto('[data-pendencias-duplicidade]', String(staging.resumoTransacoes.pendentesPerfil + staging.resumoTransacoes.pendentesItem));
  }

  private preencherPrevia(): void {
    this.texto('[data-previa-transacoes]', String(this.previa?.transacoesPrevistas || 0));
    this.texto('[data-previa-pagamentos]', String(this.previa?.pagamentosPrevistos || 0));
    this.texto('[data-previa-movimentos]', String(this.previa?.movimentosPrevistos || 0));
    this.texto('[data-previa-bloqueados]', String(this.previa?.registrosBloqueados || 0));
    this.texto('[data-previa-faturamento]', String(this.previa?.faturamentoTotal || '—'));
    this.texto('[data-previa-pendente]', String(this.previa?.valorPendenteTotal || '—'));
  }

  private preencherConfirmacao(): void {
    this.texto('[data-confirmacao-transacoes]', String(this.previa?.transacoesPrevistas || 0));
    this.texto('[data-confirmacao-pagamentos]', String(this.previa?.pagamentosPrevistos || 0));
  }

  private preencherDetalhes(): void {
    const base = this.previa || this.ultima;
    this.texto('[data-detalhe-pacote]', base?.previaId || base?.loteConfirmacaoId || 'sem-pacote');
    this.texto('[data-detalhe-transacoes]', String(base?.transacoesPrevistas || base?.transacoesCriadas || 0));
    this.texto('[data-detalhe-pagamentos]', String(base?.pagamentosPrevistos || base?.pagamentosCriados || 0));
    this.texto('[data-detalhe-movimentos]', String(base?.movimentosPrevistos || base?.movimentosCriados || 0));
  }

  private bind(): void {
    this.on('[data-ir-vazio]', () => this.ir('vazio'));
    this.on('[data-ir-pendencias]', () => this.ir('pendencias'));
    this.on('[data-ir-detalhes]', () => this.ir('detalhes'));
    this.on('[data-ir-previa]', () => this.ir('previa'));
    this.on('[data-ir-recuperacao]', () => this.ir('recuperacao'));
    this.upload('[data-file-upload-transacoes]', 'transacoes');
    this.upload('[data-file-upload-financeiro]', 'financeiro');
    this.on('[data-continuar-carregamento]', () => this.ir('carregado'));
    this.on('[data-preparar-importacao]', () => this.preparar());
    this.on('[data-conciliar-importacao]', () => this.conciliar());
    this.on('[data-gerar-previa]', () => this.gerarPrevia());
    this.on('[data-abrir-confirmacao]', () => this.abrirConfirmacao());
    this.on('[data-cancelar-confirmacao]', () => this.ir('previa'));
    this.on('[data-confirmar-importacao]', () => this.confirmar());
  }

  private async preparar(): Promise<void> {
    if (!this.transacoes || !this.financeiro) return this.falha('Carregue os dois arquivos antes de preparar.');
    const t = await this.deps.prepararTransacoes.execute(this.transacoes);
    const f = await this.deps.prepararFinanceiro.execute(this.financeiro);
    this.mensagem = `Arquivos preparados: ${t.resumo.total} transações e ${f.resumo.total} pagamentos.`;
    this.limparUploadEmMemoria();
    await this.deps.onRascunhoAtualizado?.('salvar');
    await this.ir('andamento');
  }

  private async conciliar(): Promise<void> {
    const resultado = await this.deps.conciliar.execute();
    this.mensagem = `Conferência pronta: ${resultado.resumo.conciliados} pagamentos conferidos.`;
    await this.ir('pendencias');
  }

  private async gerarPrevia(): Promise<void> {
    try {
      this.previa = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'previsualizar' });
      this.confirmacaoArmada = false;
      this.mensagem = `Prévia pronta: ${this.previa.transacoesPrevistas} registros podem entrar.`;
      await this.ir('previa');
    } catch (error) {
      await this.falha(error instanceof Error ? error.message : 'Não foi possível gerar a prévia.');
    }
  }

  private async abrirConfirmacao(): Promise<void> {
    if (!this.previa) return this.falha('Gere a prévia antes de confirmar.');
    this.confirmacaoArmada = true;
    await this.ir('confirmacao');
  }

  private async confirmar(): Promise<void> {
    const previaId = this.previa?.previaId;
    if (!previaId || !this.confirmacaoArmada) return this.falha('Abra a confirmação segura antes de concluir.');
    this.ultima = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'confirmar', previaId });
    this.previa = null;
    this.confirmacaoArmada = false;
    this.mensagem = `Histórico confirmado: ${this.ultima.transacoesCriadas} registros salvos. Estoque não foi alterado.`;
    this.limparUploadEmMemoria();
    await this.deps.onRascunhoAtualizado?.('descartar');
    await this.ir('andamento');
  }

  private upload(selector: string, tipo: TipoArquivo): void {
    const input = this.el<HTMLInputElement>(selector);
    if (!input) return;
    input.addEventListener('change', async () => {
      const arquivo = input.files?.[0];
      if (!arquivo) return;
      if (!this.extensaoTexto(arquivo.name)) return this.falha('Use CSV, TSV ou TXT.');
      this.definirArquivo(tipo, { nomeArquivo: arquivo.name, conteudo: await arquivo.text() });
      this.salvarUploadEmMemoria();
      if (this.temArquivos()) this.estado = 'carregado';
      await this.render();
    });
  }

  private definirArquivo(tipo: TipoArquivo, arquivo: ArquivoImportacao): void {
    if (tipo === 'transacoes') this.transacoes = arquivo;
    if (tipo === 'financeiro') this.financeiro = arquivo;
  }

  private restaurarUploadEmMemoria(): void {
    const draft = uploadDraftMemoriaStore()[UPLOAD_DRAFT_MEMORIA_KEY];
    if (!draft) return;
    this.transacoes = this.clonarArquivo(draft.transacoes);
    this.financeiro = this.clonarArquivo(draft.financeiro);
    if (this.temArquivos()) this.estado = 'carregado';
  }

  private salvarUploadEmMemoria(): void {
    uploadDraftMemoriaStore()[UPLOAD_DRAFT_MEMORIA_KEY] = {
      transacoes: this.clonarArquivo(this.transacoes),
      financeiro: this.clonarArquivo(this.financeiro),
      updatedAt: new Date().toISOString()
    };
  }

  private limparUploadEmMemoria(): void {
    delete uploadDraftMemoriaStore()[UPLOAD_DRAFT_MEMORIA_KEY];
  }

  private clonarArquivo(arquivo: ArquivoImportacao | null | undefined): ArquivoImportacao | null {
    if (!arquivo) return null;
    return { nomeArquivo: arquivo.nomeArquivo, conteudo: arquivo.conteudo };
  }

  private extensaoTexto(nomeArquivo: string): boolean {
    const ext = nomeArquivo.split('.').pop()?.toLowerCase() || '';
    return EXTENSOES_TEXTO.includes(ext);
  }

  private async falha(mensagem: string): Promise<void> {
    this.mensagem = mensagem;
    await this.render();
  }

  private async ir(estado: Estado): Promise<void> {
    this.estado = estado;
    await this.render();
  }

  private on(selector: string, handler: () => void | Promise<void>): void {
    this.el(selector)?.addEventListener('click', () => void handler());
  }

  private temArquivos(): boolean {
    return Boolean(this.transacoes?.conteudo.trim() && this.financeiro?.conteudo.trim());
  }

  private linhas(conteudo?: string): string {
    if (!conteudo?.trim()) return '0 linhas';
    return `${conteudo.trim().split(/\r?\n/).length} linhas`;
  }

  private mostrarMensagem(): void {
    const toast = this.el('[data-importacao-mensagem]');
    if (!toast) return;
    toast.textContent = this.mensagem;
    toast.hidden = !this.mensagem;
  }

  private texto(selector: string, valor: string): void {
    const alvo = this.el(selector);
    if (alvo) alvo.textContent = valor;
  }

  private desabilitar(selector: string, valor: boolean): void {
    const alvo = this.el<HTMLButtonElement>(selector);
    if (alvo) alvo.disabled = valor;
  }

  private el<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    return this.root?.querySelector<T>(selector) || null;
  }
}
