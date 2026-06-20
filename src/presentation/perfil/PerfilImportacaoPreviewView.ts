import type { PerfilImportacaoPreviewRegistro } from '../../domain/perfil/PerfilImportacao';

export interface PerfilImportacaoPreviewViewModel {
  registros: PerfilImportacaoPreviewRegistro[];
  podeEditarAoVivo: true;
  podeEditarBairro: true;
  cidadeVisivel: false;
  cidadePadrao: 'Brasília';
}

export function criarImportacaoPreviewViewModel(
  registros: PerfilImportacaoPreviewRegistro[]
): PerfilImportacaoPreviewViewModel {
  return {
    registros,
    podeEditarAoVivo: true,
    podeEditarBairro: true,
    cidadeVisivel: false,
    cidadePadrao: 'Brasília'
  };
}
