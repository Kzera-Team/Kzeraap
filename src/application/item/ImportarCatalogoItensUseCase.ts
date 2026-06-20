import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { ItemCatalogo, ItemVariacao } from '../../domain/item/ItemCatalogo';
import { VARIACAO_PADRAO_ITEM } from '../../domain/item/ItemCatalogo';
import type { ItemImportacaoPreviewRegistro } from '../../domain/item/ItemImportacao';
import { CriarCatalogoItemUseCase, type CriarCatalogoItemInput } from './CriarCatalogoItemUseCase';
import { releaseObject } from '../../runtime/RuntimeCleanup';

export interface ImportarCatalogoItensResultado {
  importados: ItemCatalogo[];
  rejeitados: ItemImportacaoPreviewRegistro[];
}

export class ImportarCatalogoItensUseCase {
  private readonly criar: CriarCatalogoItemUseCase;

  constructor(private readonly items: Repository<ItemCatalogo>, private readonly clock: Clock, private readonly idFactory: () => string) {
    this.criar = new CriarCatalogoItemUseCase(items, clock, idFactory);
  }

  private toInput(item: ItemImportacaoPreviewRegistro): CriarCatalogoItemInput {
    const now = this.clock.now().toISOString();
    const variacaoNome = item.variacaoNome?.trim() || item.categoria?.trim() || VARIACAO_PADRAO_ITEM;
    const variacoes: ItemVariacao[] = [{
      id: this.idFactory(),
      nome: variacaoNome,
      unidade: item.unidade,
      status: 'ativo',
      createdAt: now,
      updatedAt: now,
      lotes: [{
        id: this.idFactory(),
        nome: item.loteNome?.trim() || 'Lote importado',
        valor: item.valorLote || 0,
        custo: item.custoLote || 0,
        custoTotal: item.custoLote || 0,
        custoUnitario: item.quantidadeLote ? (item.custoLote || 0) / item.quantidadeLote : 0,
        quantidade: item.quantidadeLote || 0,
        quantidadeGuardada: item.quantidadeLote || 0,
        dataLancamento: now,
        fracionamentos: [],
        retiradasInternas: [],
        conferencias: [],
        status: 'ativo',
        createdAt: now,
        updatedAt: now
      }]
    }];

    const input: CriarCatalogoItemInput = {
      nome: item.nome,
      categoria: item.categoriaReal || '',
      variacoes,
      tags: item.tags || []
    };

    if (item.descricao !== undefined) input.descricao = item.descricao;
    if (item.observacao !== undefined) input.observacao = item.observacao;

    return input;
  }

  async execute(preview: ItemImportacaoPreviewRegistro[]): Promise<ImportarCatalogoItensResultado> {
    const importados: ItemCatalogo[] = [];
    const rejeitados = preview.filter(item => !item.valido);
    const validos = preview.filter(item => item.valido);

    try {
      for (const item of validos) importados.push(await this.criar.execute(this.toInput(item)));
      return { importados, rejeitados };
    } finally {
      releaseObject(validos);
    }
  }
}
