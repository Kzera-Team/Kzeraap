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

const TEMPLATE_URL = new URL('./templates/importacao-transacoes-financeiro.html', import.meta.url);

export class ImportacaoTransacoesFinanceiroView {
  private root: HTMLElement | null = null;
  private mensagem = '';
  private conciliacao: ResultadoConciliacaoImportacao | null = null;
  private ultimaConfirmacao: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private previaConfirmacao: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private confirmacaoArmada = false;
  private templateCarregado = false;

  constructor(private readonly deps: ImportacaoTransacoesFinanceiroDeps) {}

  release(): void {
    releaseObject(this.conciliacao);
    releaseObject(this.ultimaConfirmacao);
    releaseObject(this.previaConfirmacao);
    this.conciliacao = null;
    this.ultimaConfirmacao = null;
    this.previaConfirmacao = null;
    this.mensagem = '';
    this.confirmacaoArmada = false;
    this.templateCarregado = false;
    if (this.root) this.root.replaceChildren();
  }

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    await this.carregarTemplate();
    this.bindEvents();
    await this.render();
  }

  private async carregarTemplate(): Promise<void> {
    if (!this.root || this.templateCarregado) return;
    const response = await fetch(TEMPLATE_URL);
    if (!response.ok) throw new Error('Não foi possível carregar o template da importação financeira.');
    this.root.innerHTML = await response.text();
    this.templateCarregado = true;
  }

  private el<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    return this.root?.querySelector<T>(selector) || null;
  }

  private all<T extends HTMLElement = HTMLElement>(selector: string): T[] {
    return Array.from(this.root?.querySelectorAll<T>(selector) || []);
  }

  private setText(selector: string, value: string): void {
    const target = this.el(selector);
    if (target) target.textContent = value;
  }

  private setHidden(selector: string, hidden: boolean): void {
    const target = this.el(selector);
    if (target) target.hidden = hidden;
  }

  private setValue(selector: string, value: string): void {
    const target = this.el<HTMLInputElement | HTMLTextAreaElement>(selector);
    if (target) target.value = value;
  }

  private resumoTexto(label: string, resumo: { total: number; validos: number; pendentes: number; pendentesPerfil: number; pendentesItem: number; pendentesFinanceiro: number }): string {
    return `${label}: total ${resumo.total}; válidos ${resumo.validos}; pendentes ${resumo.pendentes}; perfil ${resumo.pendentesPerfil}; item ${resumo.pendentesItem}; financeiro ${resumo.pendentesFinanceiro}.`;
  }

  private confirmacaoAtiva(): ConfirmarImportacaoHistoricaFinanceiraResultado | null {
    return this.previaConfirmacao || this.ultimaConfirmacao;
  }

  private async render(): Promise<void> {
    if (!this.root) return;
    const staging = await this.deps.listarStaging.execute();
    this.renderMensagem();
    this.renderStaging(staging);
    this.renderConciliacao();
    this.renderConfirmacao();
  }

  private renderMensagem(): void {
    const toast = this.el('[data-importacao-mensagem]');
    if (!toast) return;
    toast.textContent = this.mensagem;
    toast.hidden = !this.mensagem;
  }

  private renderStaging(staging: StagingImportacaoResumo): void {
    this.setText('[data-resumo-transacoes]', this.resumoTexto('Registros', staging.resumoTransacoes));
    this.setText('[data-resumo-financeiro]', this.resumoTexto('Financeiro', staging.resumoFinanceiro));
    this.setText('[data-limite-transacoes]', `Mostrando no máximo ${staging.limiteVisualizacao} de ${staging.totalRegistrosTransacoes} itens para não travar o iPhone.`);
    this.setText('[data-limite-financeiro]', `Mostrando no máximo ${staging.limiteVisualizacao} de ${staging.totalRegistrosFinanceiros} itens para não travar o iPhone.`);
    this.setText('[data-tabela-transacoes]', staging.registrosTransacoes.length ? `${staging.registrosTransacoes.length} registros em conferência.` : 'Nenhum registro em conferência.');
    this.setText('[data-tabela-financeiro]', staging.registrosFinanceiros.length ? `${staging.registrosFinanceiros.length} pagamentos em conferência.` : 'Nenhum pagamento em conferência.');
  }

  private renderConciliacao(): void {
    if (!this.conciliacao) {
      this.setText('[data-conciliacao-resumo]', 'Depois de preparar as duas planilhas, confira os pagamentos para ver o que bateu e o que precisa de atenção.');
      this.setText('[data-aprovacao-massa]', 'Nenhum pagamento conferido ainda.');
      this.setText('[data-tabela-conciliacao]', 'Nenhuma conferência executada.');
      this.setHidden('[data-conciliacao-limite-mobile]', true);
      return;
    }

    const r = this.conciliacao.resumo;
    this.setText('[data-conciliacao-resumo]', `Registros ${r.totalTransacoes}; pagamentos ${r.totalMovimentos}; ok ${r.conciliados}; pendentes ${r.pendentes}; diferenças ${r.divergencias}; posteriores prováveis ${r.sugestoesPagamentoPosterior}; parecem certos ${r.aprovaveisEmMassa}; ficam para revisar ${r.bloqueadosAprovacaoMassa}; já marcados ${r.aprovadosEmMassa}.`);
    this.setText('[data-aprovacao-massa]', r.aprovaveisEmMassa > 0 ? `${r.aprovaveisEmMassa} pagamentos parecem certos para marcar juntos.` : 'Nenhum pagamento parece certo para marcar junto agora.');
    this.setText('[data-tabela-conciliacao]', `${this.conciliacao.itens.length} itens avaliados na conferência.`);
    this.setHidden('[data-conciliacao-limite-mobile]', this.conciliacao.itens.length <= 80);
    this.setText('[data-conciliacao-limite-mobile]', `Mostrando resumo para não travar o iPhone. Total avaliado: ${this.conciliacao.itens.length}.`);
  }

  private renderConfirmacao(): void {
    const painel = this.confirmacaoAtiva();
    const botaoArmar = this.el<HTMLButtonElement>('[data-armar-confirmacao-historico]');
    const botaoConfirmar = this.el<HTMLButtonElement>('[data-confirmar-historico-financeiro]');

    if (!painel) {
      this.setText('[data-confirmacao-resumo]', 'Abra a revisão antes de confirmar o histórico financeiro.');
      this.setText('[data-confirmacao-valores]', 'Sem valores carregados ainda.');
      if (botaoArmar) botaoArmar.hidden = true;
      if (botaoConfirmar) botaoConfirmar.hidden = true;
      this.setHidden('[data-confirmacao-salva]', true);
      return;
    }

    this.setText('[data-confirmacao-resumo]', `Registros que podem entrar ${painel.transacoesPrevistas}; pagamentos encontrados ${painel.pagamentosPrevistos}; precisam de atenção ${painel.registrosBloqueados}; período ${painel.primeiraData || '—'} até ${painel.ultimaData || '—'}.`);
    this.setText('[data-confirmacao-valores]', `Faturamento ${painel.faturamentoTotal}; custo ${painel.custoTotal}; lucro ${painel.lucroTotal}; pago ${painel.valorPagoTotal}; pendente ${painel.valorPendenteTotal}; movimentos previstos ${painel.movimentosPrevistos}; transações criadas ${painel.transacoesCriadas}; pagamentos criados ${painel.pagamentosCriados}; movimentos criados ${painel.movimentosCriados}.`);
    if (botaoArmar) botaoArmar.hidden = !this.previaConfirmacao || this.confirmacaoArmada || painel.transacoesPrevistas <= 0;
    if (botaoConfirmar) {
      botaoConfirmar.hidden = !this.previaConfirmacao || !this.confirmacaoArmada || painel.transacoesPrevistas <= 0;
      if (this.previaConfirmacao?.previaId) botaoConfirmar.dataset.previaId = this.previaConfirmacao.previaId;
    }
    this.setHidden('[data-confirmacao-salva]', !(this.ultimaConfirmacao?.loteConfirmacaoId && this.ultimaConfirmacao.transacoesCriadas > 0));
    this.renderLista('[data-confirmacao-bloqueios-lista]', painel.bloqueios);
    this.renderLista('[data-confirmacao-avisos-lista]', painel.avisos);
    this.setHidden('[data-confirmacao-bloqueios]', !painel.bloqueios.length);
    this.setHidden('[data-confirmacao-avisos]', !painel.avisos.length);
    this.setText('[data-confirmacao-bloqueios-titulo]', `Ver o que precisa de atenção (${painel.bloqueios.length})`);
    this.setText('[data-confirmacao-avisos-titulo]', `Ver avisos (${painel.avisos.length})`);
    this.setValue('[data-bloqueios-exportacao]', painel.bloqueiosExportacao || painel.bloqueios.join('\n'));
  }

  private renderLista(selector: string, itens: string[]): void {
    const target = this.el(selector);
    if (!target) return;
    target.replaceChildren(...itens.map(item => document.createTextNode(`${item}\n`)));
  }

  private async atualizarConciliacao(): Promise<void> {
    this.conciliacao = await this.deps.conciliar.execute();
  }

  private bindEvents(): void {
    this.el('[data-conciliar-importacao]')?.addEventListener('click', async () => {
      await this.atualizarConciliacao();
      this.mensagem = `Conferência pronta: ${this.conciliacao?.resumo.conciliados || 0} pagamentos conferidos, ${this.conciliacao?.resumo.aprovaveisEmMassa || 0} parecem certos para marcar juntos.`;
      await this.render();
    });

    this.el('[data-previsualizar-historico-financeiro]')?.addEventListener('click', async () => {
      try {
        const result = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'previsualizar' });
        this.previaConfirmacao = result;
        this.ultimaConfirmacao = null;
        this.confirmacaoArmada = false;
        this.mensagem = `Revisão pronta: ${result.transacoesPrevistas} registros podem entrar. Estoque não será alterado. Confira os detalhes antes de confirmar.`;
      } catch (error) {
        this.mensagem = error instanceof Error ? error.message : 'Não foi possível abrir a revisão do histórico financeiro.';
      }
      await this.render();
    });

    this.el('[data-armar-confirmacao-historico]')?.addEventListener('click', async () => {
      this.confirmacaoArmada = true;
      this.mensagem = 'Tudo certo para confirmar. Respire, revise uma última vez e toque em confirmar agora.';
      await this.render();
    });

    this.el('[data-confirmar-historico-financeiro]')?.addEventListener('click', async () => {
      const previaId = this.el<HTMLElement>('[data-confirmar-historico-financeiro]')?.dataset.previaId || this.previaConfirmacao?.previaId;
      try {
        if (!previaId) {
          this.mensagem = 'Abra a revisão antes de confirmar o histórico financeiro.';
          await this.render();
          return;
        }
        const result = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'confirmar', previaId });
        this.ultimaConfirmacao = result;
        this.previaConfirmacao = null;
        this.confirmacaoArmada = false;
        this.mensagem = `Histórico confirmado: ${result.transacoesCriadas} registros foram salvas. Estoque não foi alterado.`;
        if (this.deps.onRascunhoAtualizado) await this.deps.onRascunhoAtualizado('descartar');
        await this.atualizarConciliacao();
      } catch (error) {
        this.mensagem = error instanceof Error ? error.message : 'Não foi possível confirmar o histórico financeiro.';
      }
      await this.render();
    });

    this.el('[data-exportar-bloqueios-confirmacao]')?.addEventListener('click', async () => {
      const texto = this.el<HTMLTextAreaElement>('[data-bloqueios-exportacao]')?.value || '';
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) await navigator.clipboard.writeText(texto);
        this.mensagem = 'Lista completa copiada para revisão.';
      } catch (_) {
        this.mensagem = 'Lista completa disponível no campo de revisão.';
      }
      await this.render();
    });

    this.el('[data-import-transacoes]')?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const data = new FormData(form);
      const conteudo = String(data.get('conteudo') || '');
      if (!conteudo.trim()) {
        this.mensagem = 'Cole o conteúdo da planilha de registros antes de preparar.';
        await this.render();
        return;
      }
      const resultado = await this.deps.prepararTransacoes.execute({ nomeArquivo: String(data.get('nomeArquivo') || 'transacoes.csv'), conteudo });
      this.mensagem = `Registros preparados: ${resultado.resumo.total} linhas, ${resultado.resumo.pendentes} precisam de atenção.`;
      if (this.deps.onRascunhoAtualizado) await this.deps.onRascunhoAtualizado('salvar');
      await this.render();
    });

    this.el('[data-import-financeiro]')?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const data = new FormData(form);
      const conteudo = String(data.get('conteudo') || '');
      if (!conteudo.trim()) {
        this.mensagem = 'Cole o conteúdo da planilha financeira antes de preparar.';
        await this.render();
        return;
      }
      const resultado = await this.deps.prepararFinanceiro.execute({ nomeArquivo: String(data.get('nomeArquivo') || 'financeiro.csv'), conteudo });
      this.mensagem = `Pagamentos preparados: ${resultado.resumo.total} linhas, ${resultado.resumo.pendentes} precisam de atenção.`;
      if (this.deps.onRascunhoAtualizado) await this.deps.onRascunhoAtualizado('salvar');
      await this.render();
    });

    this.all('[data-file-upload-transacoes]').forEach(input => this.bindFileInput(input, '[data-conteudo-transacoes]', '[data-nome-arquivo-transacoes]'));
    this.all('[data-file-upload-financeiro]').forEach(input => this.bindFileInput(input, '[data-conteudo-financeiro]', '[data-nome-arquivo-financeiro]'));
  }

  private bindFileInput(input: HTMLElement, conteudoSelector: string, nomeSelector: string): void {
    input.addEventListener('change', async event => {
      const file = (event.currentTarget as HTMLInputElement).files?.[0];
      if (!file) return;
      this.setValue(nomeSelector, file.name);
      this.setValue(conteudoSelector, await file.text());
    });
  }
}
