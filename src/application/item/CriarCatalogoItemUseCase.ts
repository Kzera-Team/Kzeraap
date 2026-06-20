import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { ItemCatalogo, ItemUnidade, ItemVariacao, ItemLote } from '../../domain/item/ItemCatalogo';
import { assertItemValido, validarVariacoes, VARIACAO_PADRAO_ITEM } from '../../domain/item/ItemCatalogo';

export interface CriarCatalogoItemInput {
  nome: string;
  categoria?: string;
  descricao?: string;
  tags?: string[];
  observacao?: string;
  unidade?: ItemUnidade;
  loteValor?: number;
  loteCusto?: number;
  loteQuantidade?: number;
  variacoes?: ItemVariacao[];
}

export class CriarCatalogoItemUseCase {
  constructor(private readonly items: Repository<ItemCatalogo>, private readonly clock: Clock, private readonly idFactory: () => string) {}

  async execute(input: CriarCatalogoItemInput): Promise<ItemCatalogo> {
    assertItemValido({ nome: input.nome });
    const now = this.clock.now().toISOString();
    const unidade = input.unidade || 'un';
    const quantidadeLote = input.loteQuantidade || 0;
    const loteAtivo = quantidadeLote > 0;
    const loteInicial: ItemLote = {
      id: this.idFactory(),
      nome: 'Lote inicial',
      valor: input.loteValor || 0,
      custo: input.loteCusto || 0,
      custoTotal: input.loteCusto || 0,
      custoUnitario: quantidadeLote ? (input.loteCusto || 0) / quantidadeLote : 0,
      quantidade: quantidadeLote,
      quantidadeGuardada: quantidadeLote,
      dataLancamento: now,
      fracionamentos: [],
      retiradasInternas: [],
      conferencias: [],
      status: loteAtivo ? 'ativo' : 'encerrado',
      createdAt: now,
      updatedAt: now
    };
    if (!loteAtivo) loteInicial.observacao = 'Lote inicial sem quantidade; não entra como estoque ativo.';
    const variacoes: ItemVariacao[] = input.variacoes?.length ? input.variacoes : [{
      id: this.idFactory(),
      nome: VARIACAO_PADRAO_ITEM,
      unidade,
      status: 'ativo',
      createdAt: now,
      updatedAt: now,
      lotes: [loteInicial]
    }];
    validarVariacoes(variacoes);
    const item: ItemCatalogo = {
      id: this.idFactory(),
      nome: input.nome.trim(),
      categoria: input.categoria?.trim() || '',
      tags: input.tags || [],
      variacoes,
      status: 'ativo',
      createdAt: now,
      updatedAt: now
    };

    if (input.descricao !== undefined) item.descricao = input.descricao;
    if (input.observacao !== undefined) item.observacao = input.observacao;

    return this.items.save(item);
  }
}
