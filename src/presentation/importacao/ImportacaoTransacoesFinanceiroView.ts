import type { PrepararImportacaoTransacoesUseCase } from '../../application/importacao/PrepararImportacaoTransacoesUseCase';
import type { PrepararImportacaoFinanceiraUseCase } from '../../application/importacao/PrepararImportacaoFinanceiraUseCase';
import type { ListarStagingImportacaoUseCase, StagingImportacaoResumo } from '../../application/importacao/ListarStagingImportacaoUseCase';
import type { ConciliarTransacoesFinanceiroUseCase, ItemConciliacaoImportacao, ResultadoConciliacaoImportacao, StatusConciliacaoImportacao } from '../../application/importacao/ConciliarTransacoesFinanceiroUseCase';
import type { ResolverPendenciaImportacaoUseCase } from '../../application/importacao/ResolverPendenciaImportacaoUseCase';
import type { ConfirmarImportacaoHistoricaFinanceiraUseCase, ConfirmarImportacaoHistoricaFinanceiraResultado } from '../../application/importacao/ConfirmarImportacaoHistoricaFinanceiraUseCase';
import { releaseObject } from '../../runtime/RuntimeCleanup';
import { escapeHtml } from '../shared/ui/Html';
import { renderImportacaoTabs } from './components/ImportacaoTabs';
import type { RegistroImportacaoFinanceira, RegistroImportacaoTransacao, ResumoStagingImportacao } from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

export interface ImportacaoTransacoesFinanceiroDeps {
  prepararTransacoes: PrepararImportacaoTransacoesUseCase;
  prepararFinanceiro: PrepararImportacaoFinanceiraUseCase;
  listarStaging: ListarStagingImportacaoUseCase;
  conciliar: ConciliarTransacoesFinanceiroUseCase;
  resolverPendencia: ResolverPendenciaImportacaoUseCase;
  confirmarHistoricoFinanceiro: ConfirmarImportacaoHistoricaFinanceiraUseCase;
  /** Callback opcional para salvar/descartar o marcador de retomada de transações */
  onRascunhoAtualizado?: (acao: 'salvar' | 'descartar') => Promise<void>;
}

const STATUS_CONCILIACAO_LABEL: Record<StatusConciliacaoImportacao, string> = {
  conciliado: 'Conciliado',
  pendente_sem_financeiro: 'Pendente sem financeiro',
  pendente_sem_transacao: 'Pendente sem transação',
  divergencia_valor: 'Diferença de valor',
  divergencia_perfil: 'Diferença de perfil',
  divergencia_pagamento: 'Diferença de pagamento',
  pagamento_posterior_provavel: 'Pagamento posterior provável',
  revisao_manual: 'Revisão manual'
};

export class ImportacaoTransacoesFinanceiroView {
  private root: HTMLElement | null = null;
  private mensagem = '';
  private conciliacao: ResultadoConciliacaoImportacao | null = null;
  private ultimaConfirmacao: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private previaConfirmacao: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private lotesConfirmacao: ConfirmarImportacaoHistoricaFinanceiraResultado | null = null;
  private confirmacaoArmada = false;
  private revisaoRetomadaLoteId: string | null = null;

  private readonly limiteRenderizacaoMobile = 80;

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
    this.revisaoRetomadaLoteId = null;
    if (this.root) this.root.innerHTML = '';
  }

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    await this.render();
  }

  private resumoCards(label: string, resumo: ResumoStagingImportacao): string {
    return `<div class="import-summary" aria-label="Resumo ${escapeHtml(label)}">
      <strong>${escapeHtml(label)}</strong>
      <span>Total: ${resumo.total}</span>
      <span>Válidos: ${resumo.validos}</span>
      <span>Pendentes: ${resumo.pendentes}</span>
      <span>Perfil: ${resumo.pendentesPerfil}</span>
      <span>Item: ${resumo.pendentesItem}</span>
      <span>Financeiro: ${resumo.pendentesFinanceiro}</span>
    </div>`;
  }

  private statusLabel(status: string): string {
    const labels: Record<string, string> = {
      pendente_cliente: 'Pendente: Perfil',
      pendente_item: 'Pendente: Item',
      pendente_financeiro: 'Pendente: Financeiro',
      validado: 'Validado',
      confirmado: 'Confirmado',
      ignorado: 'Ignorado',
      erro: 'Revisão'
    };
    return labels[status] || status;
  }

  private textoHumano(texto: string): string {
    return texto
      .replace(/staging/gi, 'área de conferência')
      .replace(/pacote/gi, 'revisão salva')
      .replace(/lote de confirmação/gi, 'confirmação salva')
      .replace(/lote/gi, 'grupo')
      .replace(/artefatos?/gi, 'restos parciais')
      .replace(/pré-visualizar/gi, 'ver antes')
      .replace(/congelar/gi, 'salvar revisão')
      .replace(/conciliar/gi, 'conferir pagamentos')
      .replace(/conciliação/gi, 'conferência de pagamentos')
      .replace(/DESFAZER/g, 'CANCELAR COM CUIDADO');
  }

  private detalheSeguroParaHumano(mensagem?: string): string {
    if (!mensagem) return '';
    return this.textoHumano(mensagem)
      .replace(/[A-Za-z]+-[0-9][A-Za-z0-9-]*/g, 'identificador interno protegido')
      .replace(/loteConfirmacaoId/gi, 'identificador interno protegido');
  }

  private pendencias(registro: RegistroImportacaoTransacao | RegistroImportacaoFinanceira): string {
    if (!registro.pendencias.length) return '<span class="status-pill success">Validado</span>';
    return `<ul class="compact-list">${registro.pendencias.slice(0, 3).map(p => `<li>${escapeHtml(p.mensagem)}</li>`).join('')}</ul>`;
  }

  private tabelaTransacoes(registros: RegistroImportacaoTransacao[]): string {
    const rows = registros.slice().reverse().map(registro => `<tr>
      <td>#${escapeHtml(registro.numeroOriginal || '—')}</td>
      <td>${escapeHtml(registro.clienteNomeImportado || '—')}</td>
      <td>${escapeHtml(this.statusLabel(registro.status))}</td>
      <td>${this.pendencias(registro)}</td>
      <td class="compact-actions"><button type="button" class="icon-button text-icon" data-resolver-revisao="transacao:${escapeHtml(registro.id)}">⚑ Revisar</button><button type="button" class="icon-button text-icon danger" data-resolver-ignorar="transacao:${escapeHtml(registro.id)}">× Ignorar</button></td>
    </tr>`).join('');
    return `<table class="kzera-table compact-table"><thead><tr><th>Transação</th><th>Perfil</th><th>Status</th><th>Pendências</th><th>Ações</th></tr></thead><tbody>${rows || '<tr><td colspan="5">Nenhuma registro em conferência.</td></tr>'}</tbody></table>`;
  }

  private detalhesConciliacao(item: ItemConciliacaoImportacao): string {
    const detalhes = item.detalhes.map(detalhe => `<li>${escapeHtml(detalhe)}</li>`).join('');
    const bloqueio = item.bloqueioAprovacaoMassa ? `<p class="form-hint">Fica fora da aprovação segura: ${escapeHtml(item.bloqueioAprovacaoMassa)}</p>` : '';
    return `<details class="inline-details"><summary>Ver detalhes da conferência</summary><ul class="compact-list">${detalhes}</ul>${bloqueio}</details>`;
  }

  private acaoConciliacao(item: ItemConciliacaoImportacao): string {
    const vincular = item.status === 'pagamento_posterior_provavel' && item.registroTransacaoId && item.registroFinanceiroIds[0]
      ? `<button type="button" class="icon-button text-icon primary-icon" data-resolver-vinculo="${escapeHtml(item.registroTransacaoId)}:${escapeHtml(item.registroFinanceiroIds[0] || '')}">✓ Juntar pagamento</button>`
      : '';
    const revisarTransacao = item.registroTransacaoId
      ? `<button type="button" class="icon-button text-icon" data-resolver-revisao="transacao:${escapeHtml(item.registroTransacaoId)}">⚑ Revisar</button>`
      : '';
    const revisarFinanceiro = item.registroFinanceiroIds[0] && !item.registroTransacaoId
      ? `<button type="button" class="icon-button text-icon" data-resolver-revisao="financeiro:${escapeHtml(item.registroFinanceiroIds[0] || '')}">⚑ Revisar</button>`
      : '';
    return `${vincular}${revisarTransacao}${revisarFinanceiro}`;
  }


  private checkboxAprovacaoMassa(item: ItemConciliacaoImportacao): string {
    if (!item.aprovavelEmMassa || !item.registroTransacaoId || !item.registroFinanceiroIds[0]) return '<span class="status-pill muted">Fica fora</span>';
    const tipo = item.tipoAprovacaoMassa || 'pagamento_posterior';
    const value = `${item.registroTransacaoId}:${item.registroFinanceiroIds[0]}:${tipo}`;
    return `<label class="bulk-check"><input type="checkbox" data-massa-vinculo value="${escapeHtml(value)}" checked /> <span>Está certo</span></label>`;
  }

  private conciliacaoView(): string {
    if (!this.conciliacao) {
      return `<section class="kzera-card soft-card"><h3>Conferência dos pagamentos</h3><p class="form-hint">Depois de preparar as duas planilhas, confira os pagamentos para ver o que bateu e o que precisa de atenção.</p><button class="icon-button text-icon primary-icon" type="button" data-conciliar-importacao>✓ Conferir pagamentos</button></section>`;
    }
    const r = this.conciliacao.resumo;
    const itensVisiveis = this.conciliacao.itens.slice(0, this.limiteRenderizacaoMobile);
    const itensOcultos = Math.max(0, this.conciliacao.itens.length - itensVisiveis.length);
    const avisoLimite = itensOcultos > 0
      ? `<p class="form-hint" data-conciliacao-limite-mobile>Mostrando ${itensVisiveis.length} de ${this.conciliacao.itens.length} itens para não travar o iPhone. Use o resumo antes de abrir mais detalhes.</p>`
      : '';
    const rows = itensVisiveis.map(item => `<tr>
      <td>${this.checkboxAprovacaoMassa(item)}</td>
      <td>#${escapeHtml(item.numeroTransacao || '—')}</td>
      <td>${escapeHtml(STATUS_CONCILIACAO_LABEL[item.status] || item.status)}</td>
      <td>${escapeHtml(item.confianca)}</td>
      <td>${item.valorPendenteTransacao !== undefined ? escapeHtml(String(item.valorPendenteTransacao)) : '—'}</td>
      <td>${escapeHtml(item.sugestao || '—')}${this.detalhesConciliacao(item)}</td>
      <td class="compact-actions">${this.acaoConciliacao(item)}</td>
    </tr>`).join('');
    const desfazerMassa = r.aprovadosEmMassa > 0
      ? `<button class="icon-button text-icon danger" type="button" data-desfazer-aprovacao-massa>↶ Cancelar aprovação conjunta</button>`
      : '';
    const aprovacaoMassa = r.aprovaveisEmMassa > 0
      ? `<div class="bulk-approval-box"><strong>${r.aprovaveisEmMassa} pagamentos que parecem certos para marcar juntos.</strong><p class="form-hint">O que parece certo já vem marcado. Desmarque só se perceber algo estranho. O incompleto fica fora automaticamente.</p><div class="compact-actions"><button class="icon-button text-icon" type="button" data-marcar-massa>☑ Marcar certos</button><button class="icon-button text-icon" type="button" data-desmarcar-massa>☐ Desmarcar</button><button class="icon-button text-icon primary-icon" type="button" data-aprovar-massa-segura>✓ Marcar como certo</button>${desfazerMassa}</div></div>`
      : `<div class="bulk-approval-box"><p class="form-hint">Nenhum pagamento parece certo para marcar junto agora.</p>${desfazerMassa}</div>`;
    return `<section class="kzera-card soft-card" data-testid="conciliacao-transacoes-financeiro">
      <h3>Conferência dos pagamentos</h3>
      <div class="import-summary" aria-label="Resumo da conferência">
        <span>Registros: ${r.totalTransacoes}</span>
        <span>Pagamentos: ${r.totalMovimentos}</span>
        <span>Pagamentos ok: ${r.conciliados}</span>
        <span>Pendentes: ${r.pendentes}</span>
        <span>Diferenças para revisar: ${r.divergencias}</span>
        <span>Pagamentos que parecem posteriores: ${r.sugestoesPagamentoPosterior}</span>
        <span>Parecem certos: ${r.aprovaveisEmMassa}</span>
        <span>Ficam para revisar: ${r.bloqueadosAprovacaoMassa}</span>
        <span>Já marcados: ${r.aprovadosEmMassa}</span>
      </div>
      ${aprovacaoMassa}
      ${avisoLimite}
      <div class="compact-actions"><button class="icon-button text-icon primary-icon" type="button" data-conciliar-importacao>↻ Conferir novamente</button><button class="icon-button text-icon" type="button" data-expandir-vinculos>▾ Mostrar detalhes</button><button class="icon-button text-icon" type="button" data-recolher-vinculos>▴ Esconder detalhes</button></div>
      <table class="kzera-table compact-table"><thead><tr><th>Está certo?</th><th>Registro</th><th>Situação</th><th>Confiança</th><th>Valor a resolver</th><th>Orientação</th><th>Ações</th></tr></thead><tbody>${rows || '<tr><td colspan="7">Nenhum item para conferir.</td></tr>'}</tbody></table>
    </section>`;
  }


  private retomadaHumanaObrigatoriaView(): string {
    const pacotes = this.lotesConfirmacao?.pacotesComFalha || [];
    if (!pacotes.length) return '';
    const principal = pacotes[0]!;
    const outros = pacotes.slice(1);
    const revisando = this.revisaoRetomadaLoteId === principal.loteConfirmacaoId;
    const detalhePrincipal = revisando && principal.falhaMensagem
      ? `<details class="inline-details" data-detalhe-avancado-retomada><summary>Ver detalhe avançado</summary><p class="form-hint">${escapeHtml(this.detalheSeguroParaHumano(principal.falhaMensagem))}</p></details>`
      : '';
    const revisaoHtml = revisando
      ? `<div class="recovery-review" data-revisao-retomada-aberta tabindex="-1">
          <h4>O que aconteceu</h4>
          <p><strong>Nada foi perdido e nada será confirmado sozinho.</strong></p>
          <p class="form-hint">A confirmação parou antes de terminar. O sistema guardou uma revisão protegida para você voltar com calma.</p>
          <div class="safe-step-list" aria-label="Passos seguros da retomada">
            <p><strong>1.</strong> Vamos limpar só restos parciais da tentativa interrompida.</p>
            <p><strong>2.</strong> Depois abrimos a revisão salva para você conferir.</p>
            <p><strong>3.</strong> Você só confirma quando tocar no botão final.</p>
          </div>
          <div class="import-summary" aria-label="Resumo simples da retomada">
            <span>Registros protegidos: ${principal.totalTransacoes}</span>
            <span>Situação: ${escapeHtml(principal.status === 'confirmando' ? 'parou no meio e precisa de cuidado' : 'aguardando sua revisão')}</span>
          </div>
          ${detalhePrincipal}
        </div>`
      : '';
    const outrosHtml = outros.length
      ? `<details class="inline-details" data-retomadas-adicionais><summary>Outras revisões guardadas (${outros.length})</summary><ul class="compact-list">${outros.map(lote => `<li>${lote.totalTransacoes} itens protegidos <button class="icon-button text-icon" type="button" data-revisar-confirmacao-interrompida data-lote-confirmacao-id="${escapeHtml(lote.loteConfirmacaoId)}">Ver o que aconteceu</button></li>`).join('')}</ul></details>`
      : '';
    const primaryAction = revisando
      ? `<button class="icon-button text-icon primary-icon" type="button" data-retomar-confirmacao-segura data-lote-confirmacao-id="${escapeHtml(principal.loteConfirmacaoId)}">Limpar restos e abrir revisão</button>`
      : `<button class="icon-button text-icon primary-icon" type="button" data-revisar-confirmacao-interrompida data-lote-confirmacao-id="${escapeHtml(principal.loteConfirmacaoId)}">Ver o que aconteceu</button>`;
    return `<section class="kzera-card soft-card recovery-card" data-testid="retomada-humana-confirmacao" data-retomada-principal data-lote-confirmacao-id="${escapeHtml(principal.loteConfirmacaoId)}">
      <span class="eyebrow">Voltar com calma</span>
      <h3>Encontramos uma confirmação interrompida.</h3>
      <p><strong>Nada foi perdido.</strong></p>
      <p class="form-hint">Seu histórico ainda está seguro. Primeiro veja o que aconteceu. Depois você escolhe limpar os restos e abrir a revisão.</p>
      <div class="import-summary" aria-label="Resumo simples da confirmação interrompida">
        <span>Registros protegidos: ${principal.totalTransacoes}</span>
        <span>Situação: ${escapeHtml(principal.status === 'confirmando' ? 'parou no meio e precisa de cuidado' : 'aguardando sua revisão')}</span>
      </div>
      <div class="compact-actions">
        ${primaryAction}
        ${revisando ? '<span class="form-hint">Esse botão não confirma nada sozinho.</span>' : ''}
      </div>
      ${revisaoHtml}
      ${outrosHtml}
    </section>`;
  }

  private confirmacaoHistoricaView(): string {
    const resumo = this.ultimaConfirmacao;
    const previa = this.previaConfirmacao;
    const painel = previa || resumo;
    const resumoHtml = painel
      ? `<div class="import-summary" aria-label="Resumo simples da revisão antes de confirmar">
          <span>Registros que podem entrar: ${painel.transacoesPrevistas}</span>
          <span>Pagamentos encontrados: ${painel.pagamentosPrevistos}</span>
          <span>Registros que precisam de atenção: ${painel.registrosBloqueados}</span>
          <span>Período: ${escapeHtml(painel.primeiraData || '—')} até ${escapeHtml(painel.ultimaData || '—')}</span>
        </div>
        <details class="inline-details" data-detalhes-financeiros-avancados><summary>Ver valores financeiros</summary>
          <div class="import-summary" aria-label="Valores financeiros da revisão">
            <span>Faturamento: ${painel.faturamentoTotal}</span>
            <span>Custo: ${painel.custoTotal}</span>
            <span>Lucro: ${painel.lucroTotal}</span>
            <span>Pago: ${painel.valorPagoTotal}</span>
            <span>Pendente: ${painel.valorPendenteTotal}</span>
            <span>Movimentos previstos: ${painel.movimentosPrevistos}</span>
            <span>Transações criadas: ${painel.transacoesCriadas}</span>
            <span>Pagamentos criados: ${painel.pagamentosCriados}</span>
            <span>Movimentos criados: ${painel.movimentosCriados}</span>
          </div>
        </details>`
      : '';
    const bloqueios = painel?.bloqueios.length
      ? `<details class="inline-details" data-confirmacao-bloqueios><summary>Ver o que precisa de atenção (${painel.bloqueios.length})</summary><div class="compact-actions"><button class="icon-button text-icon" type="button" data-exportar-bloqueios-confirmacao>Copiar lista completa</button></div><textarea class="readonly-export" readonly rows="6" data-bloqueios-exportacao>${escapeHtml(painel.bloqueiosExportacao || painel.bloqueios.join('\n'))}</textarea><ul class="compact-list">${painel.bloqueios.map(aviso => `<li>${escapeHtml(this.textoHumano(aviso))}</li>`).join('')}</ul></details>`
      : '';
    const avisos = painel?.avisos.length
      ? `<details class="inline-details"><summary>Ver avisos (${painel.avisos.length})</summary><ul class="compact-list">${painel.avisos.map(aviso => `<li>${escapeHtml(this.textoHumano(aviso))}</li>`).join('')}</ul></details>`
      : '';
    const botaoConfirmar = previa && previa.transacoesPrevistas > 0 && this.confirmacaoArmada
      ? `<button class="icon-button text-icon primary-icon" type="button" data-confirmar-historico-financeiro data-previa-id="${escapeHtml(previa.previaId)}">✓ Confirmar agora</button>`
      : '';
    const botaoArmar = previa && previa.transacoesPrevistas > 0 && !this.confirmacaoArmada
      ? `<button class="icon-button text-icon" type="button" data-armar-confirmacao-historico>Estou pronta para confirmar</button>`
      : '';
    const lotesPersistidos = this.lotesConfirmacao?.pacotesConfirmados.length
      ? `<details class="inline-details danger-zone" data-lotes-confirmados><summary>Área avançada: corrigir algo já confirmado (${this.lotesConfirmacao.pacotesConfirmados.length})</summary><p class="form-hint">Use só se tiver certeza. Para liberar o botão, digite CANCELAR COM CUIDADO.</p><input data-token-corrigir-confirmacao placeholder="Digite CANCELAR COM CUIDADO" /><ul class="compact-list">${this.lotesConfirmacao.pacotesConfirmados.map(lote => `<li>${lote.totalTransacoes} registros — ${escapeHtml(lote.confirmadoEm || 'sem data')} <button class="icon-button text-icon danger" type="button" data-corrigir-confirmacao-salva data-lote-confirmacao-id="${escapeHtml(lote.loteConfirmacaoId)}">↶ Corrigir confirmação</button></li>`).join('')}</ul></details>`
      : '';
    const falhasPersistidas = '';
    const avisoConfirmado = resumo?.loteConfirmacaoId && resumo.transacoesCriadas > 0
      ? `<p class="form-hint">Confirmação salva. Se precisar corrigir, use a área avançada abaixo.</p>`
      : '';
    return `<section class="kzera-card soft-card" data-testid="confirmacao-historico-financeiro">
      <h3>Revisar e confirmar histórico</h3>
      <p class="form-hint">Aqui você confere antes de transformar o histórico em registros definitivos. Estoque não será mexido.</p>
      <p class="form-hint">Fluxo seguro: ver antes, respirar, confirmar só quando estiver pronta.</p>
      ${resumoHtml}${bloqueios}${avisos}
      <div class="compact-actions">
        <button class="icon-button text-icon" type="button" data-previsualizar-historico-financeiro>👁 Ver antes de confirmar</button>
        ${botaoArmar}
        ${botaoConfirmar}
        ${avisoConfirmado}
      </div>
      ${lotesPersistidos}${falhasPersistidas}
    </section>`;
  }

  private tabelaFinanceiro(registros: RegistroImportacaoFinanceira[]): string {
    const rows = registros.slice().reverse().map(registro => `<tr>
      <td>#${escapeHtml(registro.numeroTransacaoReferenciado || '—')}</td>
      <td>${escapeHtml(registro.clienteNomeImportado || '—')}</td>
      <td>${escapeHtml(this.statusLabel(registro.status))}</td>
      <td>${this.pendencias(registro)}</td>
      <td class="compact-actions"><button type="button" class="icon-button text-icon" data-resolver-revisao="financeiro:${escapeHtml(registro.id)}">⚑ Revisar</button><button type="button" class="icon-button text-icon danger" data-resolver-ignorar="financeiro:${escapeHtml(registro.id)}">× Ignorar</button></td>
    </tr>`).join('');
    return `<table class="kzera-table compact-table"><thead><tr><th>Ref.</th><th>Perfil</th><th>Status</th><th>Pendências</th><th>Ações</th></tr></thead><tbody>${rows || '<tr><td colspan="5">Nenhum pagamento em conferência.</td></tr>'}</tbody></table>`;
  }

  private template(staging: StagingImportacaoResumo): string {
    return `<section class="kzera-screen import-only-screen import-transacoes-screen import-page-background" data-testid="importacao-transacoes-financeiro">
      <section class="kzera-card import-screen import-transacoes-panel importPanel import-panel">
      ${renderImportacaoTabs('transacoes')}
      <p class="form-hint">Nada vira registro definitivo aqui: nada baixa estoque. Tudo fica em conferência até você confirmar.</p>
      ${this.retomadaHumanaObrigatoriaView()}
      ${this.mensagem ? `<div class="toast">${escapeHtml(this.mensagem)}</div>` : ''}
      <div class="import-grid">
        <form data-import-transacoes class="kzera-card soft-card">
          <h3>Planilha de registros</h3>
          <label><span>Nome do arquivo</span><input name="nomeArquivo" value="transacoes.csv" data-nome-arquivo-transacoes /></label>
          <label class="file-upload-label"><span>Escolher arquivo CSV</span><input type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain" data-file-upload-transacoes aria-label="Escolher arquivo de registros" /></label>
          <label><span>Ou cole o conteúdo aqui</span><textarea name="conteudo" rows="5" placeholder="Cole a planilha de registros aqui" data-conteudo-transacoes></textarea></label>
          <button class="icon-button text-icon primary-icon" type="submit">⇩ Preparar registros</button>
        </form>
        <form data-import-financeiro class="kzera-card soft-card">
          <h3>Movimentações financeiras</h3>
          <label><span>Nome do arquivo</span><input name="nomeArquivo" value="financeiro.csv" data-nome-arquivo-financeiro /></label>
          <label class="file-upload-label"><span>Escolher arquivo CSV</span><input type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain" data-file-upload-financeiro aria-label="Escolher arquivo financeiro" /></label>
          <label><span>Ou cole o conteúdo aqui</span><textarea name="conteudo" rows="5" placeholder="Cole a planilha financeira aqui" data-conteudo-financeiro></textarea></label>
          <button class="icon-button text-icon primary-icon" type="submit">⇩ Preparar financeiro</button>
        </form>
      </div>
      <section class="kzera-card soft-card">
        <h3>Resumo da conferência</h3>
        <div class="import-grid two-cols">${this.resumoCards('Registros', staging.resumoTransacoes)}${this.resumoCards('Financeiro', staging.resumoFinanceiro)}</div>
      </section>
      <section class="kzera-card soft-card"><h3>Últimos registros importados</h3><p class="form-hint">Mostrando no máximo ${staging.limiteVisualizacao} de ${staging.totalRegistrosTransacoes} itens para não travar o iPhone.</p>${this.tabelaTransacoes(staging.registrosTransacoes)}</section>
      <section class="kzera-card soft-card"><h3>Últimas movimentações financeiras</h3><p class="form-hint">Mostrando no máximo ${staging.limiteVisualizacao} de ${staging.totalRegistrosFinanceiros} itens para não travar o iPhone.</p>${this.tabelaFinanceiro(staging.registrosFinanceiros)}</section>
      ${this.conciliacaoView()}
      ${this.confirmacaoHistoricaView()}
      </section>
    </section>`;
  }

  private async render(): Promise<void> {
    if (!this.root) return;
    const [staging, lotes] = await Promise.all([
      this.deps.listarStaging.execute(),
      this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'listar_lotes' })
    ]);
    this.lotesConfirmacao = lotes;
    this.root.innerHTML = this.template(staging);
    this.bind();
  }

  private async atualizarConciliacao(): Promise<void> {
    this.conciliacao = await this.deps.conciliar.execute();
  }

  private bindFileUpload(seletor: string, nomeArquivoSeletor: string, conteudoSeletor: string): void {
    const fileInput = this.root?.querySelector<HTMLInputElement>(seletor);
    if (!fileInput) return;
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const nomeInput = this.root?.querySelector<HTMLInputElement>(nomeArquivoSeletor);
      if (nomeInput) nomeInput.value = file.name;
      const reader = new FileReader();
      reader.onload = (event) => {
        const textarea = this.root?.querySelector<HTMLTextAreaElement>(conteudoSeletor);
        if (textarea) textarea.value = String(event.target?.result || '');
      };
      reader.readAsText(file, 'UTF-8');
    });
  }

  private bind(): void {
    this.bindFileUpload('[data-file-upload-transacoes]', '[data-nome-arquivo-transacoes]', '[data-conteudo-transacoes]');
    this.bindFileUpload('[data-file-upload-financeiro]', '[data-nome-arquivo-financeiro]', '[data-conteudo-financeiro]');
    this.root?.querySelector('[data-expandir-vinculos]')?.addEventListener('click', () => {
      this.root?.querySelectorAll<HTMLDetailsElement>('.inline-details').forEach(details => { details.open = true; });
    });
    this.root?.querySelector('[data-recolher-vinculos]')?.addEventListener('click', () => {
      this.root?.querySelectorAll<HTMLDetailsElement>('.inline-details').forEach(details => { details.open = false; });
    });
    this.root?.querySelector('[data-marcar-massa]')?.addEventListener('click', () => {
      this.root?.querySelectorAll<HTMLInputElement>('[data-massa-vinculo]').forEach(input => { input.checked = true; });
    });
    this.root?.querySelector('[data-desmarcar-massa]')?.addEventListener('click', () => {
      this.root?.querySelectorAll<HTMLInputElement>('[data-massa-vinculo]').forEach(input => { input.checked = false; });
    });
    this.root?.querySelector('[data-aprovar-massa-segura]')?.addEventListener('click', async () => {
      const selecionados = Array.from(this.root?.querySelectorAll<HTMLInputElement>('[data-massa-vinculo]:checked') || []);
      const vinculos = selecionados.map(input => {
        const [registroTransacaoId = '', registroFinanceiroId = '', tipoAprovacao = 'pagamento_posterior'] = input.value.split(':');
        return { registroTransacaoId, registroFinanceiroId, tipoAprovacao: tipoAprovacao as 'referencia' | 'pagamento_posterior' };
      });
      if (!vinculos.length) { this.mensagem = 'Nenhum pagamento marcado para confirmar junto.'; await this.render(); return; }
      try {
        const result = await this.deps.resolverPendencia.execute({ acao: 'vincular_financeiro_em_massa', vinculos });
        this.mensagem = result.mensagem;
        await this.atualizarConciliacao();
      } catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível aprovar em massa.'; }
      await this.render();
    });
    this.root?.querySelector('[data-desfazer-aprovacao-massa]')?.addEventListener('click', async () => {
      try {
        const result = await this.deps.resolverPendencia.execute({ acao: 'desfazer_aprovacao_massa' });
        this.mensagem = result.mensagem;
        await this.atualizarConciliacao();
      } catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível desfazer a aprovação em massa.'; }
      await this.render();
    });
    this.root?.querySelectorAll('[data-resolver-vinculo]').forEach(button => {
      button.addEventListener('click', async () => {
        const parts = ((button as HTMLElement).dataset.resolverVinculo || '').split(':');
        const registroTransacaoId = parts[0] || '';
        const registroFinanceiroId = parts[1] || '';
        try {
          const result = await this.deps.resolverPendencia.execute({ acao: 'vincular_financeiro', registroTransacaoId, registroFinanceiroId });
          this.mensagem = result.mensagem;
          await this.atualizarConciliacao();
        } catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível resolver o vínculo.'; }
        await this.render();
      });
    });
    this.root?.querySelectorAll('[data-resolver-revisao]').forEach(button => {
      button.addEventListener('click', async () => {
        const [tipo, registroId] = ((button as HTMLElement).dataset.resolverRevisao || '').split(':') as ['transacao' | 'financeiro', string];
        try {
          const result = await this.deps.resolverPendencia.execute({ acao: 'marcar_revisao', tipo, registroId });
          this.mensagem = result.mensagem;
          await this.atualizarConciliacao();
        } catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível marcar revisão.'; }
        await this.render();
      });
    });
    this.root?.querySelectorAll('[data-resolver-ignorar]').forEach(button => {
      button.addEventListener('click', async () => {
        const [tipo, registroId] = ((button as HTMLElement).dataset.resolverIgnorar || '').split(':') as ['transacao' | 'financeiro', string];
        try {
          const result = await this.deps.resolverPendencia.execute({ acao: 'ignorar', tipo, registroId });
          this.mensagem = result.mensagem;
          await this.atualizarConciliacao();
        } catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível ignorar o registro.'; }
        await this.render();
      });
    });
    this.root?.querySelector('[data-conciliar-importacao]')?.addEventListener('click', async () => {
      await this.atualizarConciliacao();
      this.mensagem = `Conferência pronta: ${this.conciliacao?.resumo.conciliados || 0} pagamentos conferidos, ${this.conciliacao?.resumo.aprovaveisEmMassa || 0} parecem certos para marcar juntos.`;
      await this.render();
    });
    this.root?.querySelector('[data-previsualizar-historico-financeiro]')?.addEventListener('click', async () => {
      try {
        const result = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'previsualizar' });
        this.previaConfirmacao = result;
        this.ultimaConfirmacao = null;
        this.confirmacaoArmada = false;
        this.mensagem = `Revisão pronta: ${result.transacoesPrevistas} registros podem entrar. Estoque não será alterado. Confira os detalhes antes de confirmar.`;
      } catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível abrir a revisão do histórico financeiro.'; }
      await this.render();
    });
    this.root?.querySelector('[data-armar-confirmacao-historico]')?.addEventListener('click', async () => {
      this.confirmacaoArmada = true;
      this.mensagem = 'Tudo certo para confirmar. Respire, revise uma última vez e toque em confirmar agora.';
      await this.render();
    });
    this.root?.querySelector('[data-confirmar-historico-financeiro]')?.addEventListener('click', async () => {
      const previaId = (this.root?.querySelector('[data-confirmar-historico-financeiro]') as HTMLElement | null)?.dataset.previaId || this.previaConfirmacao?.previaId;
      try {
        if (!previaId) { this.mensagem = 'Abra a revisão antes de confirmar o histórico financeiro.'; await this.render(); return; }
        const result = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'confirmar', previaId });
        this.ultimaConfirmacao = result;
        this.previaConfirmacao = null;
        this.confirmacaoArmada = false;
        this.mensagem = `Histórico confirmado: ${result.transacoesCriadas} registros foram salvas. Estoque não foi alterado.`;
        if (this.deps.onRascunhoAtualizado) {
          try { await this.deps.onRascunhoAtualizado('descartar'); } catch { /* best-effort */ }
        }
        await this.atualizarConciliacao();
      } catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível confirmar o histórico financeiro.'; }
      await this.render();
    });
    this.root?.querySelector('[data-exportar-bloqueios-confirmacao]')?.addEventListener('click', async () => {
      const textarea = this.root?.querySelector<HTMLTextAreaElement>('[data-bloqueios-exportacao]');
      const texto = textarea?.value || this.previaConfirmacao?.bloqueiosExportacao || this.ultimaConfirmacao?.bloqueiosExportacao || '';
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) await navigator.clipboard.writeText(texto);
        this.mensagem = 'Lista completa copiada para revisão.';
      } catch (_) {
        this.mensagem = 'Lista completa disponível no campo de revisão.';
      }
      await this.render();
    });
    this.root?.querySelectorAll('[data-corrigir-confirmacao-salva]').forEach(button => button.addEventListener('click', async () => {
      const loteConfirmacaoId = (button as HTMLElement).dataset.loteConfirmacaoId || this.ultimaConfirmacao?.loteConfirmacaoId;
      const textoDigitado = this.root?.querySelector<HTMLInputElement>('[data-token-corrigir-confirmacao]')?.value || '';
      const confirmacaoDesfazerTexto = textoDigitado.trim().toUpperCase() === 'CANCELAR COM CUIDADO' ? 'DESFAZER' : textoDigitado;
      try {
        if (!loteConfirmacaoId) { this.mensagem = 'Nenhuma confirmação salva para corrigir agora.'; await this.render(); return; }
        const result = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'desfazer_lote', loteConfirmacaoId, confirmacaoDesfazerTexto });
        this.ultimaConfirmacao = result;
        this.previaConfirmacao = null;
        this.confirmacaoArmada = false;
        this.mensagem = `Correção concluída: ${result.transacoesDesfeitas || 0} registros, ${result.pagamentosDesfeitos || 0} pagamentos e ${result.movimentosDesfeitos || 0} movimentos foram removidos.`;
        await this.atualizarConciliacao();
      } catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível corrigir a confirmação salva.'; }
      await this.render();
    }));
    this.root?.querySelectorAll('[data-retomar-confirmacao-segura]').forEach(button => button.addEventListener('click', async () => {
      const loteConfirmacaoId = (button as HTMLElement).dataset.loteConfirmacaoId || '';
      try {
        const result = await this.deps.confirmarHistoricoFinanceiro.execute({ modo: 'recuperar_falha', loteConfirmacaoId });
        this.previaConfirmacao = result;
        this.ultimaConfirmacao = null;
        this.confirmacaoArmada = true;
        this.revisaoRetomadaLoteId = null;
        this.mensagem = `Pronto. Nada foi perdido. Limpamos restos parciais e abrimos a revisão para você conferir antes de confirmar.`;
        await this.atualizarConciliacao();
      } catch (error) { this.mensagem = error instanceof Error ? error.message : 'Não foi possível abrir a retomada agora.'; }
      await this.render();
    }));
    this.root?.querySelectorAll('[data-revisar-confirmacao-interrompida]').forEach(button => button.addEventListener('click', async () => {
      const loteConfirmacaoId = (button as HTMLElement).dataset.loteConfirmacaoId || '';
      this.revisaoRetomadaLoteId = loteConfirmacaoId || null;
      this.mensagem = 'Revisão protegida aberta. Nada foi perdido. Leia com calma; nenhum dado será confirmado sozinho.';
      await this.render();
      this.root?.querySelector<HTMLElement>('[data-revisao-retomada-aberta]')?.focus();
    }));
    this.root?.querySelector('[data-import-transacoes]')?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const data = new FormData(form);
      const conteudo = String(data.get('conteudo') || '');
      if (!conteudo.trim()) { this.mensagem = 'Cole o conteúdo da planilha de registros antes de preparar.'; await this.render(); return; }
      const resultado = await this.deps.prepararTransacoes.execute({ nomeArquivo: String(data.get('nomeArquivo') || 'transacoes.csv'), conteudo });
      this.mensagem = `Registros preparados: ${resultado.resumo.total} linhas, ${resultado.resumo.pendentes} precisam de atenção.`;
      if (this.deps.onRascunhoAtualizado) {
        try { await this.deps.onRascunhoAtualizado('salvar'); } catch { /* best-effort */ }
      }
      await this.render();
    });
    this.root?.querySelector('[data-import-financeiro]')?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const data = new FormData(form);
      const conteudo = String(data.get('conteudo') || '');
      if (!conteudo.trim()) { this.mensagem = 'Cole o conteúdo da planilha financeira antes de preparar.'; await this.render(); return; }
      const resultado = await this.deps.prepararFinanceiro.execute({ nomeArquivo: String(data.get('nomeArquivo') || 'financeiro.csv'), conteudo });
      this.mensagem = `Pagamentos preparados: ${resultado.resumo.total} linhas, ${resultado.resumo.pendentes} precisam de atenção.`;
      if (this.deps.onRascunhoAtualizado) {
        try { await this.deps.onRascunhoAtualizado('salvar'); } catch { /* best-effort */ }
      }
      await this.render();
    });
  }
}
