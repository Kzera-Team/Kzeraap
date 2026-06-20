import type { Repository } from '../ports/Repository';
import type { UxEvento, UxEventoTipo } from '../../domain/uxMetricas/UxMetricas';
import { UxMetricasSanitizer } from './UxMetricasSanitizer';

export interface UxMetricasServiceOptions {
  maxEventosBrutos?: number;
  clock?: { now(): Date };
  idFactory?: () => string;
}

export interface RegistrarUxEventoInput extends Omit<Partial<UxEvento>, 'id' | 'criadoEm' | 'sessaoId' | 'tipo'> {
  tipo: UxEventoTipo;
  sessaoId?: string;
}

export class UxMetricasService {
  private readonly maxEventosBrutos: number;
  private readonly clock: { now(): Date };
  private readonly idFactory: () => string;

  constructor(
    private readonly eventos: Repository<UxEvento>,
    private readonly sanitizer = new UxMetricasSanitizer(),
    options: UxMetricasServiceOptions = {}
  ) {
    this.maxEventosBrutos = options.maxEventosBrutos ?? 2000;
    this.clock = options.clock ?? { now: () => new Date() };
    this.idFactory = options.idFactory ?? (() => `ux-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  }

  async registrar(input: RegistrarUxEventoInput): Promise<UxEvento> {
    const evento = this.sanitizer.sanitize({
      id: this.idFactory(),
      criadoEm: this.clock.now().toISOString(),
      sessaoId: input.sessaoId || 'sessao-local',
      ...input
    });
    await this.eventos.save(evento);
    await this.aplicarRetencao();
    return evento;
  }

  async listar(): Promise<UxEvento[]> {
    return this.eventos.list();
  }

  async limpar(): Promise<void> {
    const todos = await this.eventos.list();
    if (!this.eventos.remove) return;
    await Promise.all(todos.map(evento => this.eventos.remove?.(evento.id)));
  }

  private async aplicarRetencao(): Promise<void> {
    if (!this.eventos.remove) return;
    const todos = await this.eventos.list();
    if (todos.length <= this.maxEventosBrutos) return;
    const excedentes = todos
      .slice()
      .sort((a, b) => a.criadoEm.localeCompare(b.criadoEm))
      .slice(0, todos.length - this.maxEventosBrutos);
    await Promise.all(excedentes.map(evento => this.eventos.remove?.(evento.id)));
  }
}
