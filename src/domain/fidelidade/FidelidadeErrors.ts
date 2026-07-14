export class FidelidadeError extends Error {
  constructor(message: string, readonly code: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValorInvalidoError extends FidelidadeError {
  constructor(campo: string) {
    super(`${campo} deve ser um inteiro positivo.`, 'VALOR_INVALIDO');
  }
}

export class EntidadeNaoEncontradaError extends FidelidadeError {
  constructor(entidade: string) {
    super(`${entidade} não encontrada.`, 'ENTIDADE_NAO_ENCONTRADA');
  }
}

export class RegraInativaError extends FidelidadeError {
  constructor() {
    super('A regra de fidelidade informada está inativa.', 'REGRA_INATIVA');
  }
}

export class SaldoInsuficienteError extends FidelidadeError {
  constructor() {
    super('Saldo de pontos insuficiente para o resgate.', 'SALDO_INSUFICIENTE');
  }
}

export class ConflitoConcorrenciaError extends FidelidadeError {
  constructor() {
    super('A conta de fidelidade foi alterada concorrentemente.', 'CONFLITO_CONCORRENCIA');
  }
}

export class DecisaoProdutoPendenteError extends FidelidadeError {
  constructor(decisao: string) {
    super(`Decisão de Produto obrigatória não definida: ${decisao}.`, 'DECISAO_PRODUTO_PENDENTE');
  }
}
