import type { IdentityRule } from '../../domain/identidade/IdentityRule';
import type { Screen } from './Screen';
import type { FinanceiroScreensController } from '../financeiro/FinanceiroScreensController';

interface ImportacaoTransacoesApp {
  mount(root: HTMLElement): Promise<void>;
}

interface ConfiguracoesApp {
  mount(root: HTMLElement): Promise<void>;
}

interface PerfilApp {
  mount(root: HTMLElement): Promise<void>;
  mountImportacao(root: HTMLElement): Promise<void>;
}

interface ItemApp {
  mount(root: HTMLElement): Promise<void>;
  mountImportacao(root: HTMLElement): Promise<void>;
}

interface AppScreenMountControllerParams {
  perfilApp: PerfilApp;
  itemApp: ItemApp;
  importacaoTransacoesFinanceiroApp: ImportacaoTransacoesApp;
  configuracoesApp: ConfiguracoesApp;
  financeiroScreens: FinanceiroScreensController;
  renderCodigoPerfil(root: HTMLElement, savedRule: IdentityRule): void;
  renderTransacoes(root: HTMLElement, html: string): void;
  renderRelatorios(root: HTMLElement, html: string): void;
}

export class AppScreenMountController {
  constructor(private readonly params: AppScreenMountControllerParams) {}

  async mount(screen: Screen, appRoot: HTMLElement, savedRule: IdentityRule): Promise<void> {
    if (screen === 'perfis') await this.params.perfilApp.mount(appRoot);
    if (screen === 'itens') await this.params.itemApp.mount(appRoot);
    if (screen === 'codigo') this.params.renderCodigoPerfil(appRoot, savedRule);
    if (screen === 'transacoes') await this.mountTransacoes(appRoot);
    if (screen === 'relatorios') await this.mountRelatorios(appRoot);
    if (screen === 'importacao-perfis') await this.params.perfilApp.mountImportacao(appRoot);
    if (screen === 'importacao-itens') await this.params.itemApp.mountImportacao(appRoot);
    if (screen === 'importacao-transacoes') await this.params.importacaoTransacoesFinanceiroApp.mount(appRoot);
    if (screen === 'configuracoes') await this.params.configuracoesApp.mount(appRoot);
  }

  private async mountTransacoes(appRoot: HTMLElement): Promise<void> {
    this.params.renderTransacoes(appRoot, await this.params.financeiroScreens.renderTransacoes());
    this.params.financeiroScreens.bindTransacoesFilters(appRoot);
  }

  private async mountRelatorios(appRoot: HTMLElement): Promise<void> {
    this.params.renderRelatorios(appRoot, await this.params.financeiroScreens.renderRelatorios());
    this.params.financeiroScreens.bindRelatoriosFilters(appRoot);
  }
}
