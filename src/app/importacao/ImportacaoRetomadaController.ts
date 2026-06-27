import type { RascunhoImportacao } from '../../infrastructure/repositories/ImportacaoRascunhoRepository';
import type { ImportacaoRascunhoUseCase } from '../../application/importacao/ImportacaoRascunhoUseCase';
import { escapeHtml } from '../../presentation/shared/ui/Html';
import type { Screen } from '../navigation/Screen';
import type { AppNavigationController } from '../navigation/AppNavigationController';
import modalTemplate from './retomada-importacao-modal.html?raw';
import itemTemplate from './retomada-importacao-item.html?raw';

interface PerfilImportacaoDraftApp {
  restaurarPreview(registros: unknown[]): Promise<void>;
  descartarRascunho(): Promise<void>;
}

interface ItemImportacaoDraftApp {
  descartarRascunho(): Promise<void>;
}

interface ImportacaoRetomadaControllerParams {
  importacaoRascunho: ImportacaoRascunhoUseCase;
  perfilApp: PerfilImportacaoDraftApp;
  itemApp: ItemImportacaoDraftApp;
  navigation: AppNavigationController;
  requestRender: () => Promise<void>;
}

const SESSION_FLAG_KEY = 'kzera_sessao_ativa';

export class ImportacaoRetomadaController {
  private rascunhos: RascunhoImportacao[] = [];
  private modalVisivel = false;
  private verificados = false;

  constructor(private readonly params: ImportacaoRetomadaControllerParams) {}

  async verificar(): Promise<void> {
    if (this.verificados) return;
    this.verificados = true;
    if (!this.isNovaSessao()) return;

    try {
      const lista = await this.params.importacaoRascunho.listar();
      if (lista.length > 0) {
        this.rascunhos = lista;
        this.modalVisivel = true;
      }
    } catch {
      // best-effort: se não conseguiu ler, não bloqueia o app
    }
  }

  renderModal(): string {
    if (!this.modalVisivel || this.rascunhos.length === 0) return '';
    const linhas = this.rascunhos
      .map(rascunho => this.fill(itemTemplate, { label: escapeHtml(this.labelTela(rascunho)) }))
      .join('');
    return this.fill(modalTemplate, { linhas });
  }

  bind(root: HTMLElement): void {
    root.querySelector('[data-retomada-sim]')?.addEventListener('click', async () => {
      this.modalVisivel = false;
      const primeiro = this.rascunhos[0];
      if (primeiro) {
        if (primeiro.tipo === 'perfis' && primeiro.previewRegistros?.length) {
          await this.params.perfilApp.restaurarPreview(primeiro.previewRegistros);
        }
        await this.params.navigation.navigate(this.telaParaRascunho(primeiro));
      } else {
        await this.params.requestRender();
      }
    });
    root.querySelector('[data-retomada-nao]')?.addEventListener('click', async () => {
      this.modalVisivel = false;
      this.rascunhos = [];
      try { await this.params.perfilApp.descartarRascunho(); } catch { /* best-effort */ }
      try { await this.params.itemApp.descartarRascunho(); } catch { /* best-effort */ }
      try { await this.params.importacaoRascunho.descartarTodos(); } catch { /* best-effort */ }
      await this.params.requestRender();
    });
  }

  private isNovaSessao(): boolean {
    if (typeof sessionStorage === 'undefined') return false;
    const flag = sessionStorage.getItem(SESSION_FLAG_KEY);
    if (!flag) {
      sessionStorage.setItem(SESSION_FLAG_KEY, '1');
      return true;
    }
    return false;
  }

  private labelTela(rascunho: RascunhoImportacao): string {
    if (rascunho.tipo === 'perfis') return `Importação de perfis${rascunho.previewCount ? ` (${rascunho.previewCount} registros na prévia)` : ''}`;
    if (rascunho.tipo === 'itens') return `Importação de itens${rascunho.previewCount ? ` (${rascunho.previewCount} registros na prévia)` : ''}`;
    return 'Importação de transações financeiras';
  }

  private telaParaRascunho(rascunho: RascunhoImportacao): Screen {
    if (rascunho.tipo === 'perfis') return 'importacao-perfis';
    if (rascunho.tipo === 'itens') return 'importacao-itens';
    return 'importacao-transacoes';
  }

  private fill(template: string, values: Record<string, string>): string {
    return Object.entries(values).reduce(
      (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
      template
    );
  }
}
