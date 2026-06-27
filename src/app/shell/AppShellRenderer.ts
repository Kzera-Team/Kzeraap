import { renderAppMenuButton } from '../../presentation/shared/components/AppMenuButton';
import type { Screen } from '../navigation/Screen';
import { escaped, fillTemplate } from '../sharedTemplate';
import drawerTemplate from './app-drawer.html?raw';
import drawerItemTemplate from './app-drawer-item.html?raw';
import frameTemplate from './app-frame.html?raw';
import backupStatusTemplate from './home-backup-status.html?raw';
import homeTemplate from './home-screen.html?raw';

interface HomeScreenParams {
  currentScreen: Screen;
  isMenuOpen: boolean;
  appName: string;
  versionLabel: string;
  perfisAtivos: number;
  itensAtivos: number;
  backupRequired: boolean;
}

interface AppFrameParams {
  currentScreen: Screen;
  isMenuOpen: boolean;
  appName: string;
  versionLabel: string;
}

const MENU_ITEMS: Array<[Screen, string]> = [
  ['perfis', 'Perfis'],
  ['itens', 'Itens'],
  ['transacoes', 'Dinheiro'],
  ['relatorios', 'Relatórios'],
  ['codigo', 'Código do Perfil'],
  ['importacao-perfis', 'Importar Perfis'],
  ['importacao-itens', 'Importar Itens'],
  ['importacao-transacoes', 'Importar Transações'],
  ['configuracoes', 'Configurações']
];

export class AppShellRenderer {
  renderHome(params: HomeScreenParams): string {
    return fillTemplate(homeTemplate, {
      drawerHtml: this.renderDrawer(params),
      perfisAtivos: params.perfisAtivos,
      itensAtivos: params.itensAtivos,
      backupStatusHtml: params.backupRequired ? backupStatusTemplate : ''
    });
  }

  renderFrame(params: AppFrameParams): string {
    return fillTemplate(frameTemplate, {
      drawerHtml: this.renderDrawer(params),
      title: escaped(this.titleFor(params.currentScreen))
    });
  }

  private renderDrawer(params: AppFrameParams): string {
    return fillTemplate(drawerTemplate, {
      menuButton: renderAppMenuButton(),
      openClass: params.isMenuOpen ? ' is-open' : '',
      appName: escaped(params.appName),
      versionLabel: escaped(params.versionLabel),
      itemsHtml: MENU_ITEMS.map(([screen, label]) => fillTemplate(drawerItemTemplate, {
        screen: escaped(screen),
        label: escaped(label),
        activeClass: params.currentScreen === screen ? 'active' : ''
      })).join('')
    });
  }

  private titleFor(screen: Screen): string {
    if (screen === 'perfis') return 'Perfis';
    if (screen === 'itens') return 'Itens';
    if (screen === 'transacoes') return 'Dinheiro';
    if (screen === 'relatorios') return 'Relatórios';
    if (screen === 'codigo') return 'Código do Perfil';
    if (screen === 'importacao-perfis') return 'Importar Perfis';
    if (screen === 'importacao-itens') return 'Importar Itens';
    if (screen === 'importacao-transacoes') return 'Importar Transações';
    return 'Configurações';
  }
}
