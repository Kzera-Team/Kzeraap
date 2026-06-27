export function origemRelatorioLabel(origem: string): string {
  const labels: Record<string, string> = {
    importado_csv: 'Importado',
    manual: 'Novo registro',
    sistema_antigo: 'Sistema antigo',
    conciliacao: 'Conferência'
  };
  return labels[origem] || origem;
}

export function statusRelatorioLabel(status: string): string {
  const labels: Record<string, string> = { pago: 'Pago', parcial: 'Parcial', pendente: 'Pendente', cancelado: 'Cancelado' };
  return labels[status] || status;
}
