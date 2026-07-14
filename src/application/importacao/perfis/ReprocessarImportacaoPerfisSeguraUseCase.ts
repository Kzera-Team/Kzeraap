import {
  ImportacaoPerfisDomainError,
  escoposImportacaoPerfisIguais,
  type DecisaoDuplicidadePerfil,
  type EscopoImportacaoPerfis,
  type ResultadoImportacaoPerfisEstruturado
} from '../../../domain/importacao/perfis/ImportacaoPerfisSegura';
import type { ImportacaoPerfisStore } from './ImportacaoPerfisSeguraPorts';
import type { ConfirmarImportacaoPerfisSeguraUseCase } from './ConfirmarImportacaoPerfisSeguraUseCase';

export interface ReprocessarItemImportacaoPerfilInput {
  escopo: EscopoImportacaoPerfis;
  itemId: string;
  idempotencyKey: string;
  decisao?: DecisaoDuplicidadePerfil;
  reassumirProcessamentoInterrompido: boolean;
}

export interface ReprocessarPerfilImportacaoInput {
  escopo: EscopoImportacaoPerfis;
  perfilId: string;
  idempotencyKey: string;
  decisoes: Readonly<Record<string, DecisaoDuplicidadePerfil>>;
  reassumirProcessamentoInterrompido: boolean;
}

export class ReprocessarImportacaoPerfisSeguraUseCase {
  constructor(
    private readonly store: ImportacaoPerfisStore,
    private readonly confirmar: ConfirmarImportacaoPerfisSeguraUseCase
  ) {}

  async porItem(input: ReprocessarItemImportacaoPerfilInput): Promise<ResultadoImportacaoPerfisEstruturado> {
    const aggregate = await this.obterAggregate(input.escopo);
    const item = aggregate.itens.find(candidate => candidate.id === input.itemId);
    if (!item) {
      throw new ImportacaoPerfisDomainError(
        'Item nao encontrado no lote e importacao informados.',
        'ITEM_NAO_ENCONTRADO_NO_ESCOPO'
      );
    }

    const decisoes: Record<string, DecisaoDuplicidadePerfil> = {};
    if (input.decisao) decisoes[item.id] = input.decisao;

    return this.confirmar.execute({
      escopo: input.escopo,
      idempotencyKey: input.idempotencyKey,
      decisoes,
      itemIds: [item.id],
      reprocessamento: true,
      reassumirProcessamentoInterrompido: input.reassumirProcessamentoInterrompido
    });
  }

  async porPerfil(input: ReprocessarPerfilImportacaoInput): Promise<ResultadoImportacaoPerfisEstruturado> {
    const aggregate = await this.obterAggregate(input.escopo);
    const itemIds = aggregate.itens
      .filter(item => item.perfilId === input.perfilId
        || item.candidatos.some(candidate => candidate.perfilId === input.perfilId))
      .map(item => item.id);

    if (itemIds.length === 0) {
      throw new ImportacaoPerfisDomainError(
        'Perfil nao esta relacionado a nenhum item deste escopo.',
        'PERFIL_NAO_RELACIONADO_A_IMPORTACAO'
      );
    }

    return this.confirmar.execute({
      escopo: input.escopo,
      idempotencyKey: input.idempotencyKey,
      decisoes: input.decisoes,
      itemIds,
      reprocessamento: true,
      reassumirProcessamentoInterrompido: input.reassumirProcessamentoInterrompido
    });
  }

  private async obterAggregate(escopo: EscopoImportacaoPerfis) {
    const aggregate = await this.store.obter(escopo);
    if (!aggregate || !escoposImportacaoPerfisIguais(aggregate.escopo, escopo)) {
      throw new ImportacaoPerfisDomainError(
        'Importacao nao encontrada no escopo informado.',
        'IMPORTACAO_NAO_ENCONTRADA_NO_ESCOPO'
      );
    }
    return aggregate;
  }
}
