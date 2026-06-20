export type ImportacaoTabAtiva = 'perfis' | 'itens' | 'transacoes';

const tabs: Array<{ id: ImportacaoTabAtiva; icon: string; label: string }> = [
  { id: 'perfis', icon: '♟', label: 'Perfis' },
  { id: 'itens', icon: '▣', label: 'Itens' },
  { id: 'transacoes', icon: '▤', label: 'Transações' }
];

export function renderImportacaoTabs(active: ImportacaoTabAtiva): string {
  return `<nav class="importTabs import-tabs" aria-label="Tipo de importação">
    ${tabs.map(tab => `<button type="button" class="importTab import-tab ${tab.id === active ? 'active' : ''}" ${tab.id === active ? 'aria-current="page"' : 'disabled'}><span aria-hidden="true">${tab.icon}</span><span>${tab.label}</span></button>`).join('')}
  </nav>`;
}
