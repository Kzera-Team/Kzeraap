import type { ItemCatalogo, ItemUnidade } from '../../domain/item/ItemCatalogo';
import type { ItemDashboard } from '../../domain/item/ItemDashboard';
import type { Balanca } from '../../domain/operacao/Balanca';
import type { ItemImportacaoPreviewRegistro } from '../../domain/item/ItemImportacao';

export interface ItemCatalogoUiState {
  items: ItemCatalogo[];
  dashboard: ItemDashboard;
  preview: ItemImportacaoPreviewRegistro[];
  editandoItemId?: string;
  mensagem?: string;
  erro?: string;
  loading?: boolean;
  loteSelecionado?: { itemId: string; variacaoId: string; loteId: string };
  balancas: Balanca[];
}

export interface ItemCatalogoUiHandlers {
  onCriarItem(input: { nome: string; categoria: string; unidade: ItemUnidade; variacaoNome?: string; loteNome?: string; loteValor: number; loteCusto: number; loteQuantidade: number; loteData?: string }): Promise<void>;
  onBuscar(termo: string): Promise<void>;
  onEditarItem(itemId: string): Promise<void>;
  onAbrirLote(itemId: string, variacaoId: string, loteId: string): Promise<void>;
  onFecharLote(): Promise<void>;
  onRegistrarFracionamento(input: { itemId: string; variacaoId: string; loteId: string; tamanhoFracao: number; unidadeFracao: ItemUnidade; quantidadeUnidadesCriadas: number; dataFracionamento?: string; observacao?: string }): Promise<void>;
  onPesagemRapida(input: { acao: 'iniciar' | 'registrar_peso' | 'pausar' | 'retomar' | 'finalizar' | 'corrigir_peso'; itemId: string; variacaoId: string; loteId: string; fracionamentoId: string; sessaoId?: string; balancaId?: string; alvoMg?: number; usarEtiquetas?: boolean; etiquetaInicial?: number; pesoMg?: number; registroId?: string }): Promise<void>;
  onCancelarEdicao(): Promise<void>;
  onSalvarItem(itemId: string, input: { nome: string; categoria: string; descricao?: string; tags: string[]; observacao?: string }): Promise<void>;
  onArquivar(itemId: string): Promise<void>;
  onReativar(itemId: string): Promise<void>;
  onSelecionarArquivo(file: File): Promise<void>;
  onAtualizarPreview(index: number, patch: Partial<ItemImportacaoPreviewRegistro>): Promise<void>;
  onAplicarCategoriaPreviewEmMassa(categoria: string): Promise<void>;
  onLimparPreviewInvalidos(): Promise<void>;
  onConfirmarImportacao(): Promise<void>;
  onExportar(): Promise<void>;
}
