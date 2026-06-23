import type { FracionamentoLote, ItemLote, LoteConferencia, LoteConferenciaLinha } from '../../domain/item/ItemCatalogo';
import { estoqueBaseDisponivelDoLote, equivalenteDisponivelFracionamento } from '../../domain/item/ItemCatalogo';
import { exigirUnidadeOperacional, unidadeBanco } from '../../domain/item/UnidadeOperacional';
import type { LoteOperacionalEditor } from './LoteOperacionalEditor';

export interface RegistrarInventarioLoteUseCaseInput {
  itemId: string;
  variacaoId: string;
  loteId: string;
  guardadoContadoBase: number;
  fracionamentosContados?: Array<{ fracionamentoId: string; unidadesContadas: number }>;
  balancaId?: string;
  dataHora?: string;
  observacao?: string;
}

interface FracaoContada {
  fracionamento: FracionamentoLote;
  unidadesContadas: number;
}

export class RegistrarInventarioLoteUseCase {
  constructor(
    private readonly editor: LoteOperacionalEditor,
    private readonly idFactory: () => string
  ) {}

  async execute(input: RegistrarInventarioLoteUseCaseInput) {
    if (input.guardadoContadoBase < 0) throw new Error('Inventário não aceita quantidade negativa.');

    return this.editor.edit(input, ({ lote, variacao, now }) => {
      const unidadeOperacional = exigirUnidadeOperacional(variacao.unidade);
      const linhas = this.criarLinhas(lote, input, unidadeBanco(unidadeOperacional));
      const conferencia = this.criarConferencia(lote, linhas, input, input.dataHora || now);

      return {
        ...lote,
        fracionamentos: this.aplicarContagens(lote.fracionamentos, input),
        conferencias: [conferencia, ...lote.conferencias],
        status: conferencia.divergenciaBase === 0 ? 'ativo' : 'divergente'
      };
    });
  }

  private criarLinhas(lote: ItemLote, input: RegistrarInventarioLoteUseCaseInput, unidadeInterna: 'mg' | 'ml'): LoteConferenciaLinha[] {
    const linhas: LoteConferenciaLinha[] = [this.linhaGuardado(lote, input.guardadoContadoBase, unidadeInterna)];

    for (const item of this.fracoesContadas(lote.fracionamentos, input)) {
      linhas.push(this.linhaFracao(item));
    }

    return linhas;
  }

  private linhaGuardado(lote: ItemLote, contadoBase: number, unidadeInterna: 'mg' | 'ml'): LoteConferenciaLinha {
    return {
      id: this.idFactory(),
      origemTipo: 'guardado',
      origemId: lote.id,
      esperado: lote.quantidadeGuardada,
      conferido: contadoBase,
      unidadeContagem: unidadeInterna,
      equivalenteBase: contadoBase,
      divergenciaBase: contadoBase - lote.quantidadeGuardada
    };
  }

  private linhaFracao(item: FracaoContada): LoteConferenciaLinha {
    const esperadoBase = equivalenteDisponivelFracionamento(item.fracionamento);
    const contadoBase = item.unidadesContadas * item.fracionamento.tamanhoFracao;

    return {
      id: this.idFactory(),
      origemTipo: 'fracionamento',
      origemId: item.fracionamento.id,
      esperado: item.fracionamento.quantidadeUnidadesDisponiveis,
      conferido: item.unidadesContadas,
      unidadeContagem: 'un',
      equivalenteBase: contadoBase,
      divergenciaBase: contadoBase - esperadoBase
    };
  }

  private aplicarContagens(fracionamentos: FracionamentoLote[], input: RegistrarInventarioLoteUseCaseInput): FracionamentoLote[] {
    return fracionamentos.map(fracionamento => {
      const contagem = input.fracionamentosContados?.find(atual => atual.fracionamentoId === fracionamento.id);
      if (!contagem) return fracionamento;
      this.validarUnidades(contagem.unidadesContadas);

      return {
        ...fracionamento,
        quantidadeConferida: contagem.unidadesContadas,
        divergenciaUnidades: contagem.unidadesContadas - fracionamento.quantidadeUnidadesDisponiveis,
        status: contagem.unidadesContadas === fracionamento.quantidadeUnidadesDisponiveis ? fracionamento.status : 'divergente'
      };
    });
  }

  private fracoesContadas(fracionamentos: FracionamentoLote[], input: RegistrarInventarioLoteUseCaseInput): FracaoContada[] {
    return (input.fracionamentosContados || []).map(contagem => {
      this.validarUnidades(contagem.unidadesContadas);
      const fracionamento = fracionamentos.find(atual => atual.id === contagem.fracionamentoId);
      if (!fracionamento) throw new Error('Fracionamento não encontrado para inventário.');
      return { fracionamento, unidadesContadas: contagem.unidadesContadas };
    });
  }

  private validarUnidades(unidades: number): void {
    if (!Number.isInteger(unidades) || unidades < 0) {
      throw new Error('Inventário de fracionamento exige quantidade inteira não negativa.');
    }
  }

  private criarConferencia(lote: ItemLote, linhas: LoteConferenciaLinha[], input: RegistrarInventarioLoteUseCaseInput, dataHora: string): LoteConferencia {
    const totalEsperadoBase = estoqueBaseDisponivelDoLote(lote);
    const totalConferidoBase = linhas.reduce((total, linha) => total + linha.equivalenteBase, 0);
    const divergenciaBase = totalConferidoBase - totalEsperadoBase;
    const conferencia: LoteConferencia = {
      id: this.idFactory(),
      dataHora,
      linhas,
      totalEsperadoBase,
      totalConferidoBase,
      divergenciaBase,
      resultado: divergenciaBase === 0 ? 'sem_divergencia' : divergenciaBase < 0 ? 'falta' : 'sobra'
    };

    if (input.balancaId?.trim()) conferencia.balancaId = input.balancaId.trim();
    if (input.observacao?.trim()) conferencia.observacao = input.observacao.trim();
    return conferencia;
  }
}
