import type { Repository } from '../ports/Repository';
import {
  normalizarTextoBusca,
  statusRegistroPorPendencias,
  type RegistroImportacaoTransacao
} from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

export interface ReprocessarPendenciasPerfilResultado {
  reprocessados: number;
}

export class ReprocessarPendenciasPerfilUseCase {
  constructor(
    private readonly registros: Repository<RegistroImportacaoTransacao>,
    private readonly now: () => string
  ) {}

  async execute(nomePerfil: string, perfilId: string): Promise<ReprocessarPendenciasPerfilResultado> {
    const nomeNormalizado = normalizarTextoBusca(nomePerfil);
    const todos = await this.registros.list();
    const pendentes = todos.filter(r => r.status === 'pendente_cliente' && r.dadosNormalizados);

    let reprocessados = 0;

    for (const registro of pendentes) {
      const clienteNome = registro.dadosNormalizados!.clienteNome;
      if (normalizarTextoBusca(clienteNome) !== nomeNormalizado) continue;

      const pendenciasAtualizadas = registro.pendencias.filter(p => p.tipo !== 'cliente_nao_encontrado');

      await this.registros.save({
        ...registro,
        perfilIdResolvido: perfilId,
        pendencias: pendenciasAtualizadas,
        status: statusRegistroPorPendencias(pendenciasAtualizadas),
        updatedAt: this.now()
      });

      reprocessados++;
    }

    return { reprocessados };
  }
}
