import type { PerfilImportacaoPreviewRegistro } from '../../domain/perfil/PerfilImportacao';
import type { PerfilImportacaoParseResult } from '../../domain/perfil/PerfilImportacaoParser';
import {
  CIDADE_PADRAO_IMPORTACAO_PERFIL,
  criarPreviewImportacaoPerfil,
  normalizarTelefoneBrasil,
  validarPreviewImportacaoPerfil
} from '../../domain/perfil/PerfilImportacao';
import type { ImportacaoPerfisArquivoUseCase } from './ImportacaoPerfisArquivoUseCase';
import type { ConfirmarImportacaoPerfisResultado, ConfirmarImportacaoPerfisUseCase } from './ConfirmarImportacaoPerfisUseCase';
import { releaseObject } from '../../runtime/RuntimeCleanup';

export interface FluxoImportacaoPerfisState {
  parse?: PerfilImportacaoParseResult;
  preview: PerfilImportacaoPreviewRegistro[];
}

export class FluxoImportacaoPerfisUseCase {
  private state: FluxoImportacaoPerfisState = {
    preview: []
  };

  constructor(
    private readonly importarArquivo: ImportacaoPerfisArquivoUseCase,
    private readonly confirmarImportacao: ConfirmarImportacaoPerfisUseCase
  ) {}

  async carregarArquivo(file: File): Promise<FluxoImportacaoPerfisState> {
    const parse = await this.importarArquivo.execute(file);
    const preview = criarPreviewImportacaoPerfil(parse.linhas);

    this.state = {
      parse,
      preview
    };

    return this.state;
  }

  atualizarRegistro(index: number, patch: Partial<PerfilImportacaoPreviewRegistro>): FluxoImportacaoPerfisState {
    this.state = {
      ...this.state,
      preview: this.state.preview.map(registro => {
        if (registro.index !== index) return registro;

        const atualizado: PerfilImportacaoPreviewRegistro = {
          ...registro,
          ...patch,
          cidade: CIDADE_PADRAO_IMPORTACAO_PERFIL
        };

        if (patch.telefone !== undefined) {
          atualizado.telefone = normalizarTelefoneBrasil(patch.telefone);
        }

        const erros = validarPreviewImportacaoPerfil(atualizado);

        return {
          ...atualizado,
          valido: erros.length === 0,
          erros
        };
      })
    };

    return this.state;
  }

  async confirmar(): Promise<ConfirmarImportacaoPerfisResultado> {
    try {
      return await this.confirmarImportacao.execute(this.state.preview);
    } finally {
      releaseObject(this.state.preview);
      this.state = { preview: [] };
    }
  }

  limpar(): void {
    releaseObject(this.state.preview);
    this.state = { preview: [] };
  }

  current(): FluxoImportacaoPerfisState {
    return this.state;
  }
}
