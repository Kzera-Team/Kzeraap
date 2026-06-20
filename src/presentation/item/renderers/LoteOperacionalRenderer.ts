import type { ItemCatalogo, ItemLote, ItemVariacao, FracionamentoLote } from '../../../domain/item/ItemCatalogo';
import { resumoOperacionalDoLote } from '../../../domain/item/ItemCatalogo';
import type { Balanca } from '../../../domain/operacao/Balanca';
import { exigirBalancaParaPesagem, selecionarBalancaOperacional } from '../../../domain/operacao/Balanca';
import { calcularResumoSessao, formatarAtalhoPesoHumano, statusOperacionalSessaoPesagem, divergenciaRegistrosFracionamento, type SessaoPesagemRapida } from '../../../domain/operacao/PesagemRapida';
import { escapeHtml } from '../../shared/ui/Html';
import { infoItem } from '../../shared/ui/InfoItem';
import { badge } from '../../shared/ui/Badge';

function quantidade(valor: number, unidade: string): string {
  return `${valor.toFixed(3)} ${escapeHtml(unidade)}`;
}

function dinheiro(valor: number): string {
  return `R$ ${valor.toFixed(2)}`;
}

function dataHoje(): string {
  return new Date().toISOString().slice(0, 10);
}

function pesoHumanoMg(mg: number): string {
  return mg >= 1000 ? `${(mg / 1000).toLocaleString('pt-BR')} g` : `${mg.toLocaleString('pt-BR')} mg`;
}

export class LoteOperacionalRenderer {
  render(input: { item: ItemCatalogo; variacao: ItemVariacao; lote: ItemLote; balancas: Balanca[] }): string {
    const { item, variacao, lote, balancas } = input;
    const resumo = resumoOperacionalDoLote(lote);
    const loteNome = lote.nome?.trim() || 'Entrada sem nome';

    return `<section class="kzera-screen lote-detail-screen" data-testid="lote-operacional-screen">
      <header class="kzera-operational-header lote-operational-header" data-testid="lote-operacional-header">
        <button class="icon-button text-icon" type="button" data-action="voltar-lista-itens" aria-label="Voltar para itens" title="Voltar para itens">← Itens</button>
        <div class="kzera-operational-title">
          <span class="eyebrow">Estoque</span>
          <h1>${escapeHtml(loteNome)}</h1>
          <p class="item-meta">${escapeHtml(item.nome)} • ${escapeHtml(variacao.nome)} • unidade base: ${escapeHtml(variacao.unidade)}</p>
        </div>
        ${badge(lote.status, lote.status === 'ativo' ? 'success' : lote.status === 'divergente' ? 'warning' : 'neutral')}
      </header>

      <section class="kzera-card lote-operational-summary" data-testid="lote-operacional-resumo">
        <div class="kzera-section-title compact-title">
          <div><span class="eyebrow">Resumo</span><h2>Estoque físico</h2></div>
        </div>
        <div class="kzera-info-grid item-commercial-grid">
          ${infoItem('Quantidade total', quantidade(resumo.quantidadeTotalBase, variacao.unidade))}
          ${infoItem('Guardado/a granel', quantidade(resumo.quantidadeGuardadaBase, variacao.unidade), 'price-highlight')}
          ${infoItem('Fracionado criado', quantidade(resumo.quantidadeFracionadaCriadaBase, variacao.unidade))}
          ${infoItem('Fracionado disponível', quantidade(resumo.quantidadeFracionadaDisponivelBase, variacao.unidade))}
          ${infoItem('Disponível agora', quantidade(resumo.estoqueDisponivelBase, variacao.unidade), 'price-highlight')}
          ${infoItem('Retirada interna', quantidade(resumo.quantidadeRetiradaBase, variacao.unidade))}
        </div>
      </section>

      <nav class="item-tabs module-tabs" data-testid="lote-operacional-tabs" aria-label="Controle de estoque">
        <button type="button" class="active" data-lote-view-tab="resumo">Resumo</button>
        <button type="button" data-lote-view-tab="fracionamentos">Separações</button>
        <button type="button" data-lote-view-tab="pesagem">Pesagem</button>
        <button type="button" data-lote-view-tab="conferencia">Conferência</button>
        <button type="button" data-lote-view-tab="retirada">Retirada interna</button>
      </nav>

      <section class="kzera-card" data-lote-view-panel="resumo" data-testid="lote-operacional-custos">
        <div class="kzera-section-title compact-title"><div><span class="eyebrow">Custo</span><h2>Custo e rastreio</h2></div></div>
        <div class="kzera-info-grid item-commercial-grid">
          ${infoItem('Custo total', dinheiro(resumo.custoTotal))}
          ${infoItem('Custo unitário', dinheiro(resumo.custoUnitario))}
          ${infoItem('Valor do item', dinheiro(lote.valor))}
          ${infoItem('Lançamento', escapeHtml(lote.dataLancamento ? lote.dataLancamento.slice(0, 10) : 'Sem data'))}
          ${infoItem('Conferências', String(resumo.totalConferencias))}
          ${infoItem('Retiradas', String(resumo.totalRetiradasInternas))}
        </div>
        <p class="operational-note">Esta tela ajuda a separar, conferir e pesar sem misturar com atendimento comercial. Uma coisa de cada vez.</p>
      </section>

      <section class="kzera-card" data-lote-view-panel="fracionamentos" hidden data-testid="lote-operacional-fracionamentos">
        <div class="kzera-section-title compact-title"><div><span class="eyebrow">Separações</span><h2>Criar unidades</h2></div></div>
        <form class="kzera-form-grid" data-testid="lote-fracionamento-form">
          <input type="hidden" name="itemId" value="${escapeHtml(item.id)}" />
          <input type="hidden" name="variacaoId" value="${escapeHtml(variacao.id)}" />
          <input type="hidden" name="loteId" value="${escapeHtml(lote.id)}" />
          <input type="hidden" name="unidadeFracao" value="${escapeHtml(variacao.unidade)}" />
          <label>Tamanho da fração (${escapeHtml(variacao.unidade)})<input name="tamanhoFracao" type="number" min="0" step="0.001" inputmode="decimal" placeholder="Ex.: 1" required /></label>
          <label>Quantidade de unidades<input name="quantidadeUnidadesCriadas" type="number" min="1" step="1" inputmode="numeric" placeholder="Ex.: 100" required /></label>
          <label>Data do fracionamento<input name="dataFracionamento" type="date" value="${dataHoje()}" required /></label>
          <label class="full-span">Observação opcional<input name="observacao" type="text" placeholder="Ex.: separado no turno da noite" /></label>
          <button class="primary-action" type="submit" data-action="registrar-fracionamento">⚖ Registrar fracionamento</button>
        </form>
        <p class="operational-note">Ao registrar, o sistema baixa automaticamente do guardado/a granel e cria unidades disponíveis para conferência e futura pesagem.</p>
        ${this.renderListaSeparações(lote, variacao)}
      </section>

      <section class="kzera-card" data-lote-view-panel="pesagem" hidden data-testid="lote-operacional-pesagem">
        <div class="kzera-section-title compact-title"><div><span class="eyebrow">Pesagem rápida</span><h2>Registrar pesos com poucos cliques</h2></div></div>
        ${this.renderPesagemRapida(item, variacao, lote, balancas)}
      </section>

      <section class="kzera-card" data-lote-view-panel="conferencia" hidden data-testid="lote-operacional-conferencia">
        <div class="kzera-section-title compact-title"><div><span class="eyebrow">Conferência</span><h2>Consolidado físico</h2></div></div>
        <p class="operational-note">A conferência compara esperado, conferido e divergência. O sistema não acusa causa automaticamente; a classificação será feita pelo operador.</p>
      </section>

      <section class="kzera-card" data-lote-view-panel="retirada" hidden data-testid="lote-operacional-retirada">
        <div class="kzera-section-title compact-title"><div><span class="eyebrow">Retirada interna</span><h2>Saída declarada</h2></div></div>
        <p class="operational-note">Retirada interna não é baixa comercial e não é perda. Ela será baixada de guardado/a granel ou fracionamento específico nas próximas versões.</p>
      </section>
    </section>`;
  }

  private renderListaSeparações(lote: ItemLote, variacao: ItemVariacao): string {
    if (!lote.fracionamentos.length) return '<p class="empty-state">Nenhuma fracionamento registrada nesta entrada.</p>';
    return `<div class="kzera-card-list">${lote.fracionamentos.map(fracionamento => {
      const divergencia = divergenciaRegistrosFracionamento(fracionamento.quantidadeUnidadesCriadas, fracionamento.pesagensRapidas || []);
      const alerta = divergencia.excedeu ? badge('Pesagem excedeu unidades', 'warning') : divergencia.pendente && divergencia.registrado > 0 ? badge('Pesagem incompleta', 'neutral') : '';
      return `<article class="kzera-entity-card"><strong>${fracionamento.quantidadeUnidadesDisponiveis}/${fracionamento.quantidadeUnidadesCriadas} un. ${alerta}</strong><p>${quantidade(fracionamento.tamanhoFracao, fracionamento.unidadeFracao)} por unidade • equivalente ${quantidade(fracionamento.equivalenteBase ?? fracionamento.tamanhoFracao * fracionamento.quantidadeUnidadesCriadas, variacao.unidade)} • ${escapeHtml(fracionamento.status)}</p>${fracionamento.observacao ? `<p>${escapeHtml(fracionamento.observacao)}</p>` : ''}</article>`;
    }).join('')}</div>`;
  }

  private renderPesagemRapida(item: ItemCatalogo, variacao: ItemVariacao, lote: ItemLote, balancas: Balanca[]): string {
    const statusBalanca = exigirBalancaParaPesagem(balancas);
    if (!lote.fracionamentos.length) return '<p class="empty-state">Crie uma fracionamento antes da pesagem rápida.</p>';
    const balancaSugerida = selecionarBalancaOperacional(balancas);
    const balancasAtivas = balancas.filter(balanca => balanca.status === 'ativa');
    const balancaOptions = balancasAtivas.map(balanca => `<option value="${escapeHtml(balanca.id)}" ${balanca.id === balancaSugerida?.id ? 'selected' : ''}>${escapeHtml(balanca.nome)}${balanca.padrao ? ' • padrão' : ''}</option>`).join('');
    const forms = lote.fracionamentos.map(fracionamento => this.renderPesagemFracionamento(item, variacao, lote, fracionamento, statusBalanca.pronta || balancasAtivas.length > 0, balancaOptions));
    return `<div class="kzera-utility-panel" data-testid="pesagem-balanca-status"><strong>${statusBalanca.pronta ? 'Balança pronta' : 'Atenção na balança'}</strong><span>${escapeHtml(statusBalanca.mensagem)}</span></div>
      <p class="operational-note">Cada botão de peso salva na hora. Se cansar ou interromper, o app tenta continuar sem perder o que já foi feito.</p>
      <div class="kzera-card-list" data-testid="pesagem-rapida-lista">${forms.join('')}</div>`;
  }

  private renderPesagemFracionamento(item: ItemCatalogo, variacao: ItemVariacao, lote: ItemLote, fracionamento: FracionamentoLote, podeIniciar: boolean, balancaOptions: string): string {
    const sessoes = fracionamento.pesagensRapidas || [];
    const agora = new Date().toISOString();
    const sessaoAtiva = sessoes.find(sessao => {
      const status = statusOperacionalSessaoPesagem(sessao, agora);
      return status === 'em_andamento' || status === 'pausada' || status === 'interrompida';
    });
    const alvoMg = Math.round(fracionamento.tamanhoFracao * 1000);
    return `<article class="kzera-entity-card pesagem-fracionamento" data-fracionamento-id="${escapeHtml(fracionamento.id)}">
      <header><div><strong>${fracionamento.quantidadeUnidadesDisponiveis}/${fracionamento.quantidadeUnidadesCriadas} unidades de ${quantidade(fracionamento.tamanhoFracao, fracionamento.unidadeFracao)}</strong><p>Alvo sugerido: ${pesoHumanoMg(alvoMg)}</p></div></header>
      ${sessaoAtiva ? this.renderSessaoAtiva(item, variacao, lote, fracionamento, sessaoAtiva) : this.renderIniciarSessao(item, variacao, lote, fracionamento, podeIniciar, balancaOptions, alvoMg)}
      ${this.renderHistoricoSessoes(sessoes)}
    </article>`;
  }

  private renderIniciarSessao(item: ItemCatalogo, variacao: ItemVariacao, lote: ItemLote, fracionamento: FracionamentoLote, podeIniciar: boolean, balancaOptions: string, alvoMg: number): string {
    if (!podeIniciar) return '<p class="empty-state">Cadastre uma balança ativa em Configurações para iniciar a pesagem.</p>';
    return `<form class="kzera-form-grid" data-testid="pesagem-iniciar-form">
      <input type="hidden" name="itemId" value="${escapeHtml(item.id)}" />
      <input type="hidden" name="variacaoId" value="${escapeHtml(variacao.id)}" />
      <input type="hidden" name="loteId" value="${escapeHtml(lote.id)}" />
      <input type="hidden" name="fracionamentoId" value="${escapeHtml(fracionamento.id)}" />
      <input type="hidden" name="alvoMg" value="${alvoMg}" />
      <label><span>Balança usada</span><select name="balancaId" required>${balancaOptions}</select></label>
      <label><span>Etiqueta inicial</span><input name="etiquetaInicial" type="number" min="1" step="1" inputmode="numeric" placeholder="Opcional" /></label>
      <label class="checkbox-row"><input type="checkbox" name="usarEtiquetas" /> <span>Usar etiquetas automáticas</span></label>
      <button type="submit" class="primary-action">▶️ Iniciar pesagem</button>
    </form>`;
  }

  private renderSessaoAtiva(item: ItemCatalogo, variacao: ItemVariacao, lote: ItemLote, fracionamento: FracionamentoLote, sessao: SessaoPesagemRapida): string {
    const ultimo = sessao.registros[sessao.registros.length - 1];
    const penultimo = sessao.registros[sessao.registros.length - 2];
    const statusOperacional = statusOperacionalSessaoPesagem(sessao, new Date().toISOString());
    const estaInterrompida = statusOperacional === 'interrompida';
    const statusTexto = estaInterrompida ? 'interrompida — continuação pendente' : statusOperacional;
    const divergencia = divergenciaRegistrosFracionamento(fracionamento.quantidadeUnidadesCriadas, [sessao]);
    const atingiuLimite = divergencia.registrado >= divergencia.esperado;
    const atalhosDesabilitados = statusOperacional !== 'em_andamento' || atingiuLimite;
    const alertaDivergencia = divergencia.excedeu ? '<span class="toast toast-error">A pesagem passou do combinado. Revise antes de continuar.</span>' : divergencia.pendente && divergencia.registrado > 0 ? '<span class="operational-note">Pesagem incompleta em relação ao fracionamento. O sistema sinaliza, mas permite pausar/continuar.</span>' : '';
    return `<section class="kzera-utility-panel pesagem-sessao" data-testid="pesagem-sessao-ativa" data-sessao-id="${escapeHtml(sessao.id)}">
      <strong>Sessão ${escapeHtml(statusTexto)} • alvo ${pesoHumanoMg(sessao.alvoMg)}</strong>
      ${estaInterrompida ? '<span class="operational-note">O app percebeu uma parada sem pausa. Nenhum peso foi perdido; confira a próxima etiqueta e toque em Continuar.</span>' : ''}
      ${alertaDivergencia}
      <span>Progresso: ${divergencia.registrado}/${divergencia.esperado} unidades • Próxima etiqueta: ${sessao.usarEtiquetas ? escapeHtml(String(sessao.proximaEtiqueta || '—')) : 'sem etiqueta'} • registros: ${sessao.registros.length}</span>
      <span>Último: ${ultimo ? `${ultimo.etiqueta ? `Etiqueta ${ultimo.etiqueta} • ` : ''}${pesoHumanoMg(ultimo.pesoMg)}` : 'nenhum'}${penultimo ? ` • Anterior: ${pesoHumanoMg(penultimo.pesoMg)}` : ''}</span>
      <div class="action-row pesagem-atalhos">
        ${this.pesoButton(item, variacao, lote, fracionamento, sessao, 500, atalhosDesabilitados)}
        ${this.pesoButton(item, variacao, lote, fracionamento, sessao, 1000, atalhosDesabilitados)}
        ${this.pesoButton(item, variacao, lote, fracionamento, sessao, 2000, atalhosDesabilitados)}
      </div>
      <form class="kzera-form-grid compact-form" data-testid="pesagem-manual-form">
        ${this.hiddenPesagemContext(item, variacao, lote, fracionamento, sessao)}
        <label><span>Peso manual em mg</span><input name="pesoMg" type="number" min="1" step="1" inputmode="numeric" placeholder="Ex.: 997" ${atalhosDesabilitados ? 'disabled' : 'required'} /></label>
        <button type="submit" class="icon-button text-icon" ${atalhosDesabilitados ? 'disabled' : ''}>💾 Salvar peso manual</button>
      </form>
      <div class="action-row">
        <button type="button" class="icon-button text-icon" data-pesagem-acao="${statusOperacional === 'em_andamento' ? 'pausar' : 'retomar'}" ${this.contextAttrs(item, variacao, lote, fracionamento, sessao)}>${statusOperacional === 'em_andamento' ? '⏸️ Pausar' : '▶️ Continuar'}</button>
        <button type="button" class="icon-button text-icon" data-pesagem-acao="finalizar" ${this.contextAttrs(item, variacao, lote, fracionamento, sessao)}>✅ Finalizar</button>
      </div>
      ${this.renderCorrecaoPesagem(item, variacao, lote, fracionamento, sessao)}
    </section>`;
  }

  private renderCorrecaoPesagem(item: ItemCatalogo, variacao: ItemVariacao, lote: ItemLote, fracionamento: FracionamentoLote, sessao: SessaoPesagemRapida): string {
    if (!sessao.registros.length) return '';
    const options = sessao.registros.slice().reverse().map(registro => `<option value="${escapeHtml(registro.id)}">#${registro.sequencia}${registro.etiqueta ? ` • Etiqueta ${registro.etiqueta}` : ''} • ${pesoHumanoMg(registro.pesoMg)}</option>`).join('');
    return `<form class="kzera-form-grid compact-form" data-testid="pesagem-correcao-form">
      ${this.hiddenPesagemContext(item, variacao, lote, fracionamento, sessao)}
      <label><span>Corrigir registro</span><select name="registroId" required>${options}</select></label>
      <label><span>Novo peso em mg</span><input name="pesoMg" type="text" inputmode="decimal" placeholder="Ex.: 997" required /></label>
      <button type="submit" class="icon-button text-icon">✏️ Corrigir peso</button>
    </form>`;
  }

  private pesoButton(item: ItemCatalogo, variacao: ItemVariacao, lote: ItemLote, fracionamento: FracionamentoLote, sessao: SessaoPesagemRapida, pesoMg: number, disabled = false): string {
    return `<button type="button" class="primary-action" data-pesagem-acao="registrar_peso" data-peso-mg="${pesoMg}" ${this.contextAttrs(item, variacao, lote, fracionamento, sessao)} ${disabled ? 'disabled' : ''}>+ ${formatarAtalhoPesoHumano(pesoMg)}</button>`;
  }

  private hiddenPesagemContext(item: ItemCatalogo, variacao: ItemVariacao, lote: ItemLote, fracionamento: FracionamentoLote, sessao: SessaoPesagemRapida): string {
    return `<input type="hidden" name="itemId" value="${escapeHtml(item.id)}" /><input type="hidden" name="variacaoId" value="${escapeHtml(variacao.id)}" /><input type="hidden" name="loteId" value="${escapeHtml(lote.id)}" /><input type="hidden" name="fracionamentoId" value="${escapeHtml(fracionamento.id)}" /><input type="hidden" name="sessaoId" value="${escapeHtml(sessao.id)}" />`;
  }

  private contextAttrs(item: ItemCatalogo, variacao: ItemVariacao, lote: ItemLote, fracionamento: FracionamentoLote, sessao: SessaoPesagemRapida): string {
    return `data-item-id="${escapeHtml(item.id)}" data-variacao-id="${escapeHtml(variacao.id)}" data-lote-id="${escapeHtml(lote.id)}" data-fracionamento-id="${escapeHtml(fracionamento.id)}" data-sessao-id="${escapeHtml(sessao.id)}"`;
  }

  private renderHistoricoSessoes(sessoes: SessaoPesagemRapida[]): string {
    if (!sessoes.length) return '<p class="empty-state">Nenhuma sessão de pesagem registrada.</p>';
    return `<details class="pesagem-historico"><summary>Histórico da pesagem</summary>${sessoes.map(sessao => this.renderSessaoResumo(sessao)).join('')}</details>`;
  }

  private renderSessaoResumo(sessao: SessaoPesagemRapida): string {
    const resumo = calcularResumoSessao(sessao);
    const registros = sessao.registros.slice(-5).reverse().map(registro => `<li>#${registro.sequencia}${registro.etiqueta ? ` • Etiqueta ${registro.etiqueta}` : ''} • ${pesoHumanoMg(registro.pesoMg)}${registro.corrigidoDeMg ? ` • corrigido de ${pesoHumanoMg(registro.corrigidoDeMg)}` : ''}</li>`).join('');
    return `<article class="kzera-entity-card"><strong>${escapeHtml(sessao.status)} • ${resumo.quantidade} registros • média ${pesoHumanoMg(Math.round(resumo.pesoMedioMg))}</strong><ul>${registros || '<li>Sem registros.</li>'}</ul></article>`;
  }
}
