import { CancelarImportacaoPerfisSeguraUseCase } from '../../application/importacao/perfis/CancelarImportacaoPerfisSeguraUseCase';
import { ConfirmarImportacaoPerfisSeguraUseCase } from '../../application/importacao/perfis/ConfirmarImportacaoPerfisSeguraUseCase';
import { GerenciarRascunhoImportacaoPerfisUseCase } from '../../application/importacao/perfis/GerenciarRascunhoImportacaoPerfisUseCase';
import { PrepararImportacaoPerfisSeguraUseCase } from '../../application/importacao/perfis/PrepararImportacaoPerfisSeguraUseCase';
import { ReprocessarImportacaoPerfisSeguraUseCase } from '../../application/importacao/perfis/ReprocessarImportacaoPerfisSeguraUseCase';
import type { Repository } from '../../application/ports/Repository';
import type { Clock } from '../../core/Clock';
import type { Perfil } from '../../domain/perfil/Perfil';
import { ImportacaoPerfisIndexedDbStore } from '../../infrastructure/importacao/perfis/ImportacaoPerfisIndexedDbStore';
import {
  InMemoryImportacaoPerfisLock,
  RepositoryPerfilImportacaoGateway
} from '../../infrastructure/importacao/perfis/RepositoryPerfilImportacaoGateway';
import type { SessionContext } from '../../runtime/SessionContext';

export interface CreateImportacaoPerfisSeguraCompositionParams {
  usuarioId: string;
  session: SessionContext;
  perfis: Repository<Perfil>;
  clock: Clock;
  nextPerfilId: () => string;
}

export function createImportacaoPerfisSeguraComposition(
  params: CreateImportacaoPerfisSeguraCompositionParams
) {
  const store = new ImportacaoPerfisIndexedDbStore(params.session);
  const gateway = new RepositoryPerfilImportacaoGateway(
    params.usuarioId,
    params.perfis,
    params.clock,
    params.nextPerfilId
  );
  const lock = new InMemoryImportacaoPerfisLock();

  const confirmar = new ConfirmarImportacaoPerfisSeguraUseCase(
    store,
    gateway,
    lock,
    params.clock
  );

  return {
    preparar: new PrepararImportacaoPerfisSeguraUseCase(store, gateway, params.clock),
    confirmar,
    cancelar: new CancelarImportacaoPerfisSeguraUseCase(store, params.clock),
    reprocessar: new ReprocessarImportacaoPerfisSeguraUseCase(store, confirmar),
    rascunho: new GerenciarRascunhoImportacaoPerfisUseCase(store)
  };
}
