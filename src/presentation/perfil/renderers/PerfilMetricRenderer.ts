import { metricCard } from '../../shared/ui/MetricCard';

export class PerfilMetricRenderer {
  render(label: string, value: string): string {
    return metricCard(label, value, 'metric-card');
  }
}
