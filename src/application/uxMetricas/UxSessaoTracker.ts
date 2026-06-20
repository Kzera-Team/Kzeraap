import { UxMetricasService } from './UxMetricasService';

export class UxSessaoTracker {
  readonly sessaoId: string;
  private iniciada = false;

  constructor(
    private readonly metricas: UxMetricasService,
    private readonly idFactory: () => string = () => `sessao-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  ) {
    this.sessaoId = this.idFactory();
  }

  async iniciar(): Promise<void> {
    if (this.iniciada) return;
    this.iniciada = true;
    await this.metricas.registrar({ tipo: 'app_sessao_iniciada', sessaoId: this.sessaoId });
  }

  async finalizar(): Promise<void> {
    await this.metricas.registrar({ tipo: 'app_sessao_finalizada', sessaoId: this.sessaoId });
  }

  async bloquear(): Promise<void> {
    await this.metricas.registrar({ tipo: 'app_bloqueado', sessaoId: this.sessaoId });
  }

  async desbloquear(): Promise<void> {
    await this.metricas.registrar({ tipo: 'app_desbloqueado', sessaoId: this.sessaoId });
  }

  async reabrir(): Promise<void> {
    await this.metricas.registrar({ tipo: 'app_reaberto', sessaoId: this.sessaoId });
  }
}
