import { PrimeiroAcessoUseCase } from '../../application/auth/PrimeiroAcessoUseCase';
import { LoginUseCase } from '../../application/auth/LoginUseCase';
import { BloquearSessaoUseCase } from '../../application/auth/BloquearSessaoUseCase';
import { ObterAuthStateUseCase } from '../../application/auth/ObterAuthStateUseCase';
import { ConfirmarFaceIdUseCase } from '../../application/auth/ConfirmarFaceIdUseCase';
import { BrowserKeyValueStore } from '../../infrastructure/storage/BrowserKeyValueStore';
import { RuntimeMetadataKeyValueStore } from '../../infrastructure/storage/RuntimeMetadataKeyValueStore';
import { BrowserFaceIdGateway } from '../../infrastructure/auth/BrowserFaceIdGateway';
import { createFoundationSecurity } from '../createFoundationSecurity';
import { CodigoPerfilRuleService } from '../codigoPerfil/CodigoPerfilRuleService';
import type { appClock } from './AppCompositionIds';

export function createSecurityComposition(clock: typeof appClock) {
  const browserStore = new BrowserKeyValueStore('kzera-runtime');
  const stateStore = new RuntimeMetadataKeyValueStore(browserStore);
  const configStore = new BrowserKeyValueStore('kzera-config');
  const security = createFoundationSecurity(stateStore, clock);
  const primeiroAcesso = new PrimeiroAcessoUseCase(security.accessCoordinator);
  const login = new LoginUseCase(security.accessCoordinator);
  const faceIdGateway = new BrowserFaceIdGateway();
  const confirmarAtencao = new ConfirmarFaceIdUseCase(security.session, faceIdGateway);
  const obterAuthState = new ObterAuthStateUseCase(security.accessCoordinator, security.session);
  const bloquear = new BloquearSessaoUseCase(security.resourceScope);
  const codigoPerfilRules = new CodigoPerfilRuleService(configStore);

  return {
    browserStore,
    stateStore,
    security,
    primeiroAcesso,
    login,
    faceIdGateway,
    confirmarAtencao,
    obterAuthState,
    bloquear,
    codigoPerfilRules
  };
}
