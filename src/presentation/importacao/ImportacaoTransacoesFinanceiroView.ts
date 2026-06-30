import type { PrepararImportacaoTransacoesUseCase } from '../../application/importacao/PrepararImportacaoTransacoesUseCase';
import type { PrepararImportacaoFinanceiraUseCase } from '../../application/importacao/PrepararImportacaoFinanceiraUseCase';
import type { ListarStagingImportacaoUseCase, StagingImportacaoResumo } from '../../application/importacao/ListarStagingImportacaoUseCase';
import type { ConciliarTransacoesFinanceiroUseCase } from '../../application/importacao/ConciliarTransacoesFinanceiroUseCase';
import type { ResolverPendenciaImportacaoUseCase } from '../../application/importacao/ResolverPendenciaImportacaoUseCase';
import type { ConfirmarImportacaoHistoricaFinanceiraUseCase, ConfirmarImportacaoHistoricaFinanceiraResultado } from '../../application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase';
import { releaseObject } from '../../runtime/RuntimeCleanup';
import rowTransacaoTemplate from './templates/importacao-transacoes-financeiro-pendencias-row-transacao.html?raw';
import rowFinanceiroTemplate from './templates/importacao-transacoes-financeiro-pendencias-row-financeiro.html?raw';

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

class UploadDraftStore {
  private static readonly KEY = '__kzeraImportacaoTransacoesFinanceiroUploadDraft__';
  private get store(): Record<string, UploadDraftMemoria | undefined> {
    return globalThis as unknown as Record<string, UploadDraftMemoria | undefined>;
  }

  salvar(transacoes: ArquivoImportacao | null, financeiro: ArquivoImportacao | null): void {
    this.store[UploadDraftStore.KEY] = {
      transacoes: transacoes ? { nomeArquivo: transacoes.nomeArquivo, conteudo: transacoes.conteudo } : null,
      financeiro: financeiro ? { nomeArquivo: financeiro.nomeArquivo, conteudo: financeiro.conteudo } : null,
      updatedAt: new Date().toISOString()
    };
  }

  restaurar(): UploadDraftMemoria | null {
    return this.store[UploadDraftStore.KEY] ?? null;
  }

  limpar(): void {
    delete this.store[UploadDraftStore.KEY];
  }
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
  private readonly uploadDraft = new UploadDraftStore();

  constructor(private readonly deps: ImportacaoTransacoesFinanceiroDeps) {}

  release(): void {
    releaseObject(this.previa);
    releaseObject(this.ultima);
    this.uploadDraft.limpar();
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
    this.html('[data-lista-transacoes-pendentes]', this.renderizarRows(staging.registrosTransacoes, rowTransacaoTemplate, r => r.numeroOriginal));
    this.visivel('[data-secao-transacoes-pendentes]', staging.registrosTransacoes.length > 0);
    this.html('[data-lista-financeiros-pendentes]', this.renderizarRows(staging.registrosFinanceiros, rowFinanceiroTemplate, r => r.numeroTransacaoReferenciado));
    this.visivel('[data-secao-financeiros-pendentes]', staging.registrosFinanceiros.length > 0);
  }

  private escHtml(val: string | number | undefined): string {
    if (val == null) return '';
    return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  private preencherTemplate(template: string, values: Record<string, string>): string {
    return Object.entries(values).reduce(
      (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
      template
    );
  }

  private renderizarRows<T extends { id: string; linha: number; status: string; pendencias: unknown[] }>(
    registros: T[],
    template: string,
    obterRef: (r: T) => string | undefined
  ): string {
    return registros.map(r => {
      const ref = obterRef(r);
      const bloqueado = r.status === 'ignorado' || r.status === 'confirmado';
      return this.preencherTemplate(template, {
        id: this.escHtml(r.id),
        titulo: `Linha ${this.escHtml(r.linha)}${ref ? ` · #${this.escHtml(ref)}` : ''}`,
        meta: `Status: ${this.escHtml(r.status)} · Pendências: ${this.escHtml(r.pendencias.length)}`,
        status: this.escHtml(r.status),
        badgeClass: r.status === 'validado' ? 'ok' : 'warn',
        disabled: bloqueado ? 'disabled' : '',
      });
    }).join('\n');
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
    this.on('[data-vincular-massa-segura]', () => this.vincularMassaSegura());
    this.onAll('[data-ignorar-registro]', el => {
      const id = el.dataset.registroId;
      const tipo = el.dataset.tipo as 'transacao' | 'financeiro';
      if (id && tipo) void this.ignorarRegistro(tipo, id);
    });
    this.onAll('[data-marcar-revisao-registro]', el => {
      const id = el.dataset.registroId;
      const tipo = el.dataset.tipo as 'transacao' | 'financeiro';
      if (id && tipo) void this.marcarRevisaoRegistro(tipo, id);
    });
    this.onAll('[data-vincular-financeiro-registro]', el => {
      const finId = el.dataset.registroId;
      const row = el.closest('[data-registro-row]') as HTMLElement | null;
      const txnId = row?.querySelector<HTMLInputElement>('[data-input-vincular-txn]')?.value?.trim();
      if (finId && txnId) void this.vincularFinanceiro(finId, txnId);
      else this.mensagem = 'Informe o ID da transação em staging para vincular.';
    });
  }

  private async ignorarRegistro(tipo: 'transacao' | 'financeiro', id: string): Promise<void> {
    try {
      const resultado = await this.deps.resolverPendencia.execute({ acao: 'ignorar', tipo, registroId: id });
      this.mensagem = resultado.mensagem;
      await this.ir('pendencias');
    } catch (error) {
      await this.falha(error instanceof Error ? error.message : 'Não foi possível ignorar o registro.');
    }
  }

  private async marcarRevisaoRegistro(tipo: 'transacao' | 'financeiro', id: string): Promise<void> {
    try {
      const resultado = await this.deps.resolverPendencia.execute({ acao: 'marcar_revisao', tipo, registroId: id });
      this.mensagem = resultado.mensagem;
      await this.ir('pendencias');
    } catch (error) {
      await this.falha(error instanceof Error ? error.message : 'Não foi possível marcar para revisão.');
    }
  }

  private async vincularFinanceiro(registroFinanceiroId: string, registroTransacaoId: string): Promise<void> {
    try {
      const resultado = await this.deps.resolverPendencia.execute({ acao: 'vincular_financeiro', registroTransacaoId, registroFinanceiroId });
      this.mensagem = resultado.mensagem;
      await this.ir('pendencias');
    } catch (error) {
      await this.falha(error instanceof Error ? error.message : 'Não foi possível vincular o financeiro.');
    }
  }

  private async vincularMassaSegura(): Promise<void> {
    const container = this.el('[data-lista-registros-pendentes]');
    if (!container) return;
    const vinculos: { registroTransacaoId: string; registroFinanceiroId: string }[] = [];
    container.querySelectorAll<HTMLElement>('[data-vincular-financeiro-registro]').forEach(btn => {
      const finId = btn.dataset.registroId;
      const row = btn.closest('[data-registro-row]') as HTMLElement | null;
      const txnId = row?.querySelector<HTMLInputElement>('[data-input-vincular-txn]')?.value?.trim();
      if (finId && txnId) vinculos.push({ registroTransacaoId: txnId, registroFinanceiroId: finId });
    });
    if (!vinculos.length) return this.falha('Nenhum vínculo informado para aprovação em massa.');
    try {
      const resultado = await this.deps.resolverPendencia.execute({ acao: 'vincular_financeiro_em_massa', vinculos });
      this.mensagem = resultado.mensagem;
      await this.ir('pendencias');
    } catch (error) {
      await this.falha(error instanceof Error ? error.message : 'Aprovação em massa bloqueada.');
    }
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
    const draft = this.uploadDraft.restaurar();
    if (!draft) return;
    this.transacoes = draft.transacoes || null;
    this.financeiro = draft.financeiro || null;
    if (this.temArquivos()) this.estado = 'carregado';
  }

  private salvarUploadEmMemoria(): void {
    this.uploadDraft.salvar(this.transacoes, this.financeiro);
  }

  private limparUploadEmMemoria(): void {
    this.uploadDraft.limpar();
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

  private onAll(selector: string, handler: (el: HTMLElement) => void): void {
    this.root?.querySelectorAll<HTMLElement>(selector).forEach(el => {
      el.addEventListener('click', () => handler(el));
    });
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

  private html(selector: string, valor: string): void {
    const alvo = this.el(selector);
    if (alvo) alvo.innerHTML = valor;
  }

  private texto(selector: string, valor: string): void {
    const alvo = this.el(selector);
    if (alvo) alvo.textContent = valor;
  }

  private visivel(selector: string, valor: boolean): void {
    const alvo = this.el<HTMLElement>(selector);
    if (alvo) alvo.hidden = !valor;
  }

  private desabilitar(selector: string, valor: boolean): void {
    const alvo = this.el<HTMLButtonElement>(selector);
    if (alvo) alvo.disabled = valor;
  }

  private el<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    return this.root?.querySelector<T>(selector) || null;
  }
}
