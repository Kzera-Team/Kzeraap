export const ERRO_IMPORTACAO_ITEM_ARQUIVO_NAO_SUPORTADO = 'arquivo_item_nao_suportado';

export type ErroImportacaoItemCodigo = typeof ERRO_IMPORTACAO_ITEM_ARQUIVO_NAO_SUPORTADO;

export function erroImportacaoItemEhCodigoConhecido(erro: string): erro is ErroImportacaoItemCodigo {
  return erro === ERRO_IMPORTACAO_ITEM_ARQUIVO_NAO_SUPORTADO;
}
