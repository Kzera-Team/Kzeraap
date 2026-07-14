import {
  ImportacaoPerfisDomainError,
  chaveEscopoImportacaoPerfis,
  validarEscopoImportacaoPerfis,
  validarInputImportacaoPerfil,
  type EscopoImportacaoPerfis,
  type ImportacaoPerfilItem,
  type ImportacaoPerfisAggregate,
  type PerfilImportacaoSeguraInput
} from '../../../domain/importacao/perfis/ImportacaoPerfisSegura';
import type {
  ImportacaoPerfisClock,
  ImportacaoPerfisStore,
  PerfilImportacaoGateway
} from './ImportacaoPerfisSeguraPorts';

export interface PrepararImportacaoPerfilRegistro {
  itemId: string;
  linha: number;
  input: PerfilImportacaoSeguraInput;
}

export interface PrepararImportacaoPerfisInput {
  escopo: EscopoImportacaoPerfis;
  registros: PrepararImportacaoPerfilRegistro[];
  substituirRascunhoExistente: boolean;
}

export class PrepararImportacaoPerfisSeguraUseCase {
  constructor(
    private readonly store: ImportacaoPerfisStore,
    private readonly perfis: PerfilImportacaoGateway,
    private readonly clock: ImportacaoPerfisClock
  ) {}

  async execute(input: PrepararImportacaoPerfisInput): Promise<ImportacaoPerfisAggregate> {
    const escopo = validarEscopoImportacaoPerfis(input.escopo);
    this.validarRegistros(input.registros);

    const existente = await this.store.obter(escopo);
    if (existente && !input.substituirRascunhoExistente) {
      throw new ImportacaoPerfisDomainError(
        'Ja existe rascunho para o mesmo usuario, lote, importacao e origem.',
        'RASCUNHO_EXISTENTE_REQUER_DECISAO_EXPLICITA'
      );
    }

    const itens: ImportacaoPerfilItem[] = [];
    for (const registro of input.registros) {
      itens.push(await this.prepararItem(escopo, registro));
    }

    const agora = this.clock.now().toISOString();
    const aggregate: ImportacaoPerfisAggregate = {
      id: chaveEscopoImportacaoPerfis(escopo),
      escopo,
      estado: 'rascunho',
      itens,
      confirmacoes: [],
      criadaEm: existente?.criadaEm ?? agora,
      atualizadaEm: agora
    };

    await this.store.salvar(aggregate);
    return aggregate;
  }

  private validarRegistros(registros: PrepararImportacaoPerfilRegistro[]): void {
    if (registros.length === 0) {
      throw new ImportacaoPerfisDomainError(
        'A importacao precisa conter pelo menos um registro.',
        'IMPORTACAO_SEM_REGISTROS'
      );
    }

    const ids = new Set<string>();
    for (const registro of registros) {
      if (!registro.itemId.trim()) {
        throw new ImportacaoPerfisDomainError(
          'Todo item precisa de identificador estavel.',
          'ITEM_IMPORTACAO_SEM_IDENTIFICADOR'
        );
      }
      if (ids.has(registro.itemId)) {
        throw new ImportacaoPerfisDomainError(
          `Item duplicado no lote: ${registro.itemId}.`,
          'ITEM_IMPORTACAO_DUPLICADO'
        );
      }
      ids.add(registro.itemId);
    }
  }

  private async prepararItem(
    escopo: EscopoImportacaoPerfis,
    registro: PrepararImportacaoPerfilRegistro
  ): Promise<ImportacaoPerfilItem> {
    const falha = validarInputImportacaoPerfil(registro.input);
    if (falha) {
      return {
        id: registro.itemId,
        linha: registro.linha,
        input: registro.input,
        estado: 'rejeitado',
        candidatos: [],
        falha,
        tentativas: 0,
        reprocessado: false
      };
    }

    const candidatos = await this.perfis.localizarCandidatos(escopo, registro.input);
    if (candidatos.length > 0) {
      return {
        id: registro.itemId,
        linha: registro.linha,
        input: registro.input,
        estado: 'pendente',
        candidatos,
        falha: {
          codigo: candidatos.length === 1
            ? 'DECISAO_DUPLICIDADE_PENDENTE'
            : 'MULTIPLOS_CANDIDATOS_DUPLICIDADE',
          mensagem: candidatos.length === 1
            ? 'Existe candidato por identidade estavel. Selecione explicitamente criar, usar ou rejeitar.'
            : 'Existem multiplos candidatos. Associacao automatica foi bloqueada.',
          retryable: true
        },
        tentativas: 0,
        reprocessado: false
      };
    }

    return {
      id: registro.itemId,
      linha: registro.linha,
      input: registro.input,
      estado: 'pronto',
      candidatos: [],
      tentativas: 0,
      reprocessado: false
    };
  }
}
