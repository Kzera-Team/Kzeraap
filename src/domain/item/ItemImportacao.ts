import type { ItemUnidade } from './ItemCatalogo';
import { VARIACAO_PADRAO_ITEM } from './ItemCatalogo';

export interface ItemImportacaoLinha {
  nome: string;
  categoria?: string;
  variacaoNome?: string;
  unidade?: ItemUnidade;
  quantidadeLote?: number;
  custoLote?: number;
  valorLote?: number;
  loteNome?: string;
  categoriaReal?: string;
  descricao?: string;
  tags?: string[];
  observacao?: string;
  errosImportacao?: string[];
}

export interface ItemImportacaoPreviewRegistro extends ItemImportacaoLinha {
  index: number;
  valido: boolean;
  erros: string[];
}

export function criarPreviewImportacaoItem(linhas: ItemImportacaoLinha[]): ItemImportacaoPreviewRegistro[] {
  return linhas.map((linha, index) => {
    const erros: string[] = [...(linha.errosImportacao || [])];
    if (!linha.nome?.trim()) erros.push('Nome é obrigatório.');
    if (!linha.unidade && !erros.some(erro => erro.includes('Unidade'))) erros.push('Unidade da variação é obrigatória.');
    const variacaoNome = linha.variacaoNome?.trim() || linha.categoria?.trim() || VARIACAO_PADRAO_ITEM;
    return {
      ...linha,
      variacaoNome,
      categoriaReal: linha.categoriaReal || '',
      index,
      quantidadeLote: linha.quantidadeLote ?? 0,
      custoLote: linha.custoLote ?? 0,
      valorLote: linha.valorLote ?? 0,
      valido: erros.length === 0,
      erros
    };
  });
}
