import type { ItemCatalogoUiState } from '../ItemCatalogoViewTypes';
import { metricCard } from '../../shared/ui/MetricCard';

export class ItemDashboardRenderer {
  render(state: ItemCatalogoUiState): string {
    return [
      metricCard('Itens ativos', String(state.dashboard.totalAtivos), 'item-metric-card metric-primary'),
      metricCard('Arquivados', String(state.dashboard.arquivados), 'item-metric-card metric-warning'),
      metricCard('Sem preço', String(state.dashboard.semPreco), 'item-metric-card metric-danger'),
      metricCard('Custo médio', state.dashboard.custoMedio.toFixed(2), 'item-metric-card metric-success')
    ].join('');
  }
}
