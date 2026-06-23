import type { ItemUnidade } from './ItemCatalogo';
import type { ItemImportacaoPreviewRegistro } from './ItemImportacao';

const UNIDADES_IMPORTACAO: ItemUnidade[] = ['un', 'g', 'mg', 'ml', 'kg', 'l'];

export function validarUnidadeImportacaoItem(unidade: ItemImportacaoPreviewRegistro['unidade']): string | null {
  if (!unidade) return 'Unidade é obrigatória.';
  return UNIDADES_IMPORTACAO.includes(unidade) ? null : `Unidade inválida: ${unidade}.`;
}

export function validarPreviewImportacaoItem(item: ItemImportacaoPreviewRegistro): ItemImportacaoPreviewRegistro {
  const erros: string[] = [...(item.errosImportacao || [])];
  const erroUnidade = validarUnidadeImportacaoItem(item.unidade);

  if (!item.nome?.trim()) erros.push('Nome é obrigatório.');
  if (erroUnidade && !erros.some(erro => erro.includes('Unidade'))) erros.push(erroUnidade);

  return { ...item, valido: erros.length === 0, erros };
}
