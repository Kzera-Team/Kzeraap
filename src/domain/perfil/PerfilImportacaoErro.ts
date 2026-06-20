export interface PerfilImportacaoErro {
  linha: number;
  campo?: string;
  valor?: string;
  motivo: string;
}

export function exportarErrosImportacaoCsv(erros: PerfilImportacaoErro[]): string {
  const headers = ['Linha', 'Campo', 'Valor', 'Motivo'];
  const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const rows = erros.map(erro => [
    erro.linha,
    erro.campo || '',
    erro.valor || '',
    erro.motivo
  ].map(escape).join(','));

  return [headers.map(escape).join(','), ...rows].join('\n');
}
