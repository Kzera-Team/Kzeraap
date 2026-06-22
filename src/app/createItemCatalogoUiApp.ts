import type { Repository } from '../application/ports/Repository';
import type { Clock } from '../core/Clock';
import type { ItemCatalogo, ItemLote, ItemVariacao } from '../domain/item/ItemCatalogo';
import type { Balanca } from '../domain/operacao/Balanca';
import { criarPreviewImportacaoItem, type ItemImportacaoPreviewRegistro } from '../domain/item/ItemImportacao';
import { BuildSafeItemSpreadsheetImportGateway } from '../infrastructure/importacao/ItemSpreadsheetImportGateway';
import { createItemCatalogoModule } from './createItemCatalogoModule';
import { ParseImportacaoCatalogoItensUseCase } from '../application/item/ParseImportacaoCatalogoItensUseCase';
import { ItemCatalogoDomView, type ItemCatalogoUiState } from '../presentation/item/ItemCatalogoDomView';
import { releaseTransferPayload } from '../runtime/TransferScope';
import type { ImportacaoRascunhoUseCase } from '../application/importacao/ImportacaoRascunhoUseCase';

function validarPreview(item: ItemImportacaoPreviewRegistro): ItemImportacaoPreviewRegistro {
  const erros: string[] = [];
  if (!item.nome?.trim()) erros.push('Nome é obrigatório.');
  if (!item.unidade) erros.push('Unidade é obrigatória.');
  return { ...item, valido: erros.length === 0, erros };
}

export function createItemCatalogoUiApp(
  items: Repository<ItemCatalogo>,
  balancas: Repository<Balanca>,
  clock: Clock,
  idFactory: () => string,
  rascunho?: ImportacaoRascunhoUseCase
) {
  const module = createItemCatalogoModule(items, balancas, clock, idFactory);
  const parser = new ParseImportacaoCatalogoItensUseCase(new BuildSafeItemSpreadsheetImportGateway());
  const view = new ItemCatalogoDomView();

  let rootRef: HTMLElement | null = null;
  let termo = '';
  let preview: ItemImportacaoPreviewRegistro[] = [];
  let editandoItemId: string | undefined;
  let loading = false;
  let erro: string | undefined;
  let panelMode: 'lista' | 'cadastro' | 'importacao' = 'lista';
  let loteSelecionado: { itemId: string; variacaoId: string; loteId: string } | undefined;

  async function state(mensagem?: string): Promise<ItemCatalogoUiState> {
    const uiState: ItemCatalogoUiState = {
      items: await module.listar.execute({ termo, status: 'todos' }),
      dashboard: await module.dashboard.execute(),
      preview,
      balancas: await balancas.list()
    };

    if (editandoItemId) uiState.editandoItemId = editandoItemId;
    if (loading) uiState.loading = loading;
    if (loteSelecionado) uiState.loteSelecionado = loteSelecionado;
    if (erro) uiState.erro = erro;
    if (mensagem) uiState.mensagem = mensagem;
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
      erro = error instanceof Error ? error.message : 'Não consegui concluir. Revise os campos e tente de novo.';
      await rerender();
    }
  }

  async function rerender(mensagem?: string): Promise<void> {
    if (!rootRef) return;
    view.render(rootRef, await state(mensagem), handlers, panelMode);
  }

  const handlers = {
    async onCriarItem(input: {
      nome: string;
      categoria: string;
      unidade: 'un' | 'g' | 'mg' | 'ml' | 'kg' | 'l';
      variacaoNome?: string;
      loteNome?: string;
      loteValor: number;
      loteCusto: number;
      loteQuantidade: number;
      loteData?: string;
    }) {
      const now = clock.now().toISOString();
      const variacaoNome = input.variacaoNome?.trim() || 'Padrão';
      const dataLancamento = input.loteData ? new Date(`${input.loteData}T00:00:00`).toISOString() : now;
      const loteAtivo = input.loteQuantidade > 0;
      const loteInicial: ItemLote = {
        id: idFactory(),
        nome: input.loteNome?.trim() || 'Entrada inicial',
        valor: input.loteValor,
        custo: input.loteCusto,
        custoTotal: input.loteCusto,
        custoUnitario: input.loteQuantidade ? input.loteCusto / input.loteQuantidade : 0,
        quantidade: input.loteQuantidade,
        quantidadeGuardada: input.loteQuantidade,
        dataLancamento,
        fracionamentos: [],
        retiradasInternas: [],
        conferencias: [],
        status: loteAtivo ? 'ativo' : 'encerrado',
        createdAt: now,
        updatedAt: now
      };
      if (!loteAtivo) loteInicial.observacao = 'Entrada inicial sem quantidade; não entra como estoque ativo.';
      const variacoes: ItemVariacao[] = [{
        id: idFactory(),
        nome: variacaoNome,
        unidade: input.unidade,
        status: 'ativo',
        createdAt: now,
        updatedAt: now,
        lotes: [loteInicial]
      }];

      await module.criar.execute({
        nome: input.nome,
        categoria: input.categoria || '',
        variacoes
      });
      await rerender('Item criado.');
    },

    async onEditarItem(itemId: string) {
      editandoItemId = itemId;
      await rerender();
    },

    async onAbrirLote(itemId: string, variacaoId: string, loteId: string) {
      loteSelecionado = { itemId, variacaoId, loteId };
      panelMode = 'lista';
      await rerender();
    },

    async onFecharLote() {
      loteSelecionado = undefined;
      await rerender();
    },

    async onRegistrarFracionamento(input: {
      itemId: string;
      variacaoId: string;
      loteId: string;
      tamanhoFracao: number;
      unidadeFracao: 'un' | 'g' | 'mg' | 'ml' | 'kg' | 'l';
      quantidadeUnidadesCriadas: number;
      dataFracionamento?: string;
      observacao?: string;
    }) {
      const payload: typeof input = { ...input };
      if (input.dataFracionamento) payload.dataFracionamento = new Date(`${input.dataFracionamento}T00:00:00`).toISOString();
      await runWithFeedback(async () => module.registrarFracionamento.execute(payload), 'Fracionamento registrado.');
    },

    async onPesagemRapida(input: {
      acao: 'iniciar' | 'registrar_peso' | 'pausar' | 'retomar' | 'finalizar' | 'corrigir_peso';
      itemId: string;
      variacaoId: string;
      loteId: string;
      fracionamentoId: string;
      sessaoId?: string;
      balancaId?: string;
      alvoMg?: number;
      usarEtiquetas?: boolean;
      etiquetaInicial?: number;
      pesoMg?: number;
      registroId?: string;
    }) {
      await runWithFeedback(async () => module.pesagemRapida.execute(input), 'Pesagem rápida atualizada.');
    },

    async onCancelarEdicao() {
      editandoItemId = undefined;
      await rerender();
    },

    async onSalvarItem(itemId: string, input: {
      nome: string;
      categoria: string;
      descricao?: string;
      tags: string[];
      observacao?: string;
    }) {
      await module.editar.execute(itemId, input);
      editandoItemId = undefined;
      await rerender('Item salvo.');
    },


    async onBuscar(value: string) {
      termo = value;
      await rerender();
    },

    async onArquivar(itemId: string) {
      await runWithFeedback(async () => module.arquivar.execute(itemId), 'Item arquivado.');
    },

    async onReativar(itemId: string) {
      await runWithFeedback(async () => module.reativar.execute(itemId), 'Item reativado.');
    },

    async onSelecionarArquivo(file: File) {
      const parsed = await parser.execute(file);
      preview = criarPreviewImportacaoItem(parsed.linhas);
      if (rascunho) {
        try {
          await rascunho.salvar({ tipo: 'itens', previewCount: preview.length });
        } catch { /* best-effort */ }
      }
      await rerender('Prévia carregada.');
    },

    async onAtualizarPreview(index: number, patch: Partial<ItemImportacaoPreviewRegistro>) {
      preview = preview.map(item => item.index === index ? validarPreview({ ...item, ...patch }) : item);
      if (rascunho && preview.length > 0) {
        try {
          await rascunho.salvar({ tipo: 'itens', previewCount: preview.length });
        } catch { /* best-effort */ }
      }
      await rerender();
    },

    async onAplicarCategoriaPreviewEmMassa(categoria: string) {
      preview = preview.map(item => validarPreview({ ...item, variacaoNome: categoria || item.variacaoNome || 'Padrão' }));
      if (rascunho && preview.length > 0) {
        try {
          await rascunho.salvar({ tipo: 'itens', previewCount: preview.length });
        } catch { /* best-effort */ }
      }
      await rerender();
    },

    async onLimparPreviewInvalidos() {
      preview = preview.filter(item => item.valido);
      if (rascunho) {
        try {
          await rascunho.salvar({ tipo: 'itens', previewCount: preview.length });
        } catch { /* best-effort */ }
      }
      await rerender();
    },

    async onConfirmarImportacao() {
      const result = await module.importar.execute(preview);
      const rejeitados = preview.filter(item => !item.valido).map(item => ({ ...item }));
      releaseTransferPayload(preview);
      preview = rejeitados;
      if (rascunho) {
        try {
          await rascunho.descartar('itens');
        } catch { /* best-effort */ }
      }
      await rerender(`${result.importados.length} itens importados.`);
    },

    async onExportar() {
      const csv = await module.exportar.execute();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'itens.csv';
      a.click();
      URL.revokeObjectURL(url);
      releaseTransferPayload(csv);
    }
  };

  return {
    async mount(root: HTMLElement): Promise<void> {
      rootRef = root;
      loteSelecionado = undefined;
      panelMode = 'lista';
      await rerender();
    },
    async mountImportacao(root: HTMLElement): Promise<void> {
      rootRef = root;
      loteSelecionado = undefined;
      panelMode = 'importacao';
      await rerender();
    },
    async mountNovo(root: HTMLElement): Promise<void> {
      rootRef = root;
      loteSelecionado = undefined;
      panelMode = 'cadastro';
      await rerender();
    },
    async descartarRascunho(): Promise<void> {
      preview = [];
      if (rascunho) {
        try {
          await rascunho.descartar('itens');
        } catch { /* best-effort */ }
      }
    }
  };
}
