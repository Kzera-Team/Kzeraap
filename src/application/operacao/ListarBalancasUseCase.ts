import type { Repository } from '../ports/Repository';
import type { Balanca } from '../../domain/operacao/Balanca';

export class ListarBalancasUseCase {
  constructor(private readonly balancas: Repository<Balanca>) {}

  async execute(): Promise<Balanca[]> {
    return (await this.balancas.list()).sort((a, b) => {
      if (a.padrao !== b.padrao) return a.padrao ? -1 : 1;
      if (a.status !== b.status) return a.status === 'ativa' ? -1 : 1;
      return a.nome.localeCompare(b.nome, 'pt-BR');
    });
  }
}
