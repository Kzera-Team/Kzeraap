import { CriarBalancaUseCase } from '../../application/operacao/CriarBalancaUseCase';
import { ListarBalancasUseCase } from '../../application/operacao/ListarBalancasUseCase';
import { AlterarStatusBalancaUseCase } from '../../application/operacao/AlterarStatusBalancaUseCase';
import { DefinirBalancaPadraoUseCase } from '../../application/operacao/DefinirBalancaPadraoUseCase';
import { RegistrarCalibragemBalancaUseCase } from '../../application/operacao/RegistrarCalibragemBalancaUseCase';
import type { Balanca, CalibragemResultado } from '../../domain/operacao/Balanca';
import { exigirBalancaParaPesagem } from '../../domain/operacao/Balanca';
import { escapeHtml } from '../shared/ui/Html';
import { parseNumeroOperacional } from '../shared/ui/NumberParser';

export interface ConfiguracoesOperacionaisModule {
  listarBalancas: ListarBalancasUseCase;
  criarBalanca: CriarBalancaUseCase;
  alterarStatusBalanca: AlterarStatusBalancaUseCase;
  definirBalancaPadrao: DefinirBalancaPadraoUseCase;
  registrarCalibragemBalanca: RegistrarCalibragemBalancaUseCase;
  limparMetricasUso?: () => Promise<void>;
}

export class ConfiguracoesOperacionaisView {
  private root: HTMLElement | null = null;
  private erro = '';
  private sucesso = '';

  constructor(private readonly module: ConfiguracoesOperacionaisModule) {}

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    await this.render();
  }

  private async render(): Promise<void> {
    if (!this.root) return;
    const balancas = await this.module.listarBalancas.execute();
    this.root.innerHTML = this.template(balancas);
    this.bind();
  }

  private template(balancas: Balanca[]): string {
    const statusPesagem = exigirBalancaParaPesagem(balancas);
    return `<section class="kzera-screen configuracoes-operacionais" data-testid="configuracoes-operacionais">
      <header class="kzera-operational-header">
        <div class="kzera-operational-title"><span class="eyebrow">Ajustes do app</span><h1>Configurações</h1></div>
      </header>
      <div class="kzera-utility-panel" data-testid="dashboard-rule-reminder">
        <strong>Regra de calma</strong>
        <p>O que quase nunca muda fica aqui. A tela inicial deve mostrar só o que ajuda a terminar o dia.</p>
      </div>
      ${this.erro ? `<div class="toast toast-error" data-testid="config-error">${escapeHtml(this.erro)}</div>` : ''}
      ${this.sucesso ? `<div class="toast toast-success" data-testid="config-success">${escapeHtml(this.sucesso)}</div>` : ''}
      <article class="kzera-card ux-metricas-card" data-testid="ux-metricas-config">
        <header><div><span class="eyebrow">Cópia e privacidade</span><h2>Métricas de uso</h2></div></header>
        <p>Esses dados ajudam a melhorar o app. Eles não guardam nomes, telefones, itens, valores ou textos digitados.</p>
        <button type="button" class="icon-button text-icon" data-limpar-metricas-uso>Limpar métricas de uso</button>
      </article>
      <article class="kzera-card balanca-config-card" data-testid="balanca-configuracao">
        <header><div><span class="eyebrow">Balanças</span><h2>⚖️ Balanças</h2></div></header>
        <p>Cadastre uma vez e deixe pronto. Na pesagem, o app tenta usar a balança marcada como padrão.</p>
        <div class="kzera-utility-panel" data-testid="balanca-status-pesagem"><strong>${statusPesagem.pronta ? 'Pronto para pesar' : 'Pesagem ainda bloqueada'}</strong><span>${escapeHtml(statusPesagem.mensagem)}</span></div>
        <form class="kzera-form-grid" data-testid="balanca-form">
          <label><span>Nome ou apelido</span><input name="nome" placeholder="Ex.: Balança principal" required /></label>
          <label><span>Código opcional</span><input name="codigo" placeholder="Ex.: BAL-01" /></label>
          <label><span>Status</span><select name="status"><option value="ativa">Ativa</option><option value="inativa">Inativa</option></select></label>
          <label class="checkbox-row"><input type="checkbox" name="padrao" /> <span>Usar como padrão</span></label>
          <label class="full-row"><span>Observação opcional</span><textarea name="observacao" rows="2" placeholder="Ex.: fica na bancada da embalagem"></textarea></label>
          <button type="submit" class="primary-action">⚖️ Salvar balança</button>
        </form>
      </article>
      <section class="balanca-lista" data-testid="balanca-lista">${balancas.length ? balancas.map(balanca => this.balancaCard(balanca)).join('') : '<div class="empty-state">Nenhuma balança cadastrada. Cadastre uma vez antes de pesar.</div>'}</section>
    </section>`;
  }

  private balancaCard(balanca: Balanca): string {
    const ultima = balanca.calibragens[0];
    return `<article class="kzera-card balanca-card" data-balanca-id="${escapeHtml(balanca.id)}">
      <header><div><strong>${escapeHtml(balanca.nome)}</strong><p>${escapeHtml([balanca.codigo, balanca.status === 'ativa' ? 'Ativa' : 'Inativa', balanca.padrao ? 'Padrão' : ''].filter(Boolean).join(' • '))}</p></div></header>
      ${balanca.observacao ? `<p>${escapeHtml(balanca.observacao)}</p>` : ''}
      <div class="item-actions">
        ${balanca.status === 'ativa' ? `<button type="button" class="icon-button text-icon" data-balanca-status="inativa">🚫 Inativar</button>` : `<button type="button" class="icon-button text-icon" data-balanca-status="ativa">✅ Ativar</button>`}
        ${balanca.status === 'ativa' && !balanca.padrao ? `<button type="button" class="icon-button text-icon" data-balanca-padrao>⭐ Tornar padrão</button>` : ''}
      </div>
      <div class="kzera-utility-panel"><strong>Última calibragem</strong><span>${ultima ? `${this.resultadoLabel(ultima.resultado)} • ${ultima.pesoUsado} ${ultima.unidade} • ${new Date(ultima.dataHora).toLocaleString('pt-BR')}` : 'Sem calibragem registrada.'}</span></div>
      <form class="kzera-form-grid" data-balanca-calibragem-form="${escapeHtml(balanca.id)}">
        <label><span>Peso usado</span><input name="pesoUsado" type="number" min="0" step="0.001" placeholder="Ex.: 100" required /></label>
        <label><span>Unidade</span><select name="unidade"><option value="g">g</option><option value="mg">mg</option><option value="kg">kg</option></select></label>
        <label><span>Resultado</span><select name="resultado"><option value="aprovada">OK</option><option value="atencao">Atenção</option><option value="reprovada">Reprovada</option></select></label>
        <label class="full-row"><span>Observação opcional</span><input name="observacao" placeholder="Ex.: oscilou 0,01 g" /></label>
        <button type="submit" class="icon-button text-icon">🧪 Registrar calibragem</button>
      </form>
    </article>`;
  }

  private resultadoLabel(resultado: CalibragemResultado): string {
    return resultado === 'aprovada' ? 'OK' : resultado === 'atencao' ? 'Atenção' : 'Reprovada';
  }

  private bind(): void {
    if (!this.root) return;
    this.root.querySelector<HTMLButtonElement>('[data-limpar-metricas-uso]')?.addEventListener('click', async () => {
      await this.run(async () => {
        await this.module.limparMetricasUso?.();
        this.sucesso = 'Métricas de uso limpas neste aparelho.';
      });
    });

    this.root.querySelector<HTMLFormElement>('[data-testid="balanca-form"]')?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const data = new FormData(form);
      await this.run(async () => {
        await this.module.criarBalanca.execute({
          nome: String(data.get('nome') || ''),
          codigo: String(data.get('codigo') || ''),
          status: String(data.get('status') || 'ativa') as 'ativa' | 'inativa',
          padrao: data.get('padrao') === 'on',
          observacao: String(data.get('observacao') || '')
        });
        form.reset();
        this.sucesso = 'Balança salva em Configurações.';
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>('[data-balanca-status]').forEach(button => button.addEventListener('click', async () => {
      const id = button.closest<HTMLElement>('[data-balanca-id]')?.dataset.balancaId || '';
      const status = button.dataset.balancaStatus as 'ativa' | 'inativa';
      await this.run(async () => { await this.module.alterarStatusBalanca.execute(id, status); this.sucesso = status === 'ativa' ? 'Balança ativada.' : 'Balança inativada.'; });
    }));

    this.root.querySelectorAll<HTMLButtonElement>('[data-balanca-padrao]').forEach(button => button.addEventListener('click', async () => {
      const id = button.closest<HTMLElement>('[data-balanca-id]')?.dataset.balancaId || '';
      await this.run(async () => { await this.module.definirBalancaPadrao.execute(id); this.sucesso = 'Balança marcada como padrão.'; });
    }));

    this.root.querySelectorAll<HTMLFormElement>('[data-balanca-calibragem-form]').forEach(form => form.addEventListener('submit', async event => {
      event.preventDefault();
      const current = event.currentTarget as HTMLFormElement;
      const data = new FormData(current);
      await this.run(async () => {
        await this.module.registrarCalibragemBalanca.execute({
          balancaId: current.dataset.balancaCalibragemForm || '',
          pesoUsado: parseNumeroOperacional(data.get('pesoUsado') || 0),
          unidade: String(data.get('unidade') || 'g') as 'mg' | 'g' | 'kg',
          resultado: String(data.get('resultado') || 'aprovada') as CalibragemResultado,
          observacao: String(data.get('observacao') || '')
        });
        current.reset();
        this.sucesso = 'Calibragem registrada.';
      });
    }));
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.erro = '';
    this.sucesso = '';
    try { await action(); }
    catch (error) { this.erro = error instanceof Error ? error.message : 'Não foi possível salvar a configuração.'; }
    await this.render();
  }
}
