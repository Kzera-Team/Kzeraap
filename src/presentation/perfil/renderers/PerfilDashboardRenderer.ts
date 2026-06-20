import type { PerfilUiState } from '../PerfilViewTypes';
import { PerfilMetricRenderer } from './PerfilMetricRenderer';

export class PerfilDashboardRenderer {
  private readonly metric = new PerfilMetricRenderer();

  renderHeaderMetrics(state: PerfilUiState): string {
    return [
      this.metric.render('Resultados', String(state.perfis.length)),
      this.metric.render('Pendências', String(state.dashboard.semBairro + state.dashboard.semCodigo)),
      this.metric.render('Duplicidades', String(state.dashboard.possiveisDuplicados)),
      this.metric.render('Arquivados', String(state.dashboard.arquivados))
    ].join('');
  }

  renderDashboard(state: PerfilUiState): string {
    return [
      this.metric.render('Sem bairro', String(state.dashboard.semBairro)),
      this.metric.render('Sem código', String(state.dashboard.semCodigo)),
      this.metric.render('Aptos para código', String(state.dashboard.aptosParaCodigo)),
      this.metric.render('Duplicidades', String(state.dashboard.possiveisDuplicados)),
      this.metric.render('Arquivados', String(state.dashboard.arquivados))
    ].join('');
  }
}
