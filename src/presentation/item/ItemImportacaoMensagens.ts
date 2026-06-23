import { ERRO_IMPORTACAO_ITEM_ARQUIVO_NAO_SUPORTADO, erroImportacaoItemEhCodigoConhecido } from '../../domain/item/ItemImportacaoErro';

const MENSAGENS_ERRO_IMPORTACAO_ITEM: Record<string, string> = {
  [ERRO_IMPORTACAO_ITEM_ARQUIVO_NAO_SUPORTADO]: 'Esse arquivo ainda não abre aqui. Abra a planilha, escolha “Salvar como CSV” e tente importar de novo. Nenhum item foi importado.',
};

export function mensagemErroImportacaoItem(erro: string): string {
  if (!erroImportacaoItemEhCodigoConhecido(erro)) return erro;
  return MENSAGENS_ERRO_IMPORTACAO_ITEM[erro];
}

export function mensagemErrosImportacaoItem(erros: string[]): string {
  return erros.map(mensagemErroImportacaoItem).join(' ');
}
