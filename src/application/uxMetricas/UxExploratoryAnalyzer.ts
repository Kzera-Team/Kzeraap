import type { UxEvento, UxFluxoResumo } from '../../domain/uxMetricas/UxMetricas';

export type UxProblemaTipo =
  | 'cliques_demais'
  | 'tempo_alto'
  | 'voltas_demais'
  | 'erros_demais'
  | 'abandono'
  | 'lista_grande';

export type UxProblemaSeveridade = 'observacao' | 'atencao' | 'bloqueador_ux';

export interface UxExploratoryThresholds {
  maxAcoesPorFluxo: number;
  maxTempoFluxoMs: number;
  maxVoltasPorFluxo: number;
  maxErrosPorFluxo: number;
  maxRenderizacaoLista: number;
}

export interface UxExploratoryFinding {
  tipo: UxProblemaTipo;
  severidade: UxProblemaSeveridade;
  tela?: string;
  fluxo?: string;
  valor: number;
  limite: number;
  mensagem: string;
  recomendacao: string;
}

export interface UxExploratoryReport {
  geradoEm: string;
  fluxosAvaliados: number;
  eventosAvaliados: number;
  problemas: UxExploratoryFinding[];
  podeSeguirParaRelatorios: boolean;
}

export const UX_EXPLORATORY_DEFAULT_THRESHOLDS: UxExploratoryThresholds = {
  maxAcoesPorFluxo: 12,
  maxTempoFluxoMs: 120000,
  maxVoltasPorFluxo: 2,
  maxErrosPorFluxo: 1,
  maxRenderizacaoLista: 80
};

function severity(value: number, limit: number): UxProblemaSeveridade {
  if (value > limit * 2) return 'bloqueador_ux';
  if (value > limit) return 'atencao';
  return 'observacao';
}

function finding(input: Omit<UxExploratoryFinding, 'mensagem' | 'recomendacao'>): UxExploratoryFinding {
  const subject = input.fluxo ? `O fluxo ${input.fluxo}` : `A tela ${input.tela || 'avaliada'}`;

  const copy: Record<UxProblemaTipo, { mensagem: string; recomendacao: string }> = {
    cliques_demais: {
      mensagem: `${subject} exigiu ações demais para uma rotina operacional.`,
      recomendacao: 'Reduzir etapas, transformar ação recorrente em atalho ou mover a ação principal para mais perto da primeira tela.'
    },
    tempo_alto: {
      mensagem: `${subject} levou tempo demais para concluir.`,
      recomendacao: 'Revisar campos obrigatórios, ordem das etapas, textos de ajuda e salvamento automático.'
    },
    voltas_demais: {
      mensagem: `${subject} teve muitas voltas durante o uso.`,
      recomendacao: 'Reorganizar a navegação e trazer a informação necessária para a própria tela do fluxo.'
    },
    erros_demais: {
      mensagem: `${subject} gerou erros demais.`,
      recomendacao: 'Melhorar validações preventivas, mensagens humanas e estados de correção sem culpar a Usuária.'
    },
    abandono: {
      mensagem: `${subject} foi abandonado antes de concluir.`,
      recomendacao: 'Verificar se a tela explica claramente o próximo passo, se existe medo de confirmar ou se há decisão demais.'
    },
    lista_grande: {
      mensagem: `${subject} precisou limitar registros para proteger o iPhone.`,
      recomendacao: 'Implementar paginação/consulta indexada antes de adicionar Relatórios sobre esta base.'
    }
  };

  return {
    ...input,
    mensagem: copy[input.tipo].mensagem,
    recomendacao: copy[input.tipo].recomendacao
  };
}

export class UxExploratoryAnalyzer {
  constructor(
    private readonly thresholds: UxExploratoryThresholds = UX_EXPLORATORY_DEFAULT_THRESHOLDS,
    private readonly clock: { now(): Date } = { now: () => new Date() }
  ) {}

  analisar(fluxos: UxFluxoResumo[], eventos: UxEvento[]): UxExploratoryReport {
    const problemas: UxExploratoryFinding[] = [];

    for (const fluxo of fluxos) {
      if (fluxo.quantidadeAcoes > this.thresholds.maxAcoesPorFluxo) {
        problemas.push(finding({
          tipo: 'cliques_demais',
          severidade: severity(fluxo.quantidadeAcoes, this.thresholds.maxAcoesPorFluxo),
          fluxo: fluxo.fluxo,
          valor: fluxo.quantidadeAcoes,
          limite: this.thresholds.maxAcoesPorFluxo
        }));
      }

      if (fluxo.tempoTotalMs > this.thresholds.maxTempoFluxoMs) {
        problemas.push(finding({
          tipo: 'tempo_alto',
          severidade: severity(fluxo.tempoTotalMs, this.thresholds.maxTempoFluxoMs),
          fluxo: fluxo.fluxo,
          valor: fluxo.tempoTotalMs,
          limite: this.thresholds.maxTempoFluxoMs
        }));
      }

      if (fluxo.quantidadeVoltas > this.thresholds.maxVoltasPorFluxo) {
        problemas.push(finding({
          tipo: 'voltas_demais',
          severidade: severity(fluxo.quantidadeVoltas, this.thresholds.maxVoltasPorFluxo),
          fluxo: fluxo.fluxo,
          valor: fluxo.quantidadeVoltas,
          limite: this.thresholds.maxVoltasPorFluxo
        }));
      }

      if (fluxo.quantidadeErros > this.thresholds.maxErrosPorFluxo) {
        problemas.push(finding({
          tipo: 'erros_demais',
          severidade: severity(fluxo.quantidadeErros, this.thresholds.maxErrosPorFluxo),
          fluxo: fluxo.fluxo,
          valor: fluxo.quantidadeErros,
          limite: this.thresholds.maxErrosPorFluxo
        }));
      }

      if (fluxo.status === 'abandonado') {
        problemas.push(finding({
          tipo: 'abandono',
          severidade: 'bloqueador_ux',
          fluxo: fluxo.fluxo,
          valor: 1,
          limite: 0
        }));
      }
    }

    for (const evento of eventos) {
      if (evento.tipo !== 'lista_limitada') continue;
      const renderizados = evento.quantidadeRenderizada ?? 0;
      if (renderizados >= this.thresholds.maxRenderizacaoLista) {
        problemas.push(finding({
          tipo: 'lista_grande',
          severidade: 'atencao',
          tela: evento.tela || 'lista',
          valor: renderizados,
          limite: this.thresholds.maxRenderizacaoLista
        }));
      }
    }

    return {
      geradoEm: this.clock.now().toISOString(),
      fluxosAvaliados: fluxos.length,
      eventosAvaliados: eventos.length,
      problemas,
      podeSeguirParaRelatorios: !problemas.some(problema => problema.severidade === 'bloqueador_ux')
    };
  }
}
