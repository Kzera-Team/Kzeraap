import type { Perfil } from '../../domain/perfil/Perfil';
import type { PerfilPendenciasDashboard } from '../../domain/perfil/PerfilPendenciasDashboard';
import type { PerfilDuplicidade } from '../../domain/perfil/PerfilDuplicidade';
import type { PerfilImportacaoPreviewRegistro } from '../../domain/perfil/PerfilImportacao';

export interface PerfilTimelineItem {
  id: string;
  perfilId: string;
  descricao: string;
  createdAt: string;
  tipo?: string;
}

export interface PerfilUiState {
  perfis: Perfil[];
  dashboard: PerfilPendenciasDashboard;
  duplicidades: PerfilDuplicidade[];
  importacaoPreview: PerfilImportacaoPreviewRegistro[];
  timeline: PerfilTimelineItem[];
  termoBusca?: string;
  mensagem?: string;
  erro?: string;
  loading?: boolean;
}

export interface PerfilUiHandlers {
  onCriarPerfil(input: {
    nome: string;
    telefone?: string;
    email?: string;
    bairro?: string;
    municipio?: string;
    conhecePessoalmente: boolean;
  }): Promise<void>;
  onBuscar(termo: string): Promise<void>;
  onLimparBusca(): Promise<void>;
  onArquivar(perfilId: string): Promise<void>;
  onReativar(perfilId: string): Promise<void>;
  onDefinirCodigo(perfilId: string): Promise<void>;
  onSelecionarArquivo(file: File): Promise<void>;
  onAtualizarPreview(index: number, patch: Partial<PerfilImportacaoPreviewRegistro>): Promise<void>;
  onConfirmarImportacao(): Promise<void>;
  onExportar(): Promise<void>;
}
