import type { Repository } from '../ports/Repository';
import type { ItemCatalogo, ItemVariacao } from '../../domain/item/ItemCatalogo';
import { VARIACAO_PADRAO_ITEM } from '../../domain/item/ItemCatalogo';
import type { ItemImportacaoPreviewRegistro } from '../../domain/item/ItemImportacao';
import type { DecisaoImportacaoItem, ItemImportacaoNormalizadaPreview } from '../../domain/item/ItemImportacaoNormalizada';

interface DestinoSugerido {
  decisao: DecisaoImportacaoItem;
  itemDestinoId?: string;
  variacaoDestinoId?: string;
  nomeItemFinal?: string;
  nomeVariacaoFinal?: string;
}

export class SugerirDecisoesImportacaoItensUseCase {
  constructor(
    private readonly items: Repository<ItemCatalogo>,
    private readonly idFactory: () => string,
  ) {}

  async execute(preview: ItemImportacaoPreviewRegistro[]): Promise<ItemImportacaoNormalizadaPreview[]> {
    const catalogo = await this.items.list();

    return preview.map(item => this.criarPreviewNormalizada(item, catalogo));
  }

  private criarPreviewNormalizada(
    item: ItemImportacaoPreviewRegistro,
    catalogo: ItemCatalogo[],
  ): ItemImportacaoNormalizadaPreview {
    const destino = item.valido ? this.sugerirDestino(item, catalogo) : this.ignorarItemInvalido(item);

    return {
      id: this.idFactory(),
      index: item.index,
      nomeOriginal: item.nome,
      variacaoOriginal: item.variacaoNome || item.categoria,
      unidade: item.unidade,
      quantidadeLote: item.quantidadeLote ?? 0,
      custoLote: item.custoLote ?? 0,
      valorLote: item.valorLote ?? 0,
      loteNome: item.loteNome,
      ...destino,
      valido: item.valido,
      erros: item.erros,
    };
  }

  private ignorarItemInvalido(item: ItemImportacaoPreviewRegistro): DestinoSugerido {
    return {
      decisao: 'ignorar',
      nomeItemFinal: item.nome,
      nomeVariacaoFinal: this.nomeVariacao(item),
    };
  }

  private sugerirDestino(item: ItemImportacaoPreviewRegistro, catalogo: ItemCatalogo[]): DestinoSugerido {
    const itemExato = catalogo.find(atual => this.nomesIguais(atual.nome, item.nome));

    if (itemExato) return this.sugerirDentroDoItem(item, itemExato);

    const itemParecido = catalogo.find(atual => this.itemParecePertencerAoCatalogo(item.nome, atual.nome));

    if (itemParecido) {
      return {
        decisao: 'criar_variacao_em_item_existente',
        itemDestinoId: itemParecido.id,
        nomeItemFinal: itemParecido.nome,
        nomeVariacaoFinal: this.nomeVariacao(item, itemParecido.nome),
      };
    }

    return {
      decisao: 'criar_item',
      nomeItemFinal: item.nome,
      nomeVariacaoFinal: this.nomeVariacao(item),
    };
  }

  private sugerirDentroDoItem(item: ItemImportacaoPreviewRegistro, existente: ItemCatalogo): DestinoSugerido {
    const variacaoNome = this.nomeVariacao(item);
    const variacao = this.encontrarVariacao(existente, variacaoNome);

    if (variacao) {
      return {
        decisao: 'adicionar_lote_em_variacao_existente',
        itemDestinoId: existente.id,
        variacaoDestinoId: variacao.id,
        nomeItemFinal: existente.nome,
        nomeVariacaoFinal: variacao.nome,
      };
    }

    return {
      decisao: 'criar_variacao_em_item_existente',
      itemDestinoId: existente.id,
      nomeItemFinal: existente.nome,
      nomeVariacaoFinal: variacaoNome,
    };
  }

  private encontrarVariacao(item: ItemCatalogo, nome: string): ItemVariacao | undefined {
    return item.variacoes.find(variacao => this.nomesIguais(variacao.nome, nome));
  }

  private nomeVariacao(item: ItemImportacaoPreviewRegistro, nomeItemFinal?: string): string {
    const variacao = item.variacaoNome?.trim() || item.categoria?.trim();
    if (variacao) return variacao;

    if (nomeItemFinal && this.itemParecePertencerAoCatalogo(item.nome, nomeItemFinal)) {
      return item.nome.replace(new RegExp(nomeItemFinal, 'i'), '').trim() || VARIACAO_PADRAO_ITEM;
    }

    return VARIACAO_PADRAO_ITEM;
  }

  private itemParecePertencerAoCatalogo(nomeImportado: string, nomeCatalogo: string): boolean {
    const importado = this.normalizar(nomeImportado);
    const catalogo = this.normalizar(nomeCatalogo);

    return importado.includes(catalogo) || catalogo.includes(importado);
  }

  private nomesIguais(a: string, b: string): boolean {
    return this.normalizar(a) === this.normalizar(b);
  }

  private normalizar(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }
}
