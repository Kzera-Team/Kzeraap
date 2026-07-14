import {
  ImportacaoPerfisDomainError,
  chaveEscopoImportacaoPerfis,
  escoposImportacaoPerfisIguais,
  resultadoImportacaoPerfis,
  type ConfirmacaoImportacaoPerfis,
  type DecisaoDuplicidadePerfil,
  type EscopoImportacaoPerfis,
  type ImportacaoPerfilItem,
  type ImportacaoPerfisAggregate,
  type ResultadoImportacaoPerfisEstruturado
} from '../../../domain/importacao/perfis/ImportacaoPerfisSegura';
import type {
  ImportacaoPerfisClock,
  ImportacaoPerfisLock,
  ImportacaoPerfisStore,
  PerfilImportacaoGateway
} from './ImportacaoPerfisSeguraPorts';

export interface ConfirmarImportacaoPerfisSeguraInput {
  escopo: EscopoImportacaoPerfis;
  idempotencyKey: string;
  decisoes: Readonly<Record<string, DecisaoDuplicidadePerfil>>;
  itemIds: string[] | null;
  reprocessamento: boolean;
  reassumirProcessamentoInterrompido: boolean;
}

export class ConfirmarImportacaoPerfisSeguraUseCase {
  constructor(
    private readonly store: ImportacaoPerfisStore,
    private readonly perfis: PerfilImportacaoGateway,
    private readonly lock: ImportacaoPerfisLock,
    private readonly clock: ImportacaoPerfisClock
  ) {}

  async execute(
    input: ConfirmarImportacaoPerfisSeguraInput
  ): Promise<ResultadoImportacaoPerfisEstruturado> {
    const idempotencyKey = input.idempotencyKey.trim();
    if (!idempotencyKey) {
      throw new ImportacaoPerfisDomainError(
        'Chave de idempotencia obrigatoria.',
        'IDEMPOTENCY_KEY_OBRIGATORIA'
      );
    }

    const lockKey = `${chaveEscopoImportacaoPerfis(input.escopo)}::${idempotencyKey}`;
    return this.lock.executarExclusivo(lockKey, async () => this.confirmar(input, idempotencyKey));
  }

  private async confirmar(
    input: ConfirmarImportacaoPerfisSeguraInput,
    idempotencyKey: string
  ): Promise<ResultadoImportacaoPerfisEstruturado> {
    const aggregate = await this.store.obter(input.escopo);
    if (!aggregate || !escoposImportacaoPerfisIguais(aggregate.escopo, input.escopo)) {
      throw new ImportacaoPerfisDomainError(
        'Rascunho nao encontrado no escopo informado.',
        'RASCUNHO_NAO_ENCONTRADO_NO_ESCOPO'
      );
    }

    const existente = aggregate.confirmacoes.find(
      confirmacao => confirmacao.idempotencyKey === idempotencyKey
    );

    if (existente?.estado === 'concluida' && existente.resultado) {
      return existente.resultado;
    }

    if (existente?.estado === 'cancelada' && existente.resultado) {
      return existente.resultado;
    }

    if (existente?.estado === 'processando' && !input.reassumirProcessamentoInterrompido) {
      throw new ImportacaoPerfisDomainError(
        'Confirmacao ja esta em processamento. Reassuncao exige comando explicito.',
        'DUPLA_SUBMISSAO_BLOQUEADA'
      );
    }

    if (aggregate.estado === 'cancelada') {
      throw new ImportacaoPerfisDomainError(
        'Importacao cancelada nao pode ser confirmada.',
        'IMPORTACAO_CANCELADA'
      );
    }

    const confirmacao = this.iniciarConfirmacao(aggregate, existente, idempotencyKey);
    aggregate.estado = 'confirmando';
    await this.salvar(aggregate, confirmacao);

    const alvos = input.itemIds ? new Set(input.itemIds) : null;
    for (const item of aggregate.itens) {
      if (alvos && !alvos.has(item.id)) continue;
      if (item.estado === 'importado' || item.estado === 'cancelado') continue;
      if (item.estado === 'rejeitado' && (!item.falha?.retryable || !input.reprocessamento)) continue;

      const decisao = input.decisoes[item.id];
      if (decisao) item.decisao = decisao;
      if (input.reprocessamento) item.reprocessado = true;

      await this.processarItem(aggregate, confirmacao, item, idempotencyKey);
    }

    aggregate.estado = this.calcularEstadoFinal(aggregate);
    const resultado = resultadoImportacaoPerfis(aggregate);
    confirmacao.estado = 'concluida';
    confirmacao.resultado = resultado;
    confirmacao.atualizadaEm = this.clock.now().toISOString();
    aggregate.atualizadaEm = confirmacao.atualizadaEm;
    await this.store.salvar(aggregate);
    return resultado;
  }

  private iniciarConfirmacao(
    aggregate: ImportacaoPerfisAggregate,
    existente: ConfirmacaoImportacaoPerfis | undefined,
    idempotencyKey: string
  ): ConfirmacaoImportacaoPerfis {
    const agora = this.clock.now().toISOString();
    if (existente) {
      existente.estado = 'processando';
      existente.atualizadaEm = agora;
      delete existente.resultado;
      return existente;
    }

    const confirmacao: ConfirmacaoImportacaoPerfis = {
      idempotencyKey,
      estado: 'processando',
      iniciadaEm: agora,
      atualizadaEm: agora
    };
    aggregate.confirmacoes.push(confirmacao);
    return confirmacao;
  }

  private async processarItem(
    aggregate: ImportacaoPerfisAggregate,
    confirmacao: ConfirmacaoImportacaoPerfis,
    item: ImportacaoPerfilItem,
    idempotencyKey: string
  ): Promise<void> {
    if (item.estado === 'pendente') {
      if (!item.decisao) return;
      if (item.decisao.tipo === 'rejeitar') {
        item.estado = 'rejeitado';
        item.falha = {
          codigo: 'DUPLICIDADE_REJEITADA_EXPLICITAMENTE',
          mensagem: item.decisao.motivo,
          retryable: false
        };
        await this.salvar(aggregate, confirmacao);
        return;
      }

      if (item.decisao.tipo === 'usar_existente') {
        await this.usarExistente(aggregate, confirmacao, item);
        return;
      }

      if (item.candidatos.length > 0 && !item.decisao.confirmarApesarDeDuplicidade) {
        item.falha = {
          codigo: 'CRIACAO_COM_DUPLICIDADE_NAO_CONFIRMADA',
          mensagem: 'Criacao de novo perfil exige confirmacao explicita diante de candidatos.',
          retryable: true
        };
        await this.salvar(aggregate, confirmacao);
        return;
      }
    }

    await this.criarPerfil(aggregate, confirmacao, item, idempotencyKey);
  }

  private async usarExistente(
    aggregate: ImportacaoPerfisAggregate,
    confirmacao: ConfirmacaoImportacaoPerfis,
    item: ImportacaoPerfilItem
  ): Promise<void> {
    const decisao = item.decisao;
    if (!decisao || decisao.tipo !== 'usar_existente') return;

    const candidatoPermitido = item.candidatos.some(
      candidato => candidato.perfilId === decisao.perfilId
    );
    if (!candidatoPermitido) {
      item.estado = 'pendente';
      item.falha = {
        codigo: 'PERFIL_FORA_DOS_CANDIDATOS_DO_ITEM',
        mensagem: 'O perfil selecionado nao pertence aos candidatos deste item e escopo.',
        retryable: true
      };
      await this.salvar(aggregate, confirmacao);
      return;
    }

    const perfil = await this.perfis.obterPorId(aggregate.escopo, decisao.perfilId);
    if (!perfil) {
      item.estado = 'pendente';
      item.falha = {
        codigo: 'PERFIL_CANDIDATO_NAO_ENCONTRADO_NO_ESCOPO',
        mensagem: 'O perfil selecionado nao esta disponivel no escopo da usuaria.',
        retryable: true
      };
      await this.salvar(aggregate, confirmacao);
      return;
    }

    item.estado = 'importado';
    item.perfilId = decisao.perfilId;
    item.acaoImportacao = 'existente';
    item.tentativas += 1;
    delete item.falha;
    await this.salvar(aggregate, confirmacao);
  }

  private async criarPerfil(
    aggregate: ImportacaoPerfisAggregate,
    confirmacao: ConfirmacaoImportacaoPerfis,
    item: ImportacaoPerfilItem,
    idempotencyKey: string
  ): Promise<void> {
    item.tentativas += 1;
    const operationKey = `${chaveEscopoImportacaoPerfis(aggregate.escopo)}::${idempotencyKey}::${item.id}`;

    try {
      const criado = await this.perfis.criar(aggregate.escopo, item.input, operationKey);
      item.estado = 'importado';
      item.perfilId = criado.perfilId;
      item.acaoImportacao = 'criado';
      delete item.falha;
    } catch (error) {
      item.estado = 'rejeitado';
      item.falha = {
        codigo: 'FALHA_PERSISTENCIA_PERFIL',
        mensagem: error instanceof Error ? error.message : 'Falha desconhecida ao persistir perfil.',
        retryable: true
      };
    }

    await this.salvar(aggregate, confirmacao);
  }

  private calcularEstadoFinal(aggregate: ImportacaoPerfisAggregate): ImportacaoPerfisAggregate['estado'] {
    const temPendente = aggregate.itens.some(item => item.estado === 'pendente');
    const temRejeitado = aggregate.itens.some(item => item.estado === 'rejeitado');
    return temPendente || temRejeitado ? 'parcial' : 'concluida';
  }

  private async salvar(
    aggregate: ImportacaoPerfisAggregate,
    confirmacao: ConfirmacaoImportacaoPerfis
  ): Promise<void> {
    const agora = this.clock.now().toISOString();
    aggregate.atualizadaEm = agora;
    confirmacao.atualizadaEm = agora;
    await this.store.salvar(aggregate);
  }
}
