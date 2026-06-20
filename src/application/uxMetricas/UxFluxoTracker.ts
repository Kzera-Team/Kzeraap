import type { Repository } from '../ports/Repository';
import type { UxFluxoResumo } from '../../domain/uxMetricas/UxMetricas';
import { UxMetricasService } from './UxMetricasService';

export class UxFluxoTracker {
  private readonly ativos = new Map<string, UxFluxoResumo>();

  constructor(
    private readonly resumos: Repository<UxFluxoResumo>,
    private readonly metricas: UxMetricasService,
    private readonly clock: { now(): Date } = { now: () => new Date() },
    private readonly idFactory: () => string = () => `ux-fluxo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  ) {}

  async iniciar(fluxo: string, sessaoId = 'sessao-local'): Promise<UxFluxoResumo> {
    const resumo: UxFluxoResumo = {
      id: this.idFactory(),
      fluxo,
      iniciadoEm: this.clock.now().toISOString(),
      status: 'em_andamento',
      tempoTotalMs: 0,
      quantidadeAcoes: 0,
      quantidadeTelas: 0,
      quantidadeVoltas: 0,
      quantidadeErros: 0
    };
    this.ativos.set(fluxo, resumo);
    await this.resumos.save(resumo);
    await this.metricas.registrar({ tipo: 'fluxo_iniciado', fluxo, fluxoId: resumo.id, sessaoId });
    return resumo;
  }

  async registrarAcao(fluxo: string): Promise<void> {
    const resumo = this.ativos.get(fluxo);
    if (!resumo) return;
    resumo.quantidadeAcoes += 1;
    await this.resumos.save(resumo);
  }

  async registrarTela(fluxo: string): Promise<void> {
    const resumo = this.ativos.get(fluxo);
    if (!resumo) return;
    resumo.quantidadeTelas += 1;
    await this.resumos.save(resumo);
  }

  async registrarVolta(fluxo: string): Promise<void> {
    const resumo = this.ativos.get(fluxo);
    if (!resumo) return;
    resumo.quantidadeVoltas += 1;
    await this.resumos.save(resumo);
  }

  async registrarErro(fluxo: string): Promise<void> {
    const resumo = this.ativos.get(fluxo);
    if (!resumo) return;
    resumo.quantidadeErros += 1;
    await this.resumos.save(resumo);
  }

  async concluir(fluxo: string, sessaoId = 'sessao-local'): Promise<UxFluxoResumo | null> {
    return this.finalizar(fluxo, 'concluido', sessaoId);
  }

  async abandonar(fluxo: string, sessaoId = 'sessao-local'): Promise<UxFluxoResumo | null> {
    return this.finalizar(fluxo, 'abandonado', sessaoId);
  }

  private async finalizar(fluxo: string, status: 'concluido' | 'abandonado', sessaoId: string): Promise<UxFluxoResumo | null> {
    const resumo = this.ativos.get(fluxo);
    if (!resumo) return null;
    const finalizadoEm = this.clock.now().toISOString();
    const tempoTotalMs = Math.max(0, new Date(finalizadoEm).getTime() - new Date(resumo.iniciadoEm).getTime());
    const final = { ...resumo, status, finalizadoEm, tempoTotalMs };
    this.ativos.delete(fluxo);
    await this.resumos.save(final);
    await this.metricas.registrar({
      tipo: status === 'concluido' ? 'fluxo_concluido' : 'fluxo_abandonado',
      fluxo,
      fluxoId: final.id,
      sessaoId,
      tempoTotalMs,
      quantidadeAcoes: final.quantidadeAcoes,
      quantidadeVoltas: final.quantidadeVoltas,
      quantidadeErros: final.quantidadeErros,
      concluiu: status === 'concluido'
    });
    return final;
  }
}
