import {
  ImportacaoPerfisDomainError,
  escoposImportacaoPerfisIguais,
  type EscopoImportacaoPerfis,
  type ImportacaoPerfisAggregate
} from '../../../domain/importacao/perfis/ImportacaoPerfisSegura';
import type { ImportacaoPerfisStore } from './ImportacaoPerfisSeguraPorts';

export class GerenciarRascunhoImportacaoPerfisUseCase {
  constructor(private readonly store: ImportacaoPerfisStore) {}

  async retomar(escopo: EscopoImportacaoPerfis): Promise<ImportacaoPerfisAggregate> {
    const aggregate = await this.store.obter(escopo);
    if (!aggregate || !escoposImportacaoPerfisIguais(aggregate.escopo, escopo)) {
      throw new ImportacaoPerfisDomainError(
        'Rascunho nao encontrado no escopo informado.',
        'RASCUNHO_NAO_ENCONTRADO_NO_ESCOPO'
      );
    }
    return aggregate;
  }

  async descartar(escopo: EscopoImportacaoPerfis): Promise<void> {
    const aggregate = await this.store.obter(escopo);
    if (!aggregate) return;
    if (!escoposImportacaoPerfisIguais(aggregate.escopo, escopo)) {
      throw new ImportacaoPerfisDomainError(
        'Rascunho pertence a outro escopo.',
        'VIOLACAO_ISOLAMENTO_IMPORTACAO'
      );
    }
    if (aggregate.estado === 'confirmando') {
      throw new ImportacaoPerfisDomainError(
        'Rascunho em confirmacao nao pode ser descartado. Cancele primeiro.',
        'RASCUNHO_EM_CONFIRMacao'
      );
    }
    await this.store.remover(escopo);
  }
}
