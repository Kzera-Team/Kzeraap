import { UxFluxoTracker } from '../../../application/uxMetricas/UxFluxoTracker';
import { UxMetricasService, type RegistrarUxEventoInput } from '../../../application/uxMetricas/UxMetricasService';
import { UxSessaoTracker } from '../../../application/uxMetricas/UxSessaoTracker';

const NAV_SCREEN: Record<string, string> = {
  home: 'inicio',
  perfis: 'perfis',
  itens: 'itens',
  transacoes: 'dinheiro',
  codigo: 'codigo_perfil',
  importacao: 'importacao',
  configuracoes: 'configuracoes'
};

function safeText(value: unknown, fallback = 'desconhecido'): string {
  const raw = String(value ?? '').trim();
  if (!raw) return fallback;
  return raw.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9_:-]/g, '_').replace(/_+/g, '_').slice(0, 64);
}

function withFluxo<T extends RegistrarUxEventoInput>(base: T, fluxo: string | undefined): T & { fluxo?: string } {
  return fluxo ? { ...base, fluxo } : base;
}

function inferAction(target: HTMLElement): string {
  const explicit = target.dataset.uxAction || target.dataset.quick || target.dataset.nav || target.getAttribute('aria-label') || target.getAttribute('title') || target.dataset.importTab || 'acao';
  return safeText(explicit, 'acao');
}

function inferActionType(target: HTMLElement): 'principal' | 'secundaria' | 'perigosa' | 'navegacao' {
  if (target.dataset.nav || target.dataset.menuToggle || target.dataset.menuClose || target.dataset.importTab) return 'navegacao';
  const raw = `${target.className || ''} ${target.getAttribute('aria-label') || ''} ${target.textContent || ''}`.toLowerCase();
  if (/cancelar|excluir|remover|limpar|apagar|inativar|arquivar|cuidado/.test(raw)) return 'perigosa';
  if (/primary|salvar|criar|confirmar|entrar/.test(raw)) return 'principal';
  return 'secundaria';
}

export class UxDomTracker {
  private root: HTMLElement | null = null;
  private telaAtual = 'inicio';
  private telaAbertaEm = Date.now();
  private fluxoAtual: string | undefined;
  private lastNavigationKey = '';
  private repeatedNavigationCount = 0;
  private bound = false;

  constructor(
    private readonly metricas: UxMetricasService,
    private readonly sessao: UxSessaoTracker,
    private readonly fluxos: UxFluxoTracker
  ) {}

  async mount(root: HTMLElement): Promise<void> {
    this.root = root;
    if (!this.bound) {
      root.addEventListener('click', event => { void this.onClick(event); }, true);
      root.addEventListener('submit', event => { void this.onSubmit(event); }, true);
      this.bound = true;
    }
    await this.sessao.iniciar();
    await this.abrirTela('inicio', 'fluxo');
  }

  async telaMudou(screen: string, origem: 'menu' | 'atalho' | 'voltar' | 'fluxo' = 'fluxo'): Promise<void> {
    await this.fecharTela();
    await this.abrirTela(NAV_SCREEN[screen] || safeText(screen), origem);
  }

  async appBloqueado(): Promise<void> { await this.sessao.bloquear(); }
  async appDesbloqueado(): Promise<void> { await this.sessao.desbloquear(); }
  async appReaberto(): Promise<void> { await this.sessao.reabrir(); }

  async limparMetricas(): Promise<void> {
    await this.metricas.limpar();
  }

  private async abrirTela(tela: string, origem: 'menu' | 'atalho' | 'voltar' | 'fluxo'): Promise<void> {
    this.telaAtual = tela;
    this.telaAbertaEm = Date.now();
    await this.metricas.registrar(withFluxo({ tipo: 'tela_aberta', sessaoId: this.sessao.sessaoId, tela, origem }, this.fluxoAtual));
  }

  private async fecharTela(): Promise<void> {
    const duracaoMs = Math.max(0, Date.now() - this.telaAbertaEm);
    await this.metricas.registrar(withFluxo({ tipo: 'tela_fechada', sessaoId: this.sessao.sessaoId, tela: this.telaAtual, duracaoMs }, this.fluxoAtual));
  }

  private async onClick(event: Event): Promise<void> {
    const target = (event.target as HTMLElement | null)?.closest?.('button,a,[role="button"]') as HTMLElement | null;
    if (!target) return;
    const action = inferAction(target);
    const tipoAcao = inferActionType(target);
    await this.metricas.registrar(withFluxo({ tipo: 'acao_executada', sessaoId: this.sessao.sessaoId, tela: this.telaAtual, acao: action, tipoAcao }, this.fluxoAtual));
    if (this.fluxoAtual) await this.fluxos.registrarAcao(this.fluxoAtual);

    if (target.dataset.nav) {
      const paraTela = NAV_SCREEN[target.dataset.nav] || safeText(target.dataset.nav);
      await this.registrarNavegacao(this.telaAtual, paraTela);
    }
  }

  private async onSubmit(event: Event): Promise<void> {
    const form = event.target as HTMLFormElement | null;
    if (!form) return;
    const testId = form.getAttribute('data-testid') || form.getAttribute('class') || 'formulario';
    const fluxo = this.inferFluxoFromForm(testId);
    await this.ensureFluxo(fluxo);
    await this.metricas.registrar({ tipo: 'acao_executada', sessaoId: this.sessao.sessaoId, tela: this.telaAtual, fluxo, acao: 'salvar', tipoAcao: 'principal' });
    await this.fluxos.registrarAcao(fluxo);
  }

  private inferFluxoFromForm(testId: string): string {
    const safe = safeText(testId, 'formulario');
    if (safe.includes('perfil')) return safe.includes('import') ? 'importar_perfis' : 'criar_ou_editar_perfil';
    if (safe.includes('item')) return safe.includes('import') ? 'importar_itens' : 'criar_ou_editar_item';
    if (safe.includes('balanca')) return 'configurar_balanca';
    if (safe.includes('codigo')) return 'configurar_codigo_perfil';
    if (safe.includes('login') || safe.includes('setup') || safe.includes('attention')) return 'entrar_no_app';
    return safe;
  }

  private async ensureFluxo(fluxo: string): Promise<void> {
    if (this.fluxoAtual === fluxo) return;
    if (this.fluxoAtual) await this.fluxos.abandonar(this.fluxoAtual, this.sessao.sessaoId);
    this.fluxoAtual = fluxo;
    await this.fluxos.iniciar(fluxo, this.sessao.sessaoId);
  }

  private async registrarNavegacao(deTela: string, paraTela: string): Promise<void> {
    const key = `${deTela}->${paraTela}`;
    this.repeatedNavigationCount = this.lastNavigationKey === key ? this.repeatedNavigationCount + 1 : 1;
    this.lastNavigationKey = key;
    await this.metricas.registrar(withFluxo({ tipo: 'voltar_usado', sessaoId: this.sessao.sessaoId, tela: paraTela, metadataSegura: { deTela, paraTela } }, this.fluxoAtual));
    if (this.repeatedNavigationCount > 1) {
      await this.metricas.registrar(withFluxo({ tipo: 'navegacao_repetida', sessaoId: this.sessao.sessaoId, tela: paraTela, metadataSegura: { deTela, paraTela, quantidadeNoFluxo: this.repeatedNavigationCount } }, this.fluxoAtual));
    }
    if (this.fluxoAtual) await this.fluxos.registrarVolta(this.fluxoAtual);
  }
}
