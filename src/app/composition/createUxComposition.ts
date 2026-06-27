import { createUxEventosRepository, createUxFluxosResumoRepository } from '../../infrastructure/repositories/UxMetricasRepository';
import { UxMetricasService } from '../../application/uxMetricas/UxMetricasService';
import { UxSessaoTracker } from '../../application/uxMetricas/UxSessaoTracker';
import { UxFluxoTracker } from '../../application/uxMetricas/UxFluxoTracker';
import { UxDomTracker } from '../../presentation/shared/uxTracking/UxDomTracker';
import type { appClock } from './AppCompositionIds';
import { nextUxFluxoId, nextUxId, nextUxSessaoId } from './AppCompositionIds';

export function createUxComposition(clock: typeof appClock) {
  const uxMetricas = new UxMetricasService(createUxEventosRepository(), undefined, { clock, idFactory: nextUxId });
  const uxSessao = new UxSessaoTracker(uxMetricas, nextUxSessaoId);
  const uxFluxos = new UxFluxoTracker(createUxFluxosResumoRepository(), uxMetricas, clock, nextUxFluxoId);
  const uxTracker = new UxDomTracker(uxMetricas, uxSessao, uxFluxos);

  return { uxTracker };
}
