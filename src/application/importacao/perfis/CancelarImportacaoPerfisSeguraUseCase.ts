import {
  ImportacaoPerfisDomainError,
  escoposImportacaoPerfisIguais,
  resultadoImportacaoPerfis,
  type EscopoImportacaoPerfis,
  type ResultadoImportacaoPerfisEstruturado
} from '../../../domain/importacao/perfis/ImportacaoPerfisSegura';
import type {
  ImportacaoPerfisClock,
  ImportacaoPerfisStore
} from './ImportacaoPerfisSeguraPorts';

export class CancelarImportacaoPerfisSeguraUseCase {
  constructor(
    private readonly store: ImportacaoPerfisStore,
    private readonly clock: ImportacaoPerfisClock
  ) {}

  async execute(escopo: EscopoImportacaoPerfis): Promise<ResultadoImportacaoPerfisEstruturado> {
    const aggregate = await this.store.obter(escopo);
    if (!aggregate || !escoposImportacaoPerfisIguais(aggregate.escopo, escopo)) {
      throw new ImportacaoPerfisDomainError(
        'Importacao nao encontrada no escopo informado.',
        'IMPORTACAO_NAO_ENCONTRADA_NO_ESCOPO'
      );
    }

    if (aggregate.estado === 'cancelada') {
      return resultadoImportacaoPerfis(aggregate);
    }

    for (const item of aggregate.itens) {
      if (item.estado === 'pronto' || item.estado === 'pendente') {
        item.estado = 'cancelado';
        delete item.falha;
      }
    }

    aggregate.estado = 'cancelada';
    aggregate.atualizadaEm = this.clock.now().toISOString();

    for (const confirmacao of aggregate.confirmacoes) {
      if (confirmacao.estado !== 'processando') continue;
      confirmacao.estado = 'cancelada';
      confirmacao.atualizadaEm = aggregate.atualizadaEm;
    }

    const resultado = resultadoImportacaoPerfis(aggregate);
    for (const confirmacao of aggregate.confirmacoes) {
      if (confirmacao.estado === 'cancelada' && !confirmacao.resultado) {
        confirmacao.resultado = resultado;
      }
    }

    await this.store.salvar(aggregate);
    return resultado;
  }
}
