import type { Repository } from '../application/ports/Repository';
import type { Clock } from '../core/Clock';
import type { Perfil } from '../domain/perfil/Perfil';
import type { IdentityRule } from '../domain/identidade/IdentityRule';
import { createPerfilModule } from './createPerfilModule';
import { PerfilDomView, type PerfilUiState, type PerfilTimelineItem } from '../presentation/perfil/PerfilDomView';
import { releaseTransferPayload } from '../runtime/TransferScope';

const DEFAULT_IDENTITY_RULE: IdentityRule = {
  id: 'default',
  version: 1,
  active: true,
  createdAt: new Date(0).toISOString(),
  parts: [
    {
      type: 'column',
      column: 'perfil.nome',
      extraction: 'firstLetter',
      caseFormat: 'upper',
      transform: 'none'
    },
    {
      type: 'staticText',
      value: '.',
      caseFormat: 'original',
      transform: 'none'
    },
    {
      type: 'column',
      column: 'perfil.bairro',
      extraction: 'firstLetterOfEachWord',
      caseFormat: 'upper',
      transform: 'none'
    }
  ]
};

export function createPerfilUiApp(perfis: Repository<Perfil>, clock: Clock, idFactory: () => string, getIdentityRule: () => IdentityRule = () => DEFAULT_IDENTITY_RULE) {
  const module = createPerfilModule(perfis, clock, idFactory);
  const view = new PerfilDomView();
  let termoAtual = '';
  let preview: PerfilUiState['importacaoPreview'] = [];
  let rootRef: HTMLElement | null = null;
  let loading = false;
  let erro: string | undefined;
  let panelMode: 'lista' | 'cadastro' | 'importacao' = 'lista';


  async function state(mensagem?: string): Promise<PerfilUiState> {
    const perfisLista = termoAtual
      ? await module.buscar.execute({ termo: termoAtual, incluirArquivados: true })
      : await module.listar.execute({ status: 'todos' });

    const timeline: PerfilTimelineItem[] = [];
    if ('listarHistorico' in module) {
      const historicos = await Promise.all(perfisLista.slice(0, 8).map(perfil => module.listarHistorico.execute(perfil.id)));
      for (const eventos of historicos) {
        timeline.push(...eventos.map(evento => ({
          id: evento.id,
          perfilId: evento.perfilId,
          descricao: evento.descricao,
          createdAt: evento.createdAt,
          tipo: evento.tipo
        })));
      }
    }

    const uiState: PerfilUiState = {
      perfis: perfisLista,
      dashboard: await module.pendenciasDashboard.execute(),
      duplicidades: await module.listarDuplicidades.execute(),
      importacaoPreview: preview,
      timeline: timeline.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      termoBusca: termoAtual
    };

    if (loading) uiState.loading = loading;
    if (erro) uiState.erro = erro;
    if (mensagem !== undefined) uiState.mensagem = mensagem;

    return uiState;
  }


  async function runWithFeedback(action: () => Promise<unknown>, mensagem: string): Promise<void> {
    loading = true;
    erro = undefined;
    await rerender();

    try {
      await action();
      loading = false;
      await rerender(mensagem);
    } catch (error) {
      loading = false;
      erro = error instanceof Error ? error.message : 'Erro desconhecido.';
      await rerender();
    }
  }

  async function rerender(mensagem?: string): Promise<void> {
    if (!rootRef) return;
    view.render(rootRef, await state(mensagem), handlers, panelMode);
  }

  const handlers = {
    async onCriarPerfil(input: {
      nome: string;
      telefone?: string;
      email?: string;
      bairro?: string;
      municipio?: string;
      conhecePessoalmente: boolean;
    }) {
      await runWithFeedback(async () => module.criar.execute(input), 'Perfil criado.');
    },

    async onBuscar(termo: string) {
      termoAtual = termo;
      await rerender();
    },

    async onLimparBusca() {
      termoAtual = '';
      await rerender();
    },

    async onArquivar(perfilId: string) {
      await runWithFeedback(async () => module.arquivar.execute(perfilId), 'Perfil arquivado.');
    },

    async onReativar(perfilId: string) {
      await runWithFeedback(async () => module.reativar.execute(perfilId), 'Perfil reativado.');
    },

    async onDefinirCodigo(perfilId: string) {
      await runWithFeedback(async () => module.definirCodigo.execute(perfilId, getIdentityRule()), 'Código definido.');
    },

    async onSelecionarArquivo(file: File) {
      const importState = await module.fluxoImportacao.carregarArquivo(file);
      preview = importState.preview;
      await rerender('Prévia de importação carregada.');
    },

    async onAtualizarPreview(index: number, patch: Partial<PerfilUiState['importacaoPreview'][number]>) {
      const importState = module.fluxoImportacao.atualizarRegistro(index, patch);
      preview = importState.preview;
      await rerender();
    },

    async onConfirmarImportacao() {
      const result = await module.fluxoImportacao.confirmar();
      preview = [];
      await rerender(`${result.importados.length} perfis importados.`);
    },

    async onExportar() {
      const csv = await module.exportar.execute({ incluirNomeReal: false });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'perfis.csv';
      a.click();
      URL.revokeObjectURL(url);
      releaseTransferPayload(csv);
    }
  };

  return {
    async mount(root: HTMLElement): Promise<void> {
      rootRef = root;
      panelMode = 'lista';
      await rerender();
    },
    async mountImportacao(root: HTMLElement): Promise<void> {
      rootRef = root;
      panelMode = 'importacao';
      await rerender();
    },
    async mountNovo(root: HTMLElement): Promise<void> {
      rootRef = root;
      panelMode = 'cadastro';
      await rerender();
    }
  };
}
