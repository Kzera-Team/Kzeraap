import type { ItemUnidade } from './ItemCatalogo';

export type DecisaoImportacaoItem =
  | 'criar_item'
  | 'criar_variacao_em_item_existente'
  | 'adicionar_lote_em_variacao_existente'
  | 'ignorar';

export interface ItemImportacaoNormalizadaPreview {
  id: string;
  index: number;

  nomeOriginal: string;
  variacaoOriginal?: string;
  unidade?: ItemUnidade;

  quantidadeLote: number;
  custoLote: number;
  valorLote: number;
  loteNome?: string;

  decisao: DecisaoImportacaoItem;

  itemDestinoId?: string;
  variacaoDestinoId?: string;

  nomeItemFinal?: string;
  nomeVariacaoFinal?: string;

  valido: boolean;
  erros: string[];
}
