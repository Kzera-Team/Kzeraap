import type { Repository } from '../ports/Repository';
import {
  normalizarTextoBusca,
  statusRegistroPorPendencias,
  type RegistroImportacaoTransacao,
  type RegistroImportacaoFinanceira
} from '../../domain/importacao/ImportacaoTransacoesFinanceiro';

export interface ReprocessarPendenciasPerfilResultado {
  reprocessados: number;
}

async function reprocessarRegistros<T extends RegistroImportacaoTransacao | RegistroImportacaoFinanceira>(
  registros: Repository<T>,
  nomeNormalizado: string,
  perfilId: string,
  now: string
): Promise<number> {
  const todos = await registros.list();
  const pendentes = todos.filter(r => r.status === 'pendente_cliente' && r.dadosNormalizados);
  let reprocessados = 0;
  for (const registro of pendentes) {
    const clienteNome = registro.dadosNormalizados!.clienteNome;
    if (normalizarTextoBusca(clienteNome) !== nomeNormalizado) continue;
    const pendenciasAtualizadas = registro.pendencias.filter(p => p.tipo !== 'cliente_nao_encontrado');
    await registros.save({
      ...registro,
      perfilIdResolvido: perfilId,
      pendencias: pendenciasAtualizadas,
      status: statusRegistroPorPendencias(pendenciasAtualizadas),
      updatedAt: now
    } as T);
    reprocessados++;
  }
  return reprocessados;
}

export class ReprocessarPendenciasPerfilUseCase {
  constructor(
    private readonly registrosTransacao: Repository<RegistroImportacaoTransacao>,
    private readonly registrosFinanceiro: Repository<RegistroImportacaoFinanceira>,
    private readonly now: () => string
  ) {}

  async execute(nomePerfil: string, perfilId: string): Promise<ReprocessarPendenciasPerfilResultado> {
    const nomeNormalizado = normalizarTextoBusca(nomePerfil);
    const now = this.now();
    const [transacao, financeiro] = await Promise.all([
      reprocessarRegistros(this.registrosTransacao, nomeNormalizado, perfilId, now),
      reprocessarRegistros(this.registrosFinanceiro, nomeNormalizado, perfilId, now)
    ]);
    return { reprocessados: transacao + financeiro };
  }
}
