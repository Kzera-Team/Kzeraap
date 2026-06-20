import type { PerfilImportacaoLinha, PerfilImportacaoPreviewRegistro } from '../../domain/perfil/PerfilImportacao';
import { criarPreviewImportacaoPerfil } from '../../domain/perfil/PerfilImportacao';

export class PrepararImportacaoPerfisUseCase {
  execute(linhas: PerfilImportacaoLinha[]): PerfilImportacaoPreviewRegistro[] {
    return criarPreviewImportacaoPerfil(linhas);
  }
}
