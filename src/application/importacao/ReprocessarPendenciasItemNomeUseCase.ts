import type { Repository } from '../ports/Repository';
import {
  normalizarTextoBusca,
  statusRegistroPorPendencias,
  type RegistroImportacaoTransacao
} from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

export interface ReprocessarPendenciasItemNomeResultado {
  reprocessados: number;
}

export class ReprocessarPendenciasItemNomeUseCase {
  constructor(
    private readonly registros: Repository<RegistroImportacaoTransacao>,
    private readonly now: () => string
  ) {}

  async execute(nomeItem: string, itemId: string): Promise<ReprocessarPendenciasItemNomeResultado> {
    const nomeNormalizado = normalizarTextoBusca(nomeItem);
    const todos = await this.registros.list();
    const pendentes = todos.filter(r => r.status === 'pendente_item' && r.dadosNormalizados);

    let reprocessados = 0;

    for (const registro of pendentes) {
      let modificou = false;

      const itensAtualizados = registro.dadosNormalizados!.itens.map(item => {
        const temPendencia = item.pendencias.some(p => p.tipo === 'item_nao_encontrado');
        if (!temPendencia || normalizarTextoBusca(item.nomeItem) !== nomeNormalizado) return item;

        modificou = true;
        return {
          ...item,
          itemIdResolvido: itemId,
          pendencias: item.pendencias.filter(p => p.tipo !== 'item_nao_encontrado')
        };
      });

      if (!modificou) continue;

      const aindaTemItemPendente = itensAtualizados.some(item =>
        item.pendencias.some(p => p.tipo === 'item_nao_encontrado')
      );

      const pendenciasAtualizadas = registro.pendencias.filter(p => {
        if (p.tipo !== 'item_nao_encontrado') return true;
        if (p.valor !== undefined && normalizarTextoBusca(p.valor) === nomeNormalizado) return false;
        if (p.valor === undefined && !aindaTemItemPendente) return false;
        return true;
      });

      await this.registros.save({
        ...registro,
        dadosNormalizados: { ...registro.dadosNormalizados!, itens: itensAtualizados },
        pendencias: pendenciasAtualizadas,
        status: statusRegistroPorPendencias(pendenciasAtualizadas),
        updatedAt: this.now()
      });

      reprocessados++;
    }

    return { reprocessados };
  }
}
