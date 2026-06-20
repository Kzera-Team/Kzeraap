export type PerfilImportacaoFormato = 'csv' | 'tsv' | 'txt' | 'xls' | 'xlsx';

export const CLIENTE_IMPORTACAO_FORMATOS_ACEITOS: PerfilImportacaoFormato[] = [
  'csv',
  'tsv',
  'txt'
];

export const CLIENTE_IMPORTACAO_ACCEPT_ATTRIBUTE = '.csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain';

export function detectarFormatoImportacaoPerfil(fileName: string): PerfilImportacaoFormato {
  const lower = fileName.toLowerCase();

  if (lower.endsWith('.xlsx')) return 'xlsx';
  if (lower.endsWith('.xls')) return 'xls';
  if (lower.endsWith('.tsv')) return 'tsv';
  if (lower.endsWith('.txt')) return 'txt';
  return 'csv';
}

export function isFormatoPlanilhaPerfil(formato: PerfilImportacaoFormato): boolean {
  return formato === 'xls' || formato === 'xlsx';
}
