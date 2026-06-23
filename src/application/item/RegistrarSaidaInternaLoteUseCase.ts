import type { FracionamentoLote, ItemLote, ItemUnidade, RetiradaInternaEstoque, RetiradaInternaMotivo } from '../../domain/item/ItemCatalogo';
import { estoqueBaseDisponivelDoLote } from '../../domain/item/ItemCatalogo';
import type { LoteOperacionalEditor } from './LoteOperacionalEditor';

export interface RegistrarSaidaInternaLoteUseCaseInput {
  itemId: string;
  variacaoId: string;
  loteId: string;
  origemTipo: 'guardado' | 'fracionamento';
  origemId?: string;
  quantidade: number;
  motivo: RetiradaInternaMotivo;
  dataHora?: string;
  observacao?: string;
}

export class RegistrarSaidaInternaLoteUseCase {
  constructor(
    private readonly editor: LoteOperacionalEditor,
    private readonly idFactory: () => string
  ) {}

  async execute(input: RegistrarSaidaInternaLoteUseCaseInput) {
    this.validarInput(input);

    return this.editor.edit(input, ({ lote, variacao, now }) => {
      if (lote.status === 'encerrado') throw new Error('Lote encerrado não aceita saída interna.');
      const dataHora = input.dataHora || now;

      if (input.origemTipo === 'guardado') {
        return this.saidaGuardado(lote, variacao.unidade, input, dataHora);
      }

      return this.saidaFracionamento(lote, variacao.unidade, input, dataHora);
    });
  }

  private validarInput(input: RegistrarSaidaInternaLoteUseCaseInput): void {
    if (input.quantidade <= 0) throw new Error('Saída interna exige quantidade maior que zero.');
  }

  private saidaGuardado(lote: ItemLote, unidadeBase: ItemUnidade, input: RegistrarSaidaInternaLoteUseCaseInput, dataHora: string): ItemLote {
    if (input.quantidade > lote.quantidadeGuardada) {
      throw new Error('Saída interna maior que o guardado/a granel disponível.');
    }

    return this.comStatusAtualizado({
      ...lote,
      quantidadeGuardada: lote.quantidadeGuardada - input.quantidade,
      retiradasInternas: [
        ...lote.retiradasInternas,
        this.criarRegistro(lote.id, 'guardado', input.quantidade, unidadeBase, input, dataHora)
      ]
    });
  }

  private saidaFracionamento(lote: ItemLote, unidadeBase: ItemUnidade, input: RegistrarSaidaInternaLoteUseCaseInput, dataHora: string): ItemLote {
    if (!input.origemId) throw new Error('Saída de fracionamento exige origem.');
    if (!Number.isInteger(input.quantidade)) throw new Error('Saída de fracionamento exige quantidade inteira de frações.');

    const fracionamento = this.encontrarFracionamento(lote.fracionamentos, input.origemId);
    if (input.quantidade > fracionamento.quantidadeUnidadesDisponiveis) {
      throw new Error('Saída interna maior que as frações disponíveis.');
    }

    const quantidadeBase = input.quantidade * fracionamento.tamanhoFracao;

    return this.comStatusAtualizado({
      ...lote,
      fracionamentos: this.baixarFracao(lote.fracionamentos, fracionamento.id, input.quantidade),
      retiradasInternas: [
        ...lote.retiradasInternas,
        this.criarRegistro(fracionamento.id, 'fracionamento', quantidadeBase, unidadeBase, input, dataHora)
      ]
    });
  }

  private encontrarFracionamento(fracionamentos: FracionamentoLote[], fracionamentoId: string): FracionamentoLote {
    const fracionamento = fracionamentos.find(atual => atual.id === fracionamentoId);
    if (!fracionamento) throw new Error('Fracionamento não encontrado.');
    return fracionamento;
  }

  private baixarFracao(fracionamentos: FracionamentoLote[], fracionamentoId: string, quantidade: number): FracionamentoLote[] {
    return fracionamentos.map(fracionamento => {
      if (fracionamento.id !== fracionamentoId) return fracionamento;
      return {
        ...fracionamento,
        quantidadeUnidadesDisponiveis: fracionamento.quantidadeUnidadesDisponiveis - quantidade
      };
    });
  }

  private criarRegistro(
    origemId: string,
    origemTipo: 'guardado' | 'fracionamento',
    quantidade: number,
    unidade: ItemUnidade,
    input: RegistrarSaidaInternaLoteUseCaseInput,
    dataHora: string
  ): RetiradaInternaEstoque {
    const registro: RetiradaInternaEstoque = {
      id: this.idFactory(),
      origemTipo,
      origemId,
      quantidade,
      unidade,
      motivo: input.motivo,
      dataHora
    };

    if (input.observacao?.trim()) registro.observacao = input.observacao.trim();
    return registro;
  }

  private comStatusAtualizado(lote: ItemLote): ItemLote {
    return {
      ...lote,
      status: estoqueBaseDisponivelDoLote(lote) === 0 ? 'encerrado' : lote.status
    };
  }
}
