import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { ItemCatalogo, ItemLote, ItemVariacao } from '../../domain/item/ItemCatalogo';
import { VARIACAO_PADRAO_ITEM } from '../../domain/item/ItemCatalogo';
import type { ItemImportacaoNormalizadaPreview } from '../../domain/item/ItemImportacaoNormalizada';

export interface AplicarDecisoesImportacaoItensResultado {
  importados: ItemCatalogo[];
  ignorados: ItemImportacaoNormalizadaPreview[];
  rejeitados: ItemImportacaoNormalizadaPreview[];
}

export class AplicarDecisoesImportacaoItensUseCase {
  constructor(
    private readonly items: Repository<ItemCatalogo>,
    private readonly clock: Clock,
    private readonly idFactory: () => string,
  ) {}

  async execute(preview: ItemImportacaoNormalizadaPreview[]): Promise<AplicarDecisoesImportacaoItensResultado> {
    const resultado: AplicarDecisoesImportacaoItensResultado = {
      importados: [],
      ignorados: [],
      rejeitados: [],
    };

    for (const item of preview) {
      const importado = await this.aplicarItem(item, resultado);
      if (importado) resultado.importados.push(importado);
    }

    return resultado;
  }

  private async aplicarItem(
    item: ItemImportacaoNormalizadaPreview,
    resultado: AplicarDecisoesImportacaoItensResultado,
  ): Promise<ItemCatalogo | null> {
    if (item.decisao === 'ignorar') {
      resultado.ignorados.push(item);
      return null;
    }

    if (!this.itemPodeSerImportado(item)) {
      resultado.rejeitados.push(item);
      return null;
    }

    if (item.decisao === 'criar_item') return this.criarItem(item);

    const destino = await this.buscarItemDestino(item);
    if (!destino) {
      resultado.rejeitados.push(this.comErro(item, 'Item de destino não encontrado.'));
      return null;
    }

    if (item.decisao === 'criar_variacao_em_item_existente') {
      return this.criarVariacao(destino, item);
    }

    return this.adicionarLote(destino, item, resultado);
  }

  private itemPodeSerImportado(item: ItemImportacaoNormalizadaPreview): boolean {
    return item.valido && !!item.unidade && item.erros.length === 0;
  }

  private async buscarItemDestino(item: ItemImportacaoNormalizadaPreview): Promise<ItemCatalogo | null> {
    if (!item.itemDestinoId) return null;
    return this.items.getById(item.itemDestinoId);
  }

  private async criarItem(item: ItemImportacaoNormalizadaPreview): Promise<ItemCatalogo> {
    const now = this.clock.now().toISOString();
    const novo: ItemCatalogo = {
      id: this.idFactory(),
      nome: this.nomeItem(item),
      categoria: '',
      tags: [],
      variacoes: [this.criarVariacaoCatalogo(item, now)],
      status: 'ativo',
      createdAt: now,
      updatedAt: now,
    };

    return this.items.save(novo);
  }

  private async criarVariacao(destino: ItemCatalogo, item: ItemImportacaoNormalizadaPreview): Promise<ItemCatalogo> {
    const now = this.clock.now().toISOString();
    const atualizado: ItemCatalogo = {
      ...destino,
      variacoes: [...destino.variacoes, this.criarVariacaoCatalogo(item, now)],
      updatedAt: now,
    };

    return this.items.save(atualizado);
  }

  private async adicionarLote(
    destino: ItemCatalogo,
    item: ItemImportacaoNormalizadaPreview,
    resultado: AplicarDecisoesImportacaoItensResultado,
  ): Promise<ItemCatalogo | null> {
    if (!item.variacaoDestinoId) {
      resultado.rejeitados.push(this.comErro(item, 'Variação de destino não encontrada.'));
      return null;
    }

    const now = this.clock.now().toISOString();
    const lote = this.criarLote(item, now);
    const variacoes = destino.variacoes.map(variacao => variacao.id === item.variacaoDestinoId
      ? { ...variacao, lotes: [...variacao.lotes, lote], updatedAt: now }
      : variacao);

    const atualizado: ItemCatalogo = {
      ...destino,
      variacoes,
      updatedAt: now,
    };

    return this.items.save(atualizado);
  }

  private criarVariacaoCatalogo(item: ItemImportacaoNormalizadaPreview, now: string): ItemVariacao {
    return {
      id: this.idFactory(),
      nome: this.nomeVariacao(item),
      unidade: item.unidade!,
      lotes: [this.criarLote(item, now)],
      status: 'ativo',
      createdAt: now,
      updatedAt: now,
    };
  }

  private criarLote(item: ItemImportacaoNormalizadaPreview, now: string): ItemLote {
    const quantidade = item.quantidadeLote;
    const custo = item.custoLote;

    return {
      id: this.idFactory(),
      nome: item.loteNome?.trim() || 'Lote importado',
      valor: item.valorLote,
      custo,
      custoTotal: custo,
      custoUnitario: quantidade ? custo / quantidade : 0,
      quantidade,
      quantidadeGuardada: quantidade,
      dataLancamento: now,
      fracionamentos: [],
      retiradasInternas: [],
      conferencias: [],
      status: 'ativo',
      createdAt: now,
      updatedAt: now,
    };
  }

  private nomeItem(item: ItemImportacaoNormalizadaPreview): string {
    return item.nomeItemFinal?.trim() || item.nomeOriginal.trim();
  }

  private nomeVariacao(item: ItemImportacaoNormalizadaPreview): string {
    return item.nomeVariacaoFinal?.trim() || item.variacaoOriginal?.trim() || VARIACAO_PADRAO_ITEM;
  }

  private comErro(item: ItemImportacaoNormalizadaPreview, erro: string): ItemImportacaoNormalizadaPreview {
    return {
      ...item,
      valido: false,
      erros: [...item.erros, erro],
    };
  }
}
