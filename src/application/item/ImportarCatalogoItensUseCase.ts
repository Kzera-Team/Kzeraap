import type { Repository } from '../ports/Repository';
import type { Clock } from '../../core/Clock';
import type { ItemCatalogo, ItemVariacao } from '../../domain/item/ItemCatalogo';
import { VARIACAO_PADRAO_ITEM } from '../../domain/item/ItemCatalogo';
import type { ItemImportacaoPreviewRegistro } from '../../domain/item/ItemImportacao';
import { criarLoteImportado } from '../../domain/item/ItemImportacaoLoteFactory';
import { nomesItemImportacaoIguais } from '../../domain/item/ItemImportacaoNormalizacao';
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
    const variacaoNome = this.variacaoNome(item);
    const variacoes: ItemVariacao[] = [{
      id: this.idFactory(),
      nome: variacaoNome,
      unidade: item.unidade || 'un',
      status: 'ativo',
      createdAt: now,
      updatedAt: now,
      lotes: [this.criarLote(item, now)]
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

  private criarLote(item: ItemImportacaoPreviewRegistro, now: string) {
    return criarLoteImportado({
      id: this.idFactory(),
      nome: item.loteNome,
      valor: item.valorLote || 0,
      custo: item.custoLote || 0,
      quantidade: item.quantidadeLote || 0,
      dataLancamento: now,
    });
  }

  private variacaoNome(item: ItemImportacaoPreviewRegistro): string {
    return item.variacaoNome?.trim() || item.categoria?.trim() || VARIACAO_PADRAO_ITEM;
  }

  private mesclarTags(atual: string[], novas: string[] = []): string[] {
    return Array.from(new Set([...atual, ...novas]));
  }

  private async importarOuAtualizar(item: ItemImportacaoPreviewRegistro, existentes: ItemCatalogo[]): Promise<ItemCatalogo> {
    const existente = existentes.find(atual => nomesItemImportacaoIguais(atual.nome, item.nome));
    if (!existente) return this.criar.execute(this.toInput(item));

    const now = this.clock.now().toISOString();
    const variacaoNome = this.variacaoNome(item);
    const variacaoExistente = existente.variacoes.find(variacao => nomesItemImportacaoIguais(variacao.nome, variacaoNome));
    const lote = this.criarLote(item, now);

    const variacoes = variacaoExistente
      ? existente.variacoes.map(variacao => variacao.id === variacaoExistente.id
        ? { ...variacao, lotes: [...variacao.lotes, lote], updatedAt: now }
        : variacao)
      : [...existente.variacoes, {
        id: this.idFactory(),
        nome: variacaoNome,
        unidade: item.unidade || 'un',
        status: 'ativo' as const,
        createdAt: now,
        updatedAt: now,
        lotes: [lote]
      }];

    const atualizado: ItemCatalogo = {
      ...existente,
      categoria: existente.categoria || item.categoriaReal || '',
      tags: this.mesclarTags(existente.tags, item.tags),
      variacoes,
      updatedAt: now
    };

    if (!atualizado.descricao && item.descricao !== undefined) atualizado.descricao = item.descricao;
    if (!atualizado.observacao && item.observacao !== undefined) atualizado.observacao = item.observacao;

    const salvo = await this.items.save(atualizado);
    const index = existentes.findIndex(atual => atual.id === salvo.id);
    if (index >= 0) existentes[index] = salvo;
    return salvo;
  }

  async execute(preview: ItemImportacaoPreviewRegistro[]): Promise<ImportarCatalogoItensResultado> {
    const importados: ItemCatalogo[] = [];
    const rejeitados = preview.filter(item => !item.valido);
    const validos = preview.filter(item => item.valido);
    const existentes = await this.items.list();

    try {
      for (const item of validos) importados.push(await this.importarOuAtualizar(item, existentes));
      return { importados, rejeitados };
    } finally {
      releaseObject(validos);
    }
  }
}
